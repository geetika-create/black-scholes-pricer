import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

function generatePayoffData(S, K, putPrice) {
  const low   = S * 0.5;
  const high  = S * 1.5;
  const steps = 100;
  const step  = (high - low) / steps;
  const data  = [];

  for (let i = 0; i <= steps; i++) {
    const sT = low + i * step;
    const stockPnL      = sT - S;
    const putPnL        = Math.max(K - sT, 0) - putPrice;
    const protectivePnL = stockPnL + putPnL;
    data.push({
      price:      parseFloat(sT.toFixed(2)),
      stock:      parseFloat(stockPnL.toFixed(2)),
      put:        parseFloat(putPnL.toFixed(2)),
      protective: parseFloat(protectivePnL.toFixed(2)),
    });
  }
  return data;
}

function dollarFormatter(value) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}$${value.toFixed(2)}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: '#181C1F',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 12,
      boxShadow: '0 2px 12px rgba(0,0,0,.5)',
    }}>
      <p style={{ color: '#9BA0A8', margin: '0 0 8px', fontWeight: 500 }}>
        At expiry: <span style={{ color: '#FFFFFF' }}>${Number(label).toFixed(2)}</span>
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
          <span style={{ color: '#9BA0A8' }}>{entry.name}:</span>
          <span style={{
            fontWeight: 600,
            marginLeft: 'auto',
            paddingLeft: 12,
            color: entry.value >= 0 ? '#19C37D' : '#E34C67',
          }}>
            {dollarFormatter(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function PayoffChart({ S, K, putPrice }) {
  const data = generatePayoffData(S, K, putPrice);

  return (
    <div style={{ background: '#111416', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9BA0A8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>
          Payoff at Expiration
        </p>
        <p style={{ fontSize: 12, color: '#8B9099', margin: 0 }}>
          Strike <span style={{ color: '#B8BDC3' }}>${K.toFixed(0)}</span>
          &nbsp;·&nbsp;Put cost <span style={{ color: '#B8BDC3' }}>${putPrice.toFixed(2)}</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 4, right: 16, left: 4, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />

          <XAxis
            dataKey="price"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            tick={{ fontSize: 11, fill: '#8B9099' }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'Stock Price at Expiry', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#8B9099' }}
          />

          <YAxis
            tickFormatter={(v) => `${v >= 0 ? '+' : ''}$${v.toFixed(0)}`}
            tick={{ fontSize: 11, fill: '#8B9099' }}
            axisLine={false}
            tickLine={false}
            width={60}
          />

          <ReferenceLine y={0} stroke="rgba(255,255,255,0.55)" strokeDasharray="4 2" strokeWidth={1} />
          <ReferenceLine
            x={K}
            stroke="#CFA53A"
            strokeDasharray="4 2"
            strokeWidth={1}
            label={{ value: 'K', position: 'top', fontSize: 11, fill: '#CFA53A' }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />

          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
            formatter={(value) => (
              <span style={{ color: '#9BA0A8', fontWeight: 500 }}>{value}</span>
            )}
          />

          <Line type="monotone" dataKey="stock"      name="Unhedged Stock"  stroke="#8B9099" strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: '#8B9099' }} />
          <Line type="monotone" dataKey="put"        name="Long Put"        stroke="#E34C67" strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: '#E34C67' }} />
          <Line type="monotone" dataKey="protective" name="Protective Put"  stroke="#19C37D" strokeWidth={2}   dot={false} activeDot={{ r: 3, fill: '#19C37D' }} />
        </LineChart>
      </ResponsiveContainer>

      {/* Callout row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16 }}>
        {[
          { color: '#8B9099', label: 'Unhedged Stock', desc: 'Unlimited upside, unlimited downside' },
          { color: '#E34C67', label: 'Long Put',       desc: 'Pays when stock falls below strike' },
          { color: '#19C37D', label: 'Protective Put', desc: 'Floor on downside · full upside kept' },
        ].map(({ color, label, desc }) => (
          <div key={label} style={{
            background: '#0B0D0F',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: 10,
            padding: '10px 12px',
            borderLeft: `2px solid ${color}`,
          }}>
            <span style={{ display: 'block', fontSize: 11, fontWeight: 600, color, marginBottom: 3 }}>{label}</span>
            <span style={{ fontSize: 11, color: '#8B9099' }}>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
