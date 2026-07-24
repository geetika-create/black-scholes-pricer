/**
 * Black-Scholes Put Pricer + Greeks
 *
 * normCDF uses the Abramowitz & Stegun rational approximation (1964, 26.2.17)
 * max absolute error: ~7.5e-8
 */

/**
 * Cumulative standard normal distribution N(x)
 * Abramowitz & Stegun algorithm 26.2.17
 */
export function normCDF(x) {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const t = 1.0 / (1.0 + p * absX);
  const poly = t * (a1 + t * (a2 + t * (a3 + t * (a4 + t * a5))));
  const erf = 1.0 - poly * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * erf);
}

/**
 * Standard normal probability density function φ(x)
 */
export function normalPDF(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Black-Scholes Put pricer + Greeks
 *
 * @param {number} S     - Current stock price
 * @param {number} K     - Strike price
 * @param {number} T     - Time to expiration in years
 * @param {number} r     - Risk-free interest rate (e.g. 0.05 for 5%)
 * @param {number} sigma - Volatility (e.g. 0.20 for 20%)
 *
 * @returns {{ price, delta, gamma, theta, vega }}
 *   - price : theoretical put price
 *   - delta : dPrice/dS          (range: -1 to 0)
 *   - gamma : d²Price/dS²        (same as call)
 *   - theta : daily time decay   (raw annual / 365)
 *   - vega  : per 1% vol change  (raw / 100)
 */
export function blackScholesPut(S, K, T, r, sigma) {
  // Edge case: at expiration return intrinsic value + zeroed Greeks
  if (T <= 0) {
    const intrinsic = Math.max(K - S, 0);
    return {
      price: intrinsic,
      delta: S >= K ? 0 : -1,
      gamma: 0,
      theta: 0,
      vega: 0,
    };
  }

  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const Nd1  = normCDF(d1);
  const Nd2  = normCDF(d2);
  const Nnd1 = normCDF(-d1); // N(-d1)
  const Nnd2 = normCDF(-d2); // N(-d2)
  const phiD1 = normalPDF(d1);

  const discountFactor = Math.exp(-r * T);

  // Put price: K·e^(-rT)·N(-d2) - S·N(-d1)
  const price = K * discountFactor * Nnd2 - S * Nnd1;

  // Delta: N(d1) - 1
  const delta = Nd1 - 1;

  // Gamma: φ(d1) / (S·σ·√T)  — same for calls and puts
  const gamma = phiD1 / (S * sigma * sqrtT);

  // Theta (annual): -(S·φ(d1)·σ)/(2·√T) - r·K·e^(-rT)·N(-d2)
  // Displayed as daily: divide by 365
  const thetaAnnual = -(S * phiD1 * sigma) / (2 * sqrtT) - r * K * discountFactor * Nnd2;
  const theta = thetaAnnual / 365;

  // Vega (per 1% vol move): S·φ(d1)·√T / 100
  const vega = (S * phiD1 * sqrtT) / 100;

  return { price, delta, gamma, theta, vega };
}
