import React, { useState } from "react";
import { UserPlus, Image, Check, AlertCircle } from "lucide-react";

export default function EnrollForm({ onScoutEnrolled }) {
  const [name, setName] = useState("");
  const [troopNo, setTroopNo] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !troopNo) {
      setMessage({
        text: "Please fill in Name and Troop Number.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("troopNo", troopNo);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await fetch(
        "https://scoutpuls-backend-fng0akf9akhyhghp.southeastasia-01.azurewebsites.net/api/scouts",
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to enroll scout.");
      }

      setMessage({ text: "Scout enrolled successfully!", type: "success" });
      setName("");
      setTroopNo("");
      setPhoto(null);
      setPhotoPreview(null);

      if (onScoutEnrolled) {
        onScoutEnrolled();
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-emerald-950/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl w-full hover:border-white/15 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
        <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 shadow-[0_0_10px_rgba(5,196,107,0.1)]">
          <UserPlus className="text-emerald-400 w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Enroll New Scout</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Unified circular photo upload */}
        <div className="flex flex-col items-center justify-center pb-2">
          <input
            type="file"
            id="scout-photo"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />
          <label
            htmlFor="scout-photo"
            className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-white/20 hover:border-emerald-400 bg-slate-900/60 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group/avatar shadow-inner"
          >
            {photoPreview ? (
              <>
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">
                  <Image className="w-4 h-4 mb-1" />
                  Change
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 group-hover/avatar:text-emerald-400 transition-colors">
                <Image className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">Select Photo</span>
              </div>
            )}
          </label>
          <span className="text-[10px] text-slate-500 mt-2">
            Square format photo recommended
          </span>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Scout Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Dineth Perera"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all duration-300"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            School / Troop Group <span className="text-red-400">*</span>
          </label>
          <select
            value={troopNo}
            onChange={(e) => setTroopNo(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all duration-300 cursor-pointer"
            required
            disabled={loading}
          >
            <option value="" disabled>
              -- Select Galle District School --
            </option>
            <option value="Sri Sumangala College, Hikkaduwa">
              Sri Sumangala College, Hikkaduwa
            </option>
            <option value="Richmond College, Galle">
              Richmond College, Galle
            </option>
            <option value="Mahinda College, Galle">
              Mahinda College, Galle
            </option>
            <option value="St. Aloysius' College, Galle">
              St. Aloysius' College, Galle
            </option>
            <option value="Sanghamitta Balika Vidyalaya, Galle">
              Sanghamitta Balika Vidyalaya, Galle
            </option>
            <option value="Rippon Girls' College, Galle">
              Rippon Girls' College, Galle
            </option>
            <option value="Vidyaloka College, Galle">
              Vidyaloka College, Galle
            </option>
            <option value="Revata National College, Balapitiya">
              Revata National College, Balapitiya
            </option>
            <option value="Devapathiraja College, Rathgama">
              Devapathiraja College, Rathgama
            </option>
            <option value="Christ Church College, Baddegama">
              Christ Church College, Baddegama
            </option>
          </select>
        </div>

        {message.text && (
          <div
            className={`flex items-center gap-2 p-3.5 rounded-xl text-xs font-semibold border animate-fade-in ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {message.type === "success" ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-slate-950 font-bold py-3.5 px-4 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400/50 shadow-lg hover:shadow-[0_0_20px_rgba(5,196,107,0.3)] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-slate-950"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Enrolling...</span>
            </>
          ) : (
            <span>Enroll Scout</span>
          )}
        </button>
      </form>
    </div>
  );
}
