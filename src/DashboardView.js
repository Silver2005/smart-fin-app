import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --navy-950: #050d1a;
    --navy-900: #0a1628;
    --navy-800: #0f2044;
    --navy-700: #1a3160;
    --navy-600: #1e3a7a;
    --blue-500: #2563eb;
    --blue-400: #3b82f6;
    --blue-300: #93c5fd;
    --accent:   #60a5fa;
    --success:  #10b981;
    --danger:   #ef4444;
    --border:   rgba(59,130,246,0.12);
    --border-subtle: rgba(255,255,255,0.06);
    --text-primary: #f1f5f9;
    --text-secondary: #64748b;
    --text-muted: #334155;
    --surface: #0c1a2e;
    --surface-hover: #0f2040;
  }

  .db-root {
    font-family: 'Inter', sans-serif;
    background: var(--navy-950);
    min-height: 100vh;
    color: var(--text-primary);
  }

  /* ── GRID LAYOUT ── */
  .db-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    animation: dbFadeUp 0.4s ease both;
  }
  @keyframes dbFadeUp {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── SECTION LABEL ── */
  .db-section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 8px;
    padding-left: 2px;
  }

  /* ── STAT CARDS ROW ── */
  .db-stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .db-stat {
    background: var(--surface);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: border-color 0.2s, background 0.2s;
    animation: dbFadeUp 0.4s ease both;
  }
  .db-stat:hover {
    background: var(--surface-hover);
    border-color: var(--border);
  }
  .db-stat:nth-child(1) { animation-delay: 0.05s; }
  .db-stat:nth-child(2) { animation-delay: 0.1s; }

  .db-stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .db-stat-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
    letter-spacing: 0.01em;
  }
  .db-stat-icon {
    width: 28px; height: 28px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
  }
  .db-stat-icon.red  { background: rgba(239,68,68,0.1); }
  .db-stat-icon.green { background: rgba(16,185,129,0.1); }

  .db-stat-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 20px; font-weight: 500;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }
  .db-stat-value.red   { color: var(--danger); }
  .db-stat-value.green { color: var(--success); }

  .db-stat-sub {
    font-size: 10px;
    color: var(--text-muted);
    font-weight: 400;
  }

  /* ── NET CARD ── */
  .db-net-card {
    background: var(--surface);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation: dbFadeUp 0.4s 0.15s ease both;
    transition: border-color 0.2s;
  }
  .db-net-card:hover { border-color: var(--border); }

  .db-net-left {}
  .db-net-eyebrow {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 6px;
  }
  .db-net-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 32px; font-weight: 500;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .db-net-value.pos { color: var(--success); }
  .db-net-value.neg { color: var(--danger); }

  .db-net-badge {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.01em;
  }
  .db-net-badge.pos { background: rgba(16,185,129,0.1); color: var(--success); }
  .db-net-badge.neg { background: rgba(239,68,68,0.1);  color: var(--danger); }
  .db-net-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  /* ── CHART CARD ── */
  .db-chart-card {
    background: var(--surface);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    padding: 20px 16px 12px;
    animation: dbFadeUp 0.4s 0.2s ease both;
  }
  .db-chart-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .db-chart-title {
    font-size: 13px; font-weight: 600;
    color: var(--text-primary);
  }
  .db-chart-tag {
    font-size: 10px; font-weight: 500;
    color: var(--blue-400);
    background: rgba(59,130,246,0.08);
    border: 1px solid rgba(59,130,246,0.15);
    padding: 3px 8px; border-radius: 6px;
    letter-spacing: 0.03em;
  }

  /* ── DIVIDER ── */
  .db-divider {
    height: 1px;
    background: var(--border-subtle);
    margin: 4px 0;
  }

  /* ── PRINT BUTTON ── */
  .db-print-btn {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px;
    background: transparent;
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 12px; font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
    animation: dbFadeUp 0.4s 0.25s ease both;
  }
  .db-print-btn:hover {
    background: var(--surface-hover);
    border-color: rgba(59,130,246,0.25);
    color: var(--blue-300);
  }
  .db-print-btn svg {
    width: 14px; height: 14px; opacity: 0.7;
  }

  /* Tooltip */
  .db-tooltip {
    background: #0f2040;
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 8px;
    padding: 8px 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text-primary);
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .db-tooltip-label {
    font-family: 'Inter', sans-serif;
    font-size: 10px; color: var(--text-secondary);
    margin-bottom: 2px;
    letter-spacing: 0.05em; text-transform: uppercase;
  }
