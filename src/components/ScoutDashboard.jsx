import React, { useState } from 'react';
import { Shield, MapPin } from 'lucide-react';
import BadgeGrid from './BadgeGrid';

export default function ScoutDashboard({ scout, badges, onRequestBadge }) {
  const [filterType, setFilterType] = useState('all'); // 'all', 'earned', 'locked'

  const { name, rank, troopNumber, region, photoUrl, points, earnedBadges = [], pendingBadges = [] } = scout;

  // Rank progression thresholds
  const getRankRequirement = (currentRank) => {
    switch (currentRank) {
      case 'Tenderfoot': return { next: 'Second Class Scout', target: 200 };
      case 'Second Class Scout': return { next: 'First Class Scout', target: 400 };
      case 'First Class Scout': return { next: 'Star Scout', target: 600 };
      case 'Star Scout': return { next: 'Life Scout', target: 900 };
      case 'Life Scout': return { next: 'Eagle Scout', target: 1200 };
      case 'Eagle Scout': return { next: "President's Scout", target: 1600 };
      case "President's Scout": return { next: 'Rover Scout', target: 2000 };
      default: return { next: 'Max Rank', target: points };
    }
  };

  const rankInfo = getRankRequirement(rank);
  const percentComplete = Math.min((points / rankInfo.target) * 100, 100).toFixed(0);

  // Filter list of badges based on active tab selection
  const displayedBadges = badges.filter(b => {
    const isEarned = earnedBadges.includes(b.id);
    const isPending = pendingBadges.includes(b.id);
    const isLocked = !isEarned && !isPending;

    if (filterType === 'earned') return isEarned;
    if (filterType === 'locked') return isLocked || isPending;
    return true; // 'all'
  });

  return (
    <div className="scout-dashboard">
      {/* Scout Profile Header Panel */}
      <div className="scout-profile-panel">
        <img 
          src={photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
          alt={name} 
          className="scout-profile-pic"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
          }}
        />
        <div className="scout-profile-details">
          <span className="profile-role-badge" style={{ fontSize: '12px', background: 'rgba(5, 196, 107, 0.1)', border: '1px solid var(--primary)', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginBottom: '8px' }}>
            {rank}
          </span>
          <h2 className="scout-profile-name">{name}</h2>
          
          <div className="scout-profile-meta">
            <span className="meta-item">
              <Shield size={14} className="logo-icon" />
              Troop {troopNumber}
            </span>
            <span className="meta-item">
              <MapPin size={14} style={{ color: 'var(--secondary)' }} />
              {region || 'General'}
            </span>
          </div>

          <div className="progress-container">
            <div className="progress-labels">
              <span>Rank Progress: {rank}</span>
              <span>{points} / {rankInfo.target} PTS ({percentComplete}%)</span>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${percentComplete}%` }}></div>
            </div>
          </div>
        </div>

        <div className="scout-profile-stats">
          <div className="points-display">
            <div className="points-num">{points}</div>
            <div className="points-label">Total Points</div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Badge Collection</h3>
          <p className="view-subtitle">Earn badges to gain points and advance through ranks.</p>
        </div>

        {/* Tab switch for Personal Badges */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0, 0, 0, 0.2)', padding: '4px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <button 
            className={`toggle-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
            style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
          >
            All
          </button>
          <button 
            className={`toggle-btn ${filterType === 'earned' ? 'active' : ''}`}
            onClick={() => setFilterType('earned')}
            style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
          >
            Earned
          </button>
          <button 
            className={`toggle-btn ${filterType === 'locked' ? 'active' : ''}`}
            onClick={() => setFilterType('locked')}
            style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
          >
            Locked
          </button>
        </div>
      </div>

      <BadgeGrid
        badges={displayedBadges}
        earnedIds={earnedBadges}
        pendingIds={pendingBadges}
        onRequestBadge={onRequestBadge}
        role="Scout"
      />
    </div>
  );
}
