import React, { useState } from 'react';
import * as Icons from 'lucide-react';

export default function BadgeGrid({ 
  badges, 
  earnedIds = [], 
  pendingIds = [], 
  onRequestBadge, 
  role = 'Scout'
}) {
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Proficiency', 'Outdoor Survival', 'Public Health', 'Technology'];

  const filteredBadges = activeTab === 'All' 
    ? badges 
    : badges.filter(b => b.category === activeTab);

  const getIcon = (iconName) => {
    // Dynamic mapping from icon string name to Lucide components
    const IconComponent = Icons[iconName] || Icons.Award;
    return <IconComponent size={22} />;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Category Tabs */}
      <div className="category-tabs-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      {filteredBadges.length > 0 ? (
        <div className="badges-grid">
          {filteredBadges.map(badge => {
            const isEarned = earnedIds.includes(badge.id);
            const isPending = pendingIds.includes(badge.id);
            const status = isEarned ? 'earned' : isPending ? 'pending' : 'locked';

            return (
              <div key={badge.id} className={`badge-card ${status}`}>
                <div className="badge-card-header">
                  <div className="badge-icon-wrapper">
                    {getIcon(badge.iconName)}
                  </div>
                  <div className="badge-card-title-cat">
                    <span className="badge-name">{badge.name}</span>
                    <span className="badge-category">{badge.category}</span>
                  </div>
                </div>

                <p className="badge-desc">{badge.description}</p>

                <div className="badge-card-footer">
                  <span className="badge-pts">+{badge.points} PTS</span>
                  
                  {isEarned && (
                    <span className="badge-status-lbl">Earned</span>
                  )}
                  {isPending && (
                    <span className="badge-status-lbl">Pending</span>
                  )}
                  {!isEarned && !isPending && (
                    role === 'Scout' ? (
                      <button 
                        className="request-badge-btn"
                        onClick={() => onRequestBadge && onRequestBadge(badge.id)}
                      >
                        Request
                      </button>
                    ) : (
                      <span className="badge-status-lbl">Locked</span>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Icons.Award size={40} className="empty-state-icon" />
          <h3>No Badges Found</h3>
          <p>No badges are currently available in this category.</p>
        </div>
      )}
    </div>
  );
}