`;

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let startTime;
    const start = 0, duration = 700;
    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(start + (value - start) * ease));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return display.toLocaleString('fr-FR');
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="db-tooltip">
      <div className="db-tooltip-label">{label}</div>
      <div>{Number(payload[0].value).toLocaleString('fr-FR')} F</div>
    </div>
  );
};

const DashboardView = ({ situation }) => {
  const isPos = situation.difference >= 0;

  const dataGraph = [
    { name: 'Sorties', s: situation.montant_depense },
    { name: 'Entrées', s: situation.montant_obtenu  },
    { name: 'Solde',   s: situation.difference      },
  ];

  return (
    <>
      <style>{style}</style>
      <div className="db-root">
        <div className="db-grid">

          {/* Stats row */}
          <div>
            <div className="db-section-label">Résumé financier</div>
            <div className="db-stats-row">

              <div className="db-stat">
                <div className="db-stat-header">
                  <span className="db-stat-label">Total Achats</span>
                  <div className="db-stat-icon red">↓</div>
                </div>
                <div className="db-stat-value red">
                  <AnimatedNumber value={situation.montant_depense} /> F
                </div>
                <div className="db-stat-sub">Sorties de caisse</div>
              </div>

              <div className="db-stat">
                <div className="db-stat-header">
                  <span className="db-stat-label">Total Ventes</span>
                  <div className="db-stat-icon green">↑</div>
                </div>
                <div className="db-stat-value green">
                  <AnimatedNumber value={situation.montant_obtenu} /> F
                </div>
                <div className="db-stat-sub">Entrées de caisse</div>
              </div>

            </div>
          </div>

          {/* Net card */}
          <div className="db-net-card">
            <div className="db-net-left">
              <div className="db-net-eyebrow">Net en caisse</div>
              <div className={`db-net-value ${isPos ? 'pos' : 'neg'}`}>
                <AnimatedNumber value={situation.difference} /> F
              </div>
            </div>
            <div className={`db-net-badge ${isPos ? 'pos' : 'neg'}`}>
              <div className="db-net-dot" />
              {isPos ? 'Excédent' : 'Déficit'}
            </div>
          </div>

          {/* Chart */}
          <div className="db-chart-card">
            <div className="db-chart-header">
              <span className="db-chart-title">Aperçu des flux</span>
              <span className="db-chart-tag">Ce mois</span>
            </div>
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataGraph} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gPos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}   />
                    </linearGradient>
                    <linearGradient id="gNeg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis
                    dataKey="name" axisLine={false} tickLine={false}
                    tick={{ fill: '#334155', fontSize: 10, fontFamily: 'Inter', fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(59,130,246,0.2)', strokeWidth: 1 }} />
                  <Area
                    type="monotone" dataKey="s"
                    stroke={isPos ? '#3b82f6' : '#ef4444'} strokeWidth={1.5}
                    fill={isPos ? 'url(#gPos)' : 'url(#gNeg)'}
                    dot={{ r: 3, fill: isPos ? '#3b82f6' : '#ef4444', strokeWidth: 0 }}
                    activeDot={{ r: 4, fill: '#fff', stroke: isPos ? '#3b82f6' : '#ef4444', strokeWidth: 2 }}
                    isAnimationActive animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="db-divider" />

          {/* Print */}
          <button className="db-print-btn no-print" onClick={() => window.print()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
            Exporter le rapport
          </button>

        </div>
      </div>
    </>
  );
};

// Preview
const App = () => (
  <div style={{ padding: '1.5rem', background: '#050d1a', minHeight: '100vh' }}>
    <DashboardView situation={{ montant_depense: 142500, montant_obtenu: 215000, difference: 72500 }} />
  </div>
);

export default App;