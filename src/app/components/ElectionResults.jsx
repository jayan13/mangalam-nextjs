// components/ElectionResults.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './ElectionResults.module.css';

const ElectionResults = () => {
  const [statesData, setStatesData] = useState([]);
  const [selectedState, setSelectedState] = useState('Kerala');
  const [currentStateData, setCurrentStateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(false);

  const deriveCurrentStateData = (allStates, stateName) => {
    if (!Array.isArray(allStates) || allStates.length === 0) return null;
    const match = allStates.find((s) => s.state_name === stateName);
    return match || null;
  };

  // Reload ALL states data every 3 minutes (click only switches view)
  useEffect(() => {
    let intervalId;
    isMountedRef.current = true;

    const reload = async () => {
      await fetchAllStates();
    };

    reload();
    intervalId = setInterval(reload, 180000);

    return () => {
      isMountedRef.current = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Update current state view when either data or selectedState changes
  useEffect(() => {
    const next = deriveCurrentStateData(statesData, selectedState);
    if (next) {
      setCurrentStateData(next);
      return;
    }

    if (Array.isArray(statesData) && statesData.length > 0) {
      setSelectedState(statesData[0].state_name);
      setCurrentStateData(statesData[0]);
    } else {
      setCurrentStateData(null);
    }
  }, [statesData, selectedState]);

  const fetchAllStates = async () => {
    try {
      if (isMountedRef.current) setLoading(true);
      const response = await fetch('/api/election-results');
      const result = await response.json();
      if (!isMountedRef.current) return;
      if (result.success) {
        setError(null);
        const nextStates = Array.isArray(result.data) ? result.data : [];
        setStatesData(nextStates);
      } else {
        setError(result.error);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setError('Failed to fetch states data');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const handleStateClick = (stateName) => {
    setSelectedState(stateName);
  };

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className="home-news-section-left">
      <div className='mid-block'>
        <div className="section-heading section-heading-red">Election Results</div>
        <div className={styles.container}>
          {/* Header with State Tabs */}
          <div className={styles.header}>
            <div className={styles.stateTabs}>
              {statesData.map((state) => (
                <button
                  key={state.state_name}
                  className={`${styles.stateTab} ${selectedState === state.state_name ? styles.active : ''}`}
                  onClick={() => handleStateClick(state.state_name)}
                >
                  {state.state_name}
                  <span className={styles.seatCount}>({state.total_seats})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          {loading ? (
            <div className={styles.loader}>Loading results...</div>
          ) : (
            currentStateData && (
              <div className={styles.content}>
                {/* Total Seats and Alliance Cards in Single Row */}
                <div className={styles.topRow}>
                  <div className={styles.totalSeatsCard}>
                    <h3>Total Seats</h3>
                    <div className={styles.totalSeatsNumber}>{currentStateData.total_seats}</div>
                  </div>
                  
                  <div className={styles.alliancesSection}>
                    {currentStateData.alliances.map((alliance) => (
                      <AllianceCard key={alliance.name} alliance={alliance} />
                    ))}
                  </div>
                </div>

                {/* Party-wise Results - Inline Scroll Format */}
                <div className={styles.partiesSection}>
                  <h3>Party-wise Results</h3>
                  <div className={styles.partiesScrollContainer}>
                    <div className={styles.partiesScrollContent}>
                      {currentStateData.parties.map((party) => (
                        <PartyInlineItem key={party.parties_id} party={party} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// Alliance Card Component
const AllianceCard = ({ alliance }) => {
  const getAllianceStyle = (name) => {
    const styles = {
      'NDA': { color: '#ff9933', bg: '#fff5e6' },
      'UPA': { color: '#19aaeb', bg: '#e8f4fe' },
      'UDF': { color: '#19aaeb', bg: '#e8f4fe' },
      'LDF': { color: '#ff3f5f', bg: '#f7e4e4' },
      'DMK': { color: '#ff3f5f', bg: '#f7e4e4' },
      'AIADMK': { color: '#028f09', bg: '#cdf7dd' },
      'INC': { color: '#19aaeb', bg: '#e8f4fe' },
      'TMC': { color: '#19aaeb', bg: '#e8f4fe' },
      'LEFT+INC': { color: '#19aaeb', bg: '#e8f4fe' },
      'BSP-SP': { color: '#0f7a3d', bg: '#e6f4ea' },
      'TVK': { color: '#ff9933', bg: '#fff5e6' },
      'OTH': { color: '#808080', bg: '#f0f0f0' }
    };
    return styles[name] || { color: '#666', bg: '#f5f5f5' };
  };

  const style = getAllianceStyle(alliance.name);

  return (
    <div className={styles.allianceCard} style={{ backgroundColor: style.bg }}>
      <h4 className={styles.allianceName} style={{ color: style.color }}>
        {alliance.name}
      </h4>
      <div className={styles.allianceStats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Leading</span>
          <span className={styles.statValue}>{alliance.leading}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Won</span>
          <span className={styles.statValue}>{alliance.won}</span>
        </div>
      </div>
    </div>
  );
};

// Party Inline Item Component - Shows "Party Name Won + Leading"
const PartyInlineItem = ({ party }) => {
  const total = party.won_count + party.leading_count;
  
  return (
    <div className={styles.partyInlineItem}>
      <span className={styles.partyNameInline}>{party.party_name}</span>
      <div className={styles.partyResultsWrapper}>
        <span className={styles.partyWonCount}>{party.won_count}</span>
        <span className={styles.partyPlusSign}>+</span>
        <span className={styles.partyLeadingCount}>{party.leading_count}</span>
      </div>
    </div>
  );
};

export default ElectionResults;