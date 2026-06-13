import React from 'react';
import { 
  LayoutDashboard, BookOpen, UserPlus, Award, 
  ShieldAlert, Calendar, LogOut, Users, RefreshCw, Compass
} from 'lucide-react';

export default function Sidebar({ 
  role, 
  setRole, 
  activeView, 
  setActiveView, 
  scouts = [], 
  selectedScoutId, 
  setSelectedScoutId,
  onLogout,
  hideSwitcher = false
}) {
  return (
    <aside className="w-72 bg-slate-900 border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0 text-slate-300 font-sans">
      {/* Sidebar Header with Galle District Logo */}
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <img 
          src="/galle_district.png" 
          alt="Galle District Logo" 
          className="w-12 h-12 object-contain bg-slate-950/40 rounded-xl p-1 border border-emerald-500/20 shadow-[0_0_12px_rgba(5,196,107,0.15)]"
          onError={(e) => {
            e.target.src = "https://img.icons8.com/color/96/compass.png";
          }}
        />
        <div>
          <h1 className="text-sm font-black text-white uppercase tracking-wider leading-tight">
            Galle District
          </h1>
          <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">
            Scout Branch
          </span>
        </div>
      </div>

      {/* Role / Perspective Switcher */}
      {!hideSwitcher && (
        <div className="px-6 py-4 border-b border-white/5 space-y-3">
          <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Portal View
          </span>
          <div className="grid grid-cols-2 bg-slate-950/80 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => {
                setRole('Admin');
                if (activeView === 'add_scout' || activeView === 'leaders') {
                  setActiveView('dashboard');
                }
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                role === 'Admin' 
                  ? 'bg-emerald-400 text-emerald-950 shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => {
                setRole('Scout');
                // Scout doesn't have leaders or add_scout views, fallback to dashboard
                if (activeView === 'add_scout' || activeView === 'leaders') {
                  setActiveView('dashboard');
                }
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                role === 'Scout' 
                  ? 'bg-emerald-400 text-emerald-950 shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Scout
            </button>
          </div>
        </div>
      )}

      {/* Scout Profile Selector (Scout View only) */}
      {role === 'Scout' && !hideSwitcher && (
        <div className="px-6 py-4 border-b border-white/5 space-y-2.5 bg-emerald-950/10 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              Active Scout Profile
            </span>
          </div>
          {scouts.length > 0 ? (
            <select
              value={selectedScoutId || ''}
              onChange={(e) => setSelectedScoutId(parseInt(e.target.value))}
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer focus:border-emerald-400 transition-all"
            >
              <option value="" disabled>-- Select Profile --</option>
              {scouts.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.troopNo})
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-slate-500 italic block">No scouts registered yet</span>
          )}
        </div>
      )}

      {/* Navigation Menu Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
          Navigation
        </span>
        <ul className="space-y-1.5">
          {role === 'Admin' ? (
            /* Admin Menu */
            <>
              <li>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeView === 'dashboard'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('program')}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeView === 'program'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Scout Program</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('add_scout')}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeView === 'add_scout'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add New Scout</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('badges')}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeView === 'badges'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Badge System</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('leaders')}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeView === 'leaders'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Leaders</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('events')}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeView === 'events'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Events</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('news')}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeView === 'news'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>District News</span>
                </button>
              </li>
            </>
          ) : (
            /* Scout Menu */
            <>
              <li>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeView === 'dashboard'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Progress</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('program')}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeView === 'program'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Program Books</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('badges')}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeView === 'badges'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Badge Requirements</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('events')}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeView === 'events'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Upcoming Events</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('news')}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeView === 'news'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>District News</span>
                </button>
              </li>
            </>
          )}
          
          {/* Logout Button */}
          <li className="pt-4 border-t border-white/5">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold border border-transparent hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 border-t border-white/5 text-[9px] text-slate-500 flex flex-col gap-1 select-none">
        <p className="font-bold text-slate-400">Galle District Scout Branch</p>
        <p>© 2026 Sri Lanka Scouts Association</p>
      </div>
    </aside>
  );
}
