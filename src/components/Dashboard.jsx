import React, { useState } from 'react';
import { Search, Plus, Sparkles, Shield, Compass, Users, UserCheck } from 'lucide-react';
import ScoutCard from './ScoutCard';

export default function Dashboard({ scouts, onDeleteScout, onAddScoutClick, onScoutClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRank, setSelectedRank] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');

  // Ranks for the filter dropdown
  const ranksList = [
    'All',
    'Tenderfoot',
    'Second Class Scout',
    'First Class Scout',
    'Star Scout',
    'Life Scout',
    'Eagle Scout',
    'President\'s Scout',
    'Rover Scout'
  ];

  // Get unique regions for filtering
  const regionsList = ['All', ...new Set(scouts.map(s => s.region).filter(Boolean))];

  // Calculate Metrics
  const totalScouts = scouts.length;
  
  const activeTroops = new Set(
    scouts.map(s => s.troopNumber?.trim().toLowerCase()).filter(Boolean)
  ).size;

  const scoutsWithAge = scouts.filter(s => s.age);
  const avgAge = scoutsWithAge.length 
    ? (scoutsWithAge.reduce((sum, s) => sum + parseInt(s.age), 0) / scoutsWithAge.length).toFixed(1)
    : 'N/A';

  const advancedRanks = ['Eagle Scout', "President's Scout", 'Rover Scout', 'Life Scout'];
  const advancedCount = scouts.filter(s => advancedRanks.includes(s.rank)).length;

  // Filter Scouts
  const filteredScouts = scouts.filter(scout => {
    const matchesSearch = 
      scout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scout.troopNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRank = selectedRank === 'All' || scout.rank === selectedRank;
    const matchesRegion = selectedRegion === 'All' || scout.region === selectedRegion;

    return matchesSearch && matchesRank && matchesRegion;
  });

  return (
    <div style={{ width: '100%' }}>
      {/* Stats Panel */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon-wrapper">
            <Users size={24} />
          </div>
          <div className="stat-card-info">
            <h3>Total Scouts</h3>
            <p>{totalScouts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon-wrapper">
            <UserCheck size={24} />
          </div>
          <div className="stat-card-info">
            <h3>Elite Scouts</h3>
            <p>{advancedCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon-wrapper">
            <Shield size={24} />
          </div>
          <div className="stat-card-info">
            <h3>Active Troops</h3>
            <p>{activeTroops}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon-wrapper">
            <Sparkles size={24} />
          </div>
          <div className="stat-card-info">
            <h3>Average Age</h3>
            <p>{avgAge} yrs</p>
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="dashboard-actions">
        <div className="search-filter-panel">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or troop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={selectedRank}
            onChange={(e) => setSelectedRank(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Ranks</option>
            {ranksList.slice(1).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Regions</option>
            {regionsList.slice(1).map(reg => (
              <option key={reg} value={reg}>{reg}</option>
            ))}
          </select>
        </div>

        <button onClick={onAddScoutClick} className="btn-primary">
          <Plus size={18} />
          Enroll Scout
        </button>
      </div>

      {/* Cards List */}
      {filteredScouts.length > 0 ? (
        <div className="cards-grid">
          {filteredScouts.map(scout => (
            <ScoutCard
              key={scout.id}
              scout={scout}
              onDelete={onDeleteScout}
              onClick={onScoutClick}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Compass size={48} className="empty-state-icon" />
          <h3>No Scouts Found</h3>
          <p>We couldn't find any scouts matching your current search filters. Try adjusting your search term or filters.</p>
        </div>
      )}
    </div>
  );
}
