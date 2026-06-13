import React, { useState } from "react";
import { Trash2, Shield, Search, ChevronDown, Award, Star } from "lucide-react";

export default function ScoutCard({
  scout,
  badges = [],
  onBadgeAwarded,
  onScoutDeleted,
}) {
  const {
    id,
    name,
    troopNo,
    profileImageUrl,
    badges: earnedBadges = [],
    createdAt,
  } = scout;
  const [awardLoading, setAwardLoading] = useState(false);
  const [showAwardMenu, setShowAwardMenu] = useState(false);
  const [badgeSearch, setBadgeSearch] = useState("");

  // Find badges that this scout HAS NOT earned yet
  const earnedIds = earnedBadges.map((b) => b.id);
  const availableBadges = badges.filter((b) => !earnedIds.includes(b.id));

  // Determine current milestone rank
  const earnedMilestones = earnedBadges
    .filter((b) => b.category === "Milestone")
    .map((b) => b.id);
  const hasPresidentAward = earnedIds.includes(5);

  let rankName = "Tenderfoot Scout";
  let progressPercent = 10;
  if (earnedIds.includes(5)) {
    rankName = "President's Scout";
    progressPercent = 100;
  } else if (earnedIds.includes(4)) {
    rankName = "Prime Minister's Scout";
    progressPercent = 80;
  } else if (earnedIds.includes(3)) {
    rankName = "Chief Commissioner's Scout";
    progressPercent = 60;
  } else if (earnedIds.includes(2)) {
    rankName = "Scout Awardee";
    progressPercent = 40;
  } else if (earnedIds.includes(1)) {
    rankName = "Membership Scout";
    progressPercent = 20;
  }

  const handleAwardBadge = async (badgeId) => {
    if (!badgeId) return;
    setAwardLoading(true);

    try {
      const response = await fetch(
        "https://scoutpuls-backend-fng0akf9akhyhghp.southeastasia-01.azurewebsites.net/api/scouts/award",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scoutId: id, badgeId: parseInt(badgeId) }),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to award badge.");
      }

      if (onBadgeAwarded) onBadgeAwarded();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setAwardLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = scout.status === "Present" ? "Absent" : "Present";
    try {
      const response = await fetch(
        `https://scoutpuls-backend-fng0akf9akhyhghp.southeastasia-01.azurewebsites.net/api/scouts/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update status.");
      }

      if (onBadgeAwarded) onBadgeAwarded();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleDeleteScout = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove scout ${name}?`,
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://scoutpuls-backend-fng0akf9akhyhghp.southeastasia-01.azurewebsites.net/api/scouts/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete scout.");
      }

      if (onScoutDeleted) onScoutDeleted();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Filter available badges by search query
  const filteredAvailable = availableBadges.filter(
    (b) =>
      b.name.toLowerCase().includes(badgeSearch.toLowerCase()) ||
      (b.category &&
        b.category.toLowerCase().includes(badgeSearch.toLowerCase())),
  );

  // Group filtered badges by category
  const groupedFiltered = filteredAvailable.reduce((acc, b) => {
    const cat = b.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(b);
    return acc;
  }, {});

  return (
    <div
      className={`bg-slate-900/40 backdrop-blur-xl border rounded-2xl overflow-hidden shadow-xl hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(5,196,107,0.15)] transition-all duration-300 flex flex-col group h-full relative ${
        hasPresidentAward
          ? "border-amber-500/30 ring-1 ring-amber-500/10"
          : "border-white/10"
      }`}
    >
      {/* Top Banner Decoration */}
      <div className="h-16 w-full relative bg-gradient-to-r from-emerald-950 via-emerald-900/40 to-slate-950 overflow-hidden shrink-0 border-b border-white/5">
        {/* Subtle grid pattern background overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#05c46b_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Floating status badges group on top right */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          {/* Badges Earned Count */}
          <div className="bg-emerald-500 text-slate-950 text-[10px] font-black rounded-full px-2.5 py-1 shadow-[0_2px_10px_rgba(5,196,107,0.3)] uppercase tracking-wider flex items-center gap-1">
            <span>
              {earnedBadges.length}{" "}
              {earnedBadges.length === 1 ? "Badge" : "Badges"}
            </span>
          </div>

          {/* President's Scout gold badge overlay */}
          {hasPresidentAward && (
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[9px] font-black rounded-full px-2.5 py-1 shadow-md border border-amber-300/30 flex items-center gap-1 uppercase tracking-wider shrink-0">
              <Star className="w-3 h-3 fill-slate-950 shrink-0" />
              <span>President's Scout</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Photo & Basic Info Row */}
      <div className="px-5 -mt-10 flex items-end gap-3.5 relative z-10">
        <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-slate-900 bg-slate-950 shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-300">
          <img
            src={
              profileImageUrl ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
            }
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
            }}
          />
        </div>
        <div className="min-w-0 pb-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors truncate leading-tight">
              {name}
            </h3>
            <span
              onClick={handleToggleStatus}
              className={`cursor-pointer px-2 py-0.5 text-[9px] font-black rounded-full border transition-all shrink-0 ${
                scout.status === "Present"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700"
              }`}
              title="Click to toggle attendance status"
            >
              ● {scout.status || "Absent"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
            <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{troopNo}</span>
          </div>
        </div>
      </div>

      {/* Scout Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Rank progress bar */}
          <div className="mb-4 bg-slate-950/40 p-3 rounded-xl border border-white/5 space-y-1.5 shadow-inner">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-slate-500 uppercase tracking-wider">
                Rank Progress
              </span>
              <span
                className={`text-[10px] font-extrabold ${hasPresidentAward ? "text-amber-400" : "text-emerald-400"}`}
              >
                {rankName}
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  hasPresidentAward
                    ? "bg-gradient-to-r from-amber-400 to-amber-500"
                    : "bg-emerald-400"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Earned Badges Section */}
          <div>
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Earned Badges ({earnedBadges.length})
            </span>
            {earnedBadges.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-[96px] overflow-y-auto pr-1 custom-scrollbar">
                {earnedBadges.map((badge) => (
                  <span
                    key={badge.id}
                    title={badge.description}
                    className="bg-slate-950/40 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-slate-300 hover:text-emerald-400 text-[9px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 cursor-help transition-all shadow-sm"
                  >
                    {badge.iconUrl && (
                      <img
                        src={badge.iconUrl}
                        alt=""
                        className="w-3.5 h-3.5 object-contain shrink-0"
                      />
                    )}
                    <span className="max-w-[100px] truncate">
                      {badge.name.split(" (")[0]}
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[10px] text-slate-500 italic block">
                No badges earned yet
              </span>
            )}
          </div>
        </div>

        {/* Action controls */}
        <div className="border-t border-white/5 pt-3.5 mt-auto space-y-3">
          <div className="flex items-center gap-2">
            {/* Custom Searchable Badge Selection Dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => setShowAwardMenu(!showAwardMenu)}
                disabled={awardLoading || availableBadges.length === 0}
                className="w-full bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer flex items-center justify-between disabled:opacity-50 transition-all font-bold"
              >
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {availableBadges.length > 0
                    ? "Award Badge"
                    : "All Badges Earned"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showAwardMenu && (
                <>
                  {/* Click away layer */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                      setShowAwardMenu(false);
                      setBadgeSearch("");
                    }}
                  />

                  {/* Popover Selection list */}
                  <div className="absolute bottom-full left-0 mb-2 w-72 bg-slate-950 border border-white/10 rounded-2xl p-3 shadow-2xl z-50 flex flex-col max-h-64 animate-fade-in">
                    {/* Search Input */}
                    <div className="relative mb-2 shrink-0">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search badges by name or group..."
                        value={badgeSearch}
                        onChange={(e) => setBadgeSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-white/5 focus:border-emerald-400 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                    </div>

                    {/* Scrollable Grouped badge list */}
                    <div className="overflow-y-auto flex-1 custom-scrollbar space-y-3 pr-1 text-left">
                      {Object.keys(groupedFiltered).length > 0 ? (
                        Object.keys(groupedFiltered)
                          .sort()
                          .map((cat) => (
                            <div key={cat} className="space-y-1">
                              <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest px-1">
                                {cat}
                              </span>
                              {groupedFiltered[cat].map((b) => (
                                <button
                                  key={b.id}
                                  onClick={() => {
                                    handleAwardBadge(b.id);
                                    setShowAwardMenu(false);
                                    setBadgeSearch("");
                                  }}
                                  className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-emerald-500/10 text-xs text-white hover:text-emerald-300 transition-all"
                                >
                                  <img
                                    src={
                                      b.iconUrl ||
                                      "https://img.icons8.com/color/96/medal.png"
                                    }
                                    alt=""
                                    className="w-4.5 h-4.5 object-contain shrink-0"
                                    onError={(e) =>
                                      (e.target.src =
                                        "https://img.icons8.com/color/96/medal.png")
                                    }
                                  />
                                  <span className="truncate">{b.name}</span>
                                </button>
                              ))}
                            </div>
                          ))
                      ) : (
                        <span className="text-xs text-slate-500 italic block text-center py-4">
                          No matching badges
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleDeleteScout}
              title="Remove Scout"
              className="bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-600 text-red-400 hover:text-white p-2 rounded-xl transition-all duration-300 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-between items-center text-[9px] text-slate-500 font-medium">
            <span>Enrolled: {new Date(createdAt).toLocaleDateString()}</span>
            <span>ID: #{id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
