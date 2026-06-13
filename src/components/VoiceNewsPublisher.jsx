import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Mic,
  Square,
  Loader,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";

export default function VoiceNewsPublisher({ onNewsPublished }) {
  const [title, setTitle] = useState("");
  const [sourceMode, setSourceMode] = useState("record"); // 'record' | 'upload'
  const [isRecording, setIsRecording] = useState(false);
  const [blobUrl, setBlobUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const inputRef = useRef(null);
  const leftchannelRef = useRef([]);
  const recordingLengthRef = useRef(0);

  // Start recording audio as WAV PCM at browser's native sample rate
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext(); // Use native sample rate for maximum hardware compatibility and stability
      audioContextRef.current = context;

      // Explicitly resume the context to bypass browser autoplay policies
      if (context.state === "suspended") {
        await context.resume();
      }

      const input = context.createMediaStreamSource(stream);
      inputRef.current = input;

      // 2048 buffer size, 1 input channel, 1 output channel
      const processor = context.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      leftchannelRef.current = [];
      recordingLengthRef.current = 0;

      processor.onaudioprocess = (e) => {
        const left = e.inputBuffer.getChannelData(0);
        leftchannelRef.current.push(new Float32Array(left));
        recordingLengthRef.current += left.length;
      };

      input.connect(processor);
      processor.connect(context.destination);

      setIsRecording(true);
      setStatus({ type: "", message: "" });
      setBlobUrl("");
      setAudioBlob(null);
      setTranscribedText("");
    } catch (err) {
      console.error("Failed to start recording:", err);
      setStatus({
        type: "error",
        message: "Microphone access denied or unsupported.",
      });
    }
  };

  // Stop recording and compile WAV file
  const stopRecording = () => {
    if (!isRecording) return;

    // Capture the native sample rate before closing the context
    const sampleRate = audioContextRef.current
      ? audioContextRef.current.sampleRate
      : 44100;

    // Disconnect audio nodes and close stream
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
    }
    if (inputRef.current) {
      inputRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsRecording(false);

    // Merge Float32 samples
    const leftBuffer = mergeBuffers(
      leftchannelRef.current,
      recordingLengthRef.current,
    );

    // Create WAV Blob using the hardware's native sample rate
    const wavBlob = createWavBlob(leftBuffer, sampleRate);
    const url = URL.createObjectURL(wavBlob);
    setBlobUrl(url);
    setAudioBlob(wavBlob);
  };

  // Decode and process an uploaded audio file (e.g. MP3, M4A from phone) into standard PCM WAV
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setStatus({ type: "", message: "" });
    setBlobUrl("");
    setAudioBlob(null);

    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;

        // Use browser AudioContext to decode compressed formats (MP3, M4A, AAC, etc.)
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const tempCtx = new AudioContext();

        const audioBuffer = await tempCtx.decodeAudioData(arrayBuffer);

        // Extract PCM samples from the first channel (mono)
        const samples = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;

        // Compile the raw float samples into a clean WAV PCM file
        const wavBlob = createWavBlob(samples, sampleRate);
        const url = URL.createObjectURL(wavBlob);

        setBlobUrl(url);
        setAudioBlob(wavBlob);
        setStatus({
          type: "success",
          message: `Successfully processed "${file.name}" (${(file.size / 1024 / 1024).toFixed(2)} MB). Ready for transcription!`,
        });
        tempCtx.close();
      } catch (err) {
        console.error("Failed to decode audio file:", err);
        setStatus({
          type: "error",
          message:
            "Failed to process audio. Please ensure it is a valid audio file (e.g., MP3, M4A, WAV, AAC).",
        });
      } finally {
        setLoading(false);
      }
    };

    fileReader.onerror = () => {
      setStatus({ type: "error", message: "Error reading file." });
      setLoading(false);
    };

    fileReader.readAsArrayBuffer(file);
  };

  // Helper: Merge buffer chunks
  const mergeBuffers = (channelBuffer, recordingLength) => {
    const result = new Float32Array(recordingLength);
    let offset = 0;
    for (let i = 0; i < channelBuffer.length; i++) {
      const buffer = channelBuffer[i];
      result.set(buffer, offset);
      offset += buffer.length;
    }
    return result;
  };

  // Helper: Write standard WAV header
  const createWavBlob = (samples, sampleRate) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, "RIFF");
    /* file length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, "WAVE");
    /* format chunk identifier */
    writeString(view, 12, "fmt ");
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw PCM = 1) */
    view.setUint16(20, 1, true);
    /* channel count (mono = 1) */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample (16-bit) */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, "data");
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    // Write PCM samples (16-bit signed integers)
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return new Blob([view], { type: "audio/wav" });
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // Submit audio and title to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setStatus({ type: "error", message: "Please enter a news title." });
      return;
    }
    if (!audioBlob) {
      setStatus({
        type: "error",
        message: "Please record or upload an audio announcement first.",
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("audio", audioBlob, "news-announcement.wav");

    try {
      const response = await axios.post(
        "https://scoutpuls-backend-fng0akf9akhyhghp.southeastasia-01.azurewebsites.net/api/news/voice-publish",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const { data } = response;
      setTranscribedText(data.content || "");
      setStatus({
        type: "success",
        message: "Voice announcement transcribed and published successfully!",
      });
      setTitle("");
      setAudioBlob(null);
      setBlobUrl("");

      if (onNewsPublished) onNewsPublished();
    } catch (err) {
      console.error("Error publishing voice news:", err);
      const errMsg =
        err.response?.data?.error ||
        "Failed to process and transcribe voice announcement.";
      setStatus({ type: "error", message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg text-left space-y-5">
      <div className="border-b border-white/5 pb-2.5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Mic className="w-4 h-4 text-emerald-400" />
          <span>Publish News via Voice AI</span>
        </h3>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Record your voice announcements. Azure Speech AI will automatically
          transcribe and publish them to the news feed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title input */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            News Title
          </label>
          <input
            type="text"
            placeholder="e.g. Richmond College Camporee Prep Meet"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="w-full bg-slate-950/60 border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
            required
          />
        </div>

        {/* Source Selector */}
        <div className="flex gap-2 p-1 bg-slate-950/60 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => {
              setSourceMode("record");
              setBlobUrl("");
              setAudioBlob(null);
              setStatus({ type: "", message: "" });
            }}
            className={`flex-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
              sourceMode === "record"
                ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                : "text-slate-400 hover:text-white font-bold"
            }`}
          >
            Record Live
          </button>
          <button
            type="button"
            onClick={() => {
              setSourceMode("upload");
              setBlobUrl("");
              setAudioBlob(null);
              setStatus({ type: "", message: "" });
            }}
            className={`flex-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
              sourceMode === "upload"
                ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                : "text-slate-400 hover:text-white font-bold"
            }`}
          >
            Upload File
          </button>
        </div>

        {/* Dynamic Source Panel */}
        {sourceMode === "record" ? (
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Audio Recording
            </label>

            <div className="flex items-center gap-4 bg-slate-950/40 border border-white/5 p-3.5 rounded-xl">
              {/* Toggle recording button */}
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 p-3.5 rounded-full transition-all flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(5,196,107,0.3)] disabled:opacity-50 disabled:shadow-none"
                  title="Start Recording"
                >
                  <Mic className="w-5 h-5 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white p-3.5 rounded-full transition-all flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse"
                  title="Stop Recording"
                >
                  <Square className="w-5 h-5 fill-current" />
                </button>
              )}

              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold text-slate-200">
                  {isRecording
                    ? "Recording audio..."
                    : audioBlob
                      ? "Voice recorded!"
                      : "Click to start recording"}
                </span>
                <span className="block text-[9px] text-slate-500 mt-0.5">
                  {isRecording
                    ? "Speak clearly into your mic"
                    : "Supported audio formats: WAV"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Upload Audio File
            </label>
            <div className="relative group flex flex-col items-center justify-center bg-slate-950/40 hover:bg-slate-950/60 border border-dashed border-white/10 hover:border-emerald-500/50 p-6 rounded-xl transition-all cursor-pointer text-center">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 mb-2 transition-all" />
              <span className="block text-xs font-bold text-slate-200">
                {audioBlob
                  ? "Audio file processed!"
                  : "Select or drag audio file"}
              </span>
              <span className="block text-[9px] text-slate-500 mt-1">
                Supports MP3, M4A, WAV, AAC, etc. (Max 10MB)
              </span>
            </div>
          </div>
        )}

        {/* Playback preview */}
        {blobUrl && (
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Audio Playback Preview
            </span>
            <audio
              src={blobUrl}
              controls
              className="w-full h-8 bg-slate-950 rounded-lg"
            />
          </div>
        )}

        {/* Action Publish Button */}
        <button
          type="submit"
          disabled={loading || isRecording || !title.trim() || !audioBlob}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-emerald-800 disabled:to-teal-800 text-slate-950 font-black text-xs py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {loading ? (
            <>
              <Loader className="w-3.5 h-3.5 animate-spin" />
              <span>Transcribing Speech with Azure AI...</span>
            </>
          ) : (
            <span>Transcribe & Publish Announcement</span>
          )}
        </button>
      </form>

      {/* Alert Status */}
      {status.message && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-[11px] border ${
            status.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Transcribed Text Preview */}
      {transcribedText && (
        <div className="space-y-1.5 border-t border-white/5 pt-3.5">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Transcribed Content (Published)
          </label>
          <textarea
            readOnly
            value={transcribedText}
            rows={3}
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none resize-none cursor-default"
          />
        </div>
      )}
    </div>
  );
}
