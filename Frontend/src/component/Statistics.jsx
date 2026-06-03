import React from 'react';

const Statistics = () => {
  return (
    <section className="statistics" id="statistics">
      <div className="container">
        <h2>Our Key Statistics</h2>
        <p className="section-subtitle">A look at our growth and impact over the years.</p>
        
        <div className="statistics-layout">
          <div className="statistics-points">
            <div className="stat-point">
              <div className="stat-point-icon">🚀</div>
              <div className="stat-point-text">
                <h4>Rapid Growth</h4>
                <p>Consistent 40% year-over-year revenue growth since inception.</p>
              </div>
            </div>
            <div className="stat-point">
              <div className="stat-point-icon">🌍</div>
              <div className="stat-point-text">
                <h4>Global Reach</h4>
                <p>Operating in over 15 countries with localized support teams.</p>
              </div>
            </div>
            <div className="stat-point">
              <div className="stat-point-icon">💡</div>
              <div className="stat-point-text">
                <h4>Innovative Solutions</h4>
                <p>Invested $5M+ in R&D to bring cutting-edge AI features.</p>
              </div>
            </div>
            <div className="stat-point">
              <div className="stat-point-icon">⭐</div>
              <div className="stat-point-text">
                <h4>Customer Satisfaction</h4>
                <p>Maintaining a 98% CSAT score with a dedicated success team.</p>
              </div>
            </div>
          </div>
          
          <div className="statistics-graph">
            <div className="graph-card">
              <h4>Yearly Revenue Growth</h4>
              <div className="svg-graph-container">
                <svg viewBox="0 0 500 300" className="animated-graph">
                  {/* Grid Lines */}
                  <line x1="50" y1="250" x2="480" y2="250" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
                  <line x1="50" y1="200" x2="480" y2="200" stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="50" y1="150" x2="480" y2="150" stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="50" y1="100" x2="480" y2="100" stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="50" y1="50" x2="480" y2="50" stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeDasharray="5,5" />
                  
                  {/* Y-Axis Labels */}
                  <text x="40" y="255" fill="#475569" fontSize="12" textAnchor="end">0</text>
                  <text x="40" y="205" fill="#475569" fontSize="12" textAnchor="end">25%</text>
                  <text x="40" y="155" fill="#475569" fontSize="12" textAnchor="end">50%</text>
                  <text x="40" y="105" fill="#475569" fontSize="12" textAnchor="end">75%</text>
                  <text x="40" y="55" fill="#475569" fontSize="12" textAnchor="end">100%</text>
                  
                  {/* X-Axis Labels */}
                  <text x="90" y="270" fill="#475569" fontSize="12" textAnchor="middle">2021</text>
                  <text x="180" y="270" fill="#475569" fontSize="12" textAnchor="middle">2022</text>
                  <text x="270" y="270" fill="#475569" fontSize="12" textAnchor="middle">2023</text>
                  <text x="360" y="270" fill="#475569" fontSize="12" textAnchor="middle">2024</text>
                  <text x="450" y="270" fill="#475569" fontSize="12" textAnchor="middle">2025</text>
                  
                  {/* Area under the line */}
                  <path 
                    d="M 90 220 C 130 200, 150 180, 180 150 C 220 110, 240 130, 270 90 C 310 40, 330 80, 360 60 C 400 40, 420 30, 450 20 L 450 250 L 90 250 Z" 
                    fill="url(#area-gradient)" 
                    className="area-animation"
                  />

                  {/* Line Graph */}
                  <path 
                    d="M 90 220 C 130 200, 150 180, 180 150 C 220 110, 240 130, 270 90 C 310 40, 330 80, 360 60 C 400 40, 420 30, 450 20" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    className="path-animation"
                  />
                  
                  {/* Data Points */}
                  <circle cx="90" cy="220" r="5" fill="#a78bfa" />
                  <circle cx="180" cy="150" r="5" fill="#a78bfa" />
                  <circle cx="270" cy="90" r="5" fill="#a78bfa" />
                  <circle cx="360" cy="60" r="5" fill="#a78bfa" />
                  <circle cx="450" cy="20" r="6" fill="#ffffff" stroke="#a78bfa" strokeWidth="2" />

                  {/* Defs for gradients */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
