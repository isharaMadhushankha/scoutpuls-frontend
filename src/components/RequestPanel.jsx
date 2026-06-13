import React from 'react';
import * as Icons from 'lucide-react';

export default function RequestPanel({ requests = [], onApprove, onDecline }) {
  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.Award;
    return <IconComponent size={16} />;
  };

  return (
    <div className="request-table-wrapper">
      {requests.length > 0 ? (
        <table className="request-table">
          <thead>
            <tr>
              <th>Scout</th>
              <th>Badge Requested</th>
              <th>Category</th>
              <th>Points</th>
              <th>Request Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                      src={req.scoutPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                      alt={req.scoutName} 
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--primary)' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{req.scoutName}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--secondary)' }}>{getIcon(req.iconName)}</span>
                    <span style={{ fontWeight: '500' }}>{req.badgeName}</span>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {req.badgeCategory}
                  </span>
                </td>
                <td>
                  <span style={{ color: 'var(--secondary)', fontWeight: '700' }}>+{req.badgePoints} PTS</span>
                </td>
                <td>
                  <span>{new Date(req.date).toLocaleDateString()}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button 
                      className="btn-approve" 
                      onClick={() => onApprove && onApprove(req.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn-decline" 
                      onClick={() => onDecline && onDecline(req.id)}
                    >
                      Decline
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <Icons.CheckCircle2 size={40} className="empty-state-icon" style={{ color: 'var(--primary)' }} />
          <h3>No Pending Requests</h3>
          <p>Great job! All scout badge requests have been processed.</p>
        </div>
      )}
    </div>
  );
}
