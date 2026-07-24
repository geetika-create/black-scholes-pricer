import React from 'react';

const GREEK_CONFIGS = [
  {
    key: 'delta',
    label: 'Delta',
    symbol: 'Δ',
    format: (v) => v.toFixed(4),
    description: 'Per $1 move in stock',
  },
  {
    key: 'gamma',
    label: 'Gamma',
    symbol: 'Γ',
    format: (v) => v.toFixed(4),
    description: 'Rate of Δ change per $1',
  },
  {
    key: 'theta',
    label: 'Theta',
    symbol: 'Θ',
    format: (v) => v.toFixed(4),
    description: 'Daily time decay',
  },
  {
    key: 'vega',
    label: 'Vega',
    symbol: 'V',
    format: (v) => v.toFixed(4),
    description: 'Per 1% vol move',
  },
];

function formatPrice(v) {
  return v.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const panel = {
  background: '#111416',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: 14,
  padding: 20,
};

export default function OutputPanel({ result }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Hero: Option Price */}
      <div style={panel}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9BA0A8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
          Theoretical Option Price
        </p>
        <p style={{ fontSize: 48, fontWeight: 700, color: '#19C37D', fontVariantNumeric: 'tabular-nums', margin: 0, lineHeight: 1 }}>
          {formatPrice(result.price)}
        </p>
        <p style={{ fontSize: 11, color: '#8B9099', marginTop: 8 }}>
          Black-Scholes · no dividends
        </p>
      </div>

      {/* Greeks grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {GREEK_CONFIGS.map(({ key, label, symbol, format, description }) => (
          <div key={key} style={{ ...panel, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 22, fontFamily: 'serif', fontWeight: 700, color: '#19C37D', lineHeight: 1 }}>
                {symbol}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#9BA0A8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
              </span>
            </div>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums', margin: 0 }}>
              {format(result[key])}
            </p>
            <p style={{ fontSize: 11, color: '#8B9099', marginTop: 6 }}>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
