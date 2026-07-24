import React, { useState, useEffect, useRef } from 'react';

const SLIDER_CONFIGS = [
  {
    key: 'S',
    label: 'Stock Price',
    symbol: 'S',
    min: 1,
    max: 500,
    step: 1,
    format: (v) => `$${v.toFixed(0)}`,
    description: 'The current market price of the underlying stock. As S rises above the strike, the put moves out-of-the-money and loses value.',
  },
  {
    key: 'K',
    label: 'Strike Price',
    symbol: 'K',
    min: 1,
    max: 500,
    step: 1,
    format: (v) => `$${v.toFixed(0)}`,
    description: 'The price at which you have the right to sell the stock. The put is in-the-money when S < K.',
  },
  {
    key: 'T',
    label: 'Time to Expiry',
    symbol: 'T',
    min: 0.01,
    max: 5,
    step: 0.01,
    format: (v) => `${v.toFixed(2)}y`,
    description: 'Time until the option expires, in years (e.g. 0.25 = 3 months). More time = higher premium due to greater uncertainty.',
  },
  {
    key: 'r',
    label: 'Risk-Free Rate',
    symbol: 'r',
    min: 0,
    max: 0.2,
    step: 0.001,
    format: (v) => `${(v * 100).toFixed(1)}%`,
    description: 'The annualised risk-free interest rate (e.g. US Treasury yield). Higher rates reduce put value slightly via the discount factor.',
  },
  {
    key: 'sigma',
    label: 'Volatility',
    symbol: 'σ',
    min: 0.01,
    max: 2.0,
    step: 0.01,
    format: (v) => `${(v * 100).toFixed(0)}%`,
    description: 'Annualised implied volatility. The single input you cannot directly observe — higher σ means a more expensive put as the chance of a large move increases.',
  },
];

function InfoPopup({ description, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        zIndex: 50,
        width: 220,
        background: '#1D2226',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 10,
        padding: '10px 12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
      }}
    >
      <p style={{ fontSize: 12, color: '#B8BDC3', margin: 0, lineHeight: 1.5 }}>
        {description}
      </p>
    </div>
  );
}

export default function InputPanel({ values, onChange }) {
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(null); // key of open popup

  return (
    <div style={{ background: '#111416', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: 20 }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9BA0A8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
          Parameters
        </p>
      </div>

      {/* Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {SLIDER_CONFIGS.map(({ key, label, symbol, min, max, step, format, description }) => (
          <div key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                {/* Clickable symbol badge */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setOpenPopup(openPopup === key ? null : key)}
                    title={`About ${label}`}
                    style={{
                      fontSize: 11, fontWeight: 600, fontFamily: 'monospace',
                      color: openPopup === key ? '#FFFFFF' : '#9BA0A8',
                      background: openPopup === key ? '#1D2226' : '#181C1F',
                      padding: '2px 7px', borderRadius: 6,
                      border: `1px solid ${openPopup === key ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
                      cursor: 'pointer',
                      transition: 'color 0.1s, background 0.1s',
                      lineHeight: 1.6,
                    }}
                  >
                    {symbol}
                  </button>
                  {openPopup === key && (
                    <InfoPopup
                      description={description}
                      onClose={() => setOpenPopup(null)}
                    />
                  )}
                </div>

                <span style={{ fontSize: 13, fontWeight: 500, color: '#C4C9CF' }}>{label}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
                {format(values[key])}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={values[key]}
              onChange={(e) => onChange(key, parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        ))}
      </div>

      {/* Collapsible formula */}
      <div style={{ marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
        <button
          onClick={() => setFormulaOpen((o) => !o)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', background: 'transparent', border: 'none',
            cursor: 'pointer', padding: 0,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: '#9BA0A8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Formula Reference
          </span>
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ color: '#6B7280', transition: 'transform 0.15s ease', transform: formulaOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {formulaOpen && (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'd₁', value: '[ln(S/K) + (r + σ²/2)T] / σ√T' },
              { label: 'd₂', value: 'd₁ − σ√T' },
              { label: 'Put', value: 'K·e⁻ʳᵀ·N(−d₂) − S·N(−d₁)', accent: true },
            ].map(({ label, value, accent }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#6B7280', flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: accent ? '#19C37D' : '#9BA0A8', textAlign: 'right' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
