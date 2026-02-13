/**
 * Calculates the Annualized Return (CAGR) equivalent to XIRR for a single investment period.
 * Assumes the First Entry is the initial investment and the Latest Entry is the current value.
 * 
 * @param {number} firstValue - The initial value (treated as principal inflow).
 * @param {string} firstDate - ISO date string of the first entry.
 * @param {number} latestValue - The current value (treated as redemption outflow).
 * @param {string} latestDate - ISO date string of the latest entry.
 * @returns {number} - The annualized return rate (e.g., 0.10 for 10%).
 */
function calculateXIRR(firstValue, firstDate, latestValue, latestDate) {
  if (firstValue <= 0) return 0; // Avoid division by zero or negative start

  const start = new Date(firstDate);
  const end = new Date(latestDate);

  const diffTime = Math.abs(end - start);
  const diffDays = diffTime / (1000 * 60 * 60 * 24); // milliseconds to days

  if (diffDays === 0) return 0; // Same day return is undefined/0 for this purpose

  // Formula: (Latest / First) ^ (365 / Days) - 1
  const totalReturn = latestValue / firstValue;
  const years = diffDays / 365.0;

  // CAGR
  const cagr = Math.pow(totalReturn, 1 / years) - 1;

  return cagr;
}

/**
 * Newton-Raphson implementation for generic cash flows (Future Proofing)
 * @param {Array} cashFlows - Array of { amount, date }
 * @returns {number}
 */
function xirrGeneric(cashFlows) {
  // Placeholder for full XIRR if we switch back to transaction model
  // Not used in current "Snapshot" model
  return 0;
}

module.exports = { calculateXIRR };
