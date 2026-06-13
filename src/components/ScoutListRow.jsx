import React, { useState } from "react";
import {
  Trash2,
  Shield,
  Calendar,
  Search,
  ChevronDown,
  Award,
  Star,
} from "lucide-react";

export default function ScoutListRow({
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
  const hasPresidentAward = earnedIds.includes(5);

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
      className={`bg-emerald-950/20 backdrop-blur-md border rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 group ${
        hasPresidentAward
          ? "border-amber-500/20 hover:border-amber-500/40"
          : "border-white/5 hover:border-emerald-500/20"
      }`}
    >
      {/* Left section: Profile & Scout info */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0 bg-slate-900 shadow-inner">
          <img
            src={
              profileImageUrl ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
            }
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
            }}
          />
        </div>
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-white truncate">{name}</h4>
            <span className="text-[10px] text-slate-500 font-mono shrink-0">
              #{id}
            </span>
            <span
              onClick={handleToggleStatus}
              className={`cursor-pointer px-2 py-0.5 text-[8px] font-black rounded-full border transition-all shrink-0 ${
                scout.status === "Present"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700"
              }`}
              title="Click to toggle attendance status"
            >
              ● {scout.status || "Absent"}
            </span>
            {hasPresidentAward && (
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[8px] font-black rounded px-1.5 py-0.5 shadow-md flex items-center gap-0.5 uppercase tracking-wider animate-pulse shrink-0">
                <Star className="w-2.5 h-2.5 fill-slate-950" />
                <span>President</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span className="truncate">{troopNo}</span>
          </div>
        </div>
      </div>

      {/* Middle section: Earned Badges list */}
      <div className="flex-[1.5] min-w-0 flex items-center">
        <div className="w-full">
          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Badges ({earnedBadges.length})
          </span>
          {earnedBadges.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {earnedBadges.map((badge) => (
                <span
                  key={badge.id}
                  title={badge.description}
                  className="bg-white/5 border border-white/10 text-slate-300 hover:text-emerald-400 text-[9px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 cursor-help transition-all"
                >
                  {badge.iconUrl && (
                    <img
                      src={badge.iconUrl}
                      alt=""
                      className="w-3.5 h-3.5 object-contain"
                    />
                  )}
                  {badge.name.split(" (")[0]}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-500 italic">
              No badges earned
            </span>
          )}
        </div>
      </div>

      {/* Right section: Date, Add Badge, Delete */}
      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 md:mr-2">
          <Calendar className="w-3 h-3 text-slate-500" />
          <span>Enrolled: {new Date(createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Custom Searchable Badge Selection Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAwardMenu(!showAwardMenu)}
              disabled={awardLoading || availableBadges.length === 0}
              className="bg-slate-950/80 hover:bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none cursor-pointer flex items-center justify-between gap-1.5 disabled:opacity-50 transition-all font-semibold w-36"
            >
              <span className="truncate">
                {availableBadges.length > 0 ? "+ Award Badge" : "All Badges"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
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
                <div className="absolute bottom-full right-0 mb-2 w-72 bg-slate-950/95 backdrop-blur-xl border border-white/15 rounded-2xl p-3 shadow-2xl z-50 flex flex-col max-h-64 animate-fade-in">
                  {/* Search Input */}
                  <div className="relative mb-2 shrink-0">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search badges by name or group..."
                      value={badgeSearch}
                      onChange={(e) => setBadgeSearch(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 focus:border-emerald-400 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
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
            className="bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-600 text-red-400 hover:text-white p-2 rounded-lg transition-all duration-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
