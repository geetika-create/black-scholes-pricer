import React, { useState, useMemo } from 'react';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import PayoffChart from './components/PayoffChart';
import { blackScholesPut } from './lib/blackScholes';

const DEFAULT_VALUES = {
  S: 100,
  K: 100,
  T: 1.0,
  r: 0.05,
  sigma: 0.20,
};

export default function App() {
  const [values, setValues] = useState(DEFAULT_VALUES);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const result = useMemo(
    () => blackScholesPut(values.S, values.K, values.T, values.r, values.sigma),
    [values]
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0B0D0F', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{
        background: '#111416',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Logo mark */}
            <div style={{
              width: 30, height: 30,
              background: '#181C1F',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#19C37D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                Protective Put Pricer
              </span>
              <span style={{ fontSize: 12, color: '#5B6167', marginLeft: 10 }}>
                Black-Scholes · European
              </span>
            </div>
          </div>

          {/* Status chip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#181C1F',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 8, padding: '5px 10px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#19C37D', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: '#7A8087' }}>Live Model</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>

          {/* Left: inputs */}
          <InputPanel values={values} onChange={handleChange} />

          {/* Right: outputs + chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <OutputPanel result={result} />
            <PayoffChart S={values.S} K={values.K} putPrice={result.price} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p style={{ fontSize: 11, color: '#5B6167', textAlign: 'center', margin: 0 }}>
          Theoretical prices only — not financial advice. Black-Scholes assumes log-normal returns, constant volatility, and no dividends.
        </p>
      </footer>
    </div>
  );
}
