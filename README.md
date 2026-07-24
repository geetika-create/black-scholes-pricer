# Black-Scholes Put Pricer

**[Live Demo →](https://black-scholes-pricer-taupe.vercel.app/)**

A Black-Scholes put option pricer built as an interactive dashboard. Drag the sliders and watch the theoretical price, Greeks, and payoff diagram update in real time.

---

## What it does

- **Prices European put options** using the closed-form Black-Scholes formula
- **Live Greeks** — Delta, Gamma, Theta (daily), and Vega (per 1% vol move) update instantly as you adjust inputs
- **Payoff diagram** — shows three lines at expiration: unhedged stock, long put, and the combined protective put position, telling the full hedging story
- **Collapsible formula reference** — the Black-Scholes formula is available inline for reference

## The model

```
d₁ = [ln(S/K) + (r + σ²/2)·T] / σ√T
d₂ = d₁ − σ√T
Put = K·e^(-rT)·N(−d₂) − S·N(−d₁)
```

| Input | Description |
|---|---|
| S | Current stock price |
| K | Strike price |
| T | Time to expiration (years) |
| r | Risk-free interest rate |
| σ | Annualised volatility |

## Tech stack

- **React 18 + Vite** — component architecture, fast HMR
- **Tailwind CSS v3** — utility styling
- **Recharts** — payoff diagram
- No external finance libraries

## Notes

Theoretical prices only — not financial advice. The model assumes log-normal returns, constant volatility, no dividends, and continuous trading.
