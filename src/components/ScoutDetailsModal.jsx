import React from 'react';
import { X, Shield, Calendar, MapPin, Award, User } from 'lucide-react';

export default function ScoutDetailsModal({ scout, onClose }) {
  if (!scout) return null;

  const { name, age, troopNumber, rank, region, photoUrl, createdAt, skills } = scout;

  const scoutSkills = skills || {
    camping: 70,
    firstAid: 65,
    navigation: 80,
    leadership: 75
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Modal Banner */}
        <div className="details-header">
          <img 
            src={photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
            alt={name} 
            className="details-banner-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
            }}
          />
          <div className="details-overlay"></div>
          <div className="details-header-info">
            <span className="details-badge">{rank}</span>
            <h2 className="details-name">{name}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="details-content">
          <div className="details-grid">
            <div className="details-info-box">
              <span className="details-info-label">Troop Number</span>
              <div className="details-info-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} className="logo-icon" />
                {troopNumber}
              </div>
            </div>

            <div className="details-info-box">
              <span className="details-info-label">Region / Province</span>
              <div className="details-info-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} style={{ color: 'var(--secondary)' }} />
                {region || 'General'}
              </div>
            </div>

            <div className="details-info-box">
              <span className="details-info-label">Age</span>
              <div className="details-info-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} style={{ color: '#00e5ff' }} />
                {age ? `${age} Years Old` : 'N/A'}
              </div>
            </div>

            <div className="details-info-box">
              <span className="details-info-label">Enrollment Date</span>
              <div className="details-info-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} style={{ color: '#e040fb' }} />
                {new Date(createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className="details-section-title">
            <Award size={16} className="logo-icon" />
            Core Scout Proficiencies
          </div>

          <div className="details-skills-list">
            <div className="details-skill-bar-row">
              <div className="details-skill-header">
                <span>🏕️ Camping & Survival</span>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{scoutSkills.camping}%</span>
              </div>
              <div className="details-skill-track">
                <div className="details-skill-fill" style={{ width: `${scoutSkills.camping}%` }}></div>
              </div>
            </div>

            <div className="details-skill-bar-row">
              <div className="details-skill-header">
                <span>🚑 First Aid & Safety</span>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{scoutSkills.firstAid}%</span>
              </div>
              <div className="details-skill-track">
                <div className="details-skill-fill" style={{ width: `${scoutSkills.firstAid}%` }}></div>
              </div>
            </div>

            <div className="details-skill-bar-row">
              <div className="details-skill-header">
                <span>🗺️ Navigation & Orientation</span>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{scoutSkills.navigation}%</span>
              </div>
              <div className="details-skill-track">
                <div className="details-skill-fill" style={{ width: `${scoutSkills.navigation}%` }}></div>
              </div>
            </div>

            <div className="details-skill-bar-row">
              <div className="details-skill-header">
                <span>🤝 Leadership & Teamwork</span>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{scoutSkills.leadership}%</span>
              </div>
              <div className="details-skill-track">
                <div className="details-skill-fill" style={{ width: `${scoutSkills.leadership}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
