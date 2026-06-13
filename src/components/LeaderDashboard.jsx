import React, { useState } from 'react';
import { Award, ClipboardList, X } from 'lucide-react';
import RequestPanel from './RequestPanel';
import BadgeGrid from './BadgeGrid';

export default function LeaderDashboard({ 
  scouts = [], 
  badges = [], 
  requests = [], 
  onApproveRequest, 
  onDeclineRequest,
  onAssignBadge,
  view = 'directory'
}) {
  const [selectedScout, setSelectedScout] = useState(null); // for Inspect profile
  const [assignScoutId, setAssignScoutId] = useState(null); // for assigning badge
  const [selectedBadgeId, setSelectedBadgeId] = useState('');

  const activeAssignScout = scouts.find(s => s.id === assignScoutId);

  // List of badges not yet earned by this scout
  const assignableBadges = activeAssignScout 
    ? badges.filter(b => !activeAssignScout.earnedBadges.includes(b.id))
    : [];

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedBadgeId || !assignScoutId) return;

    if (onAssignBadge) {
      onAssignBadge(assignScoutId, selectedBadgeId);
    }
    setAssignScoutId(null);
    setSelectedBadgeId('');
  };

  // Switch overlay for Requests Table
  if (view === 'requests') {
    return (
      <div className="leader-dashboard">
        <div className="view-header">
          <h2 className="view-title">Pending Badge Requests</h2>
          <p className="view-subtitle">Review and approve badge submissions requested by active scouts.</p>
        </div>
        
        <RequestPanel 
          requests={requests}
          onApprove={onApproveRequest}
          onDecline={onDeclineRequest}
        />
      </div>
    );
  }

  // Directory View
  return (
    <div className="leader-dashboard">
      <div className="view-header">
        <h2 className="view-title">Scout Directory</h2>
        <p className="view-subtitle">Track and maintain badge achievements for all registered scouts.</p>
      </div>

      <div className="scout-directory-list">
        {scouts.length > 0 ? (
          scouts.map(scout => (
            <div key={scout.id} className="leader-scout-row">
              <div className="scout-row-identity">
                <img 
                  src={scout.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                  alt={scout.name} 
                  className="scout-row-pic"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                  }}
                />
                <div className="scout-row-details">
                  <h3>{scout.name}</h3>
                  <p>
                    <span style={{ marginRight: '10px' }}>Rank: {scout.rank}</span>
                    <span>Troop: {scout.troopNumber} ({scout.region})</span>
                  </p>
                </div>
              </div>

              <div className="scout-row-badge-summary">
                <div className="scout-badge-count">
                  <span className="scout-badge-count-num">{scout.earnedBadges.length}</span>
                  <span className="scout-badge-count-label">Earned</span>
                </div>
                <div className="scout-badge-count">
                  <span className="scout-badge-count-num">{scout.pendingBadges.length}</span>
                  <span className="scout-badge-count-label">Pending</span>
                </div>
                <div className="scout-badge-count">
                  <span className="scout-badge-count-num" style={{ color: 'var(--text-muted)' }}>
                    {badges.length - scout.earnedBadges.length - scout.pendingBadges.length}
                  </span>
                  <span className="scout-badge-count-label">Locked</span>
                </div>
                <div className="scout-badge-count">
                  <span className="scout-badge-count-num" style={{ color: 'var(--primary)' }}>{scout.points}</span>
                  <span className="scout-badge-count-label">Points</span>
                </div>
              </div>

              <div className="scout-row-actions">
                <button 
                  onClick={() => setSelectedScout(scout)} 
                  className="btn-secondary"
                >
                  Inspect
                </button>
                <button 
                  onClick={() => {
                    setAssignScoutId(scout.id);
                    setSelectedBadgeId('');
                  }} 
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                >
                  <Award size={14} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
                  Award Badge
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <ClipboardList size={40} className="empty-state-icon" />
            <h3>No Scouts Enrolled</h3>
            <p>Go to the Scout perspective or enroll scouts to populate the database.</p>
          </div>
        )}
      </div>

      {/* Modal: Inspect Scout Collection */}
      {selectedScout && (
        <div className="modal-overlay" onClick={() => setSelectedScout(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', padding: '30px' }}>
            <button className="modal-close-btn" onClick={() => setSelectedScout(null)}>
              <X size={18} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <img 
                src={selectedScout.photoUrl} 
                alt={selectedScout.name} 
                style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '2px solid var(--primary)' }} 
              />
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{selectedScout.name}'s Badges</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Rank: <strong style={{ color: 'var(--secondary)' }}>{selectedScout.rank}</strong> | Troop: {selectedScout.troopNumber} | Total Points: {selectedScout.points}
                </p>
              </div>
            </div>

            <BadgeGrid
              badges={badges}
              earnedIds={selectedScout.earnedBadges}
              pendingIds={selectedScout.pendingBadges}
              role="Leader"
            />
          </div>
        </div>
      )}

      {/* Modal: Award Badge Manually */}
      {assignScoutId && activeAssignScout && (
        <div className="modal-overlay" onClick={() => setAssignScoutId(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', padding: '30px' }}>
            <button className="modal-close-btn" onClick={() => setAssignScoutId(null)}>
              <X size={18} />
            </button>

            <h2 className="enroll-form-title" style={{ borderBottom: 'none', marginBottom: '8px' }}>Award Badge Manually</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Assign a badge directly to <strong style={{ color: 'var(--primary)' }}>{activeAssignScout.name}</strong>. This bypasses the request flow and awards points immediately.
            </p>

            <form onSubmit={handleAssignSubmit} className="enroll-form">
              <div className="form-group">
                <label>Select Badge</label>
                {assignableBadges.length > 0 ? (
                  <select
                    value={selectedBadgeId}
                    onChange={(e) => setSelectedBadgeId(e.target.value)}
                    className="modal-select-scout"
                    required
                  >
                    <option value="">-- Choose Badge --</option>
                    {assignableBadges.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} (+{b.points} PTS) - {b.category}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--danger)' }}>
                    This scout has already earned all available badges.
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button 
                  type="submit" 
                  className="submit-btn" 
                  style={{ flex: 1, marginTop: 0 }}
                  disabled={!selectedBadgeId}
                >
                  Award Badge
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setAssignScoutId(null)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
