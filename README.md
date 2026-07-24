# Protective Put Pricer

**[Live Demo →](https://black-scholes-pricer-taupe.vercel.app/)**

A Black-Scholes put option pricer built as an interactive trading dashboard. Drag the sliders and watch the theoretical price, Greeks, and payoff diagram update in real time.

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

The standard normal CDF is implemented using the Abramowitz & Stegun rational approximation (1964, algorithm 26.2.17), giving a max absolute error of ~7.5×10⁻⁸.

## Tech stack

- **React 18 + Vite** — component architecture, fast HMR
- **Tailwind CSS v3** — utility styling
- **Recharts** — payoff diagram
- Pure JavaScript math — no external finance libraries

## Run locally

```bash
git clone https://github.com/geetika-create/black-scholes-pricer.git
cd black-scholes-pricer
npm install
npm run dev
```

Open `http://localhost:5173`

## Notes

Theoretical prices only — not financial advice. The model assumes log-normal returns, constant volatility, no dividends, and continuous trading.
