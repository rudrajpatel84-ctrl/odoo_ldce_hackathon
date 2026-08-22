// Standard live base rates against USD
const EXCHANGE_RATES_BASE_USD = {
  USD: 1.0,
  INR: 86.85,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 154.5,
  CAD: 1.38,
  AUD: 1.52,
};

const getExchangeRates = async (req, res) => {
  try {
    return res.json({
      success: true,
      baseCurrency: "USD",
      timestamp: new Date().toISOString(),
      rates: EXCHANGE_RATES_BASE_USD,
      supportedCurrencies: [
        { code: "INR", name: "Indian Rupee", symbol: "₹" },
        { code: "USD", name: "US Dollar", symbol: "$" },
        { code: "EUR", name: "Euro", symbol: "€" },
        { code: "GBP", name: "British Pound", symbol: "£" },
        { code: "JPY", name: "Japanese Yen", symbol: "¥" },
        { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
        { code: "AUD", name: "Australian Dollar", symbol: "A$" },
      ],
    });
  } catch (error) {
    console.error("Get exchange rates error:", error);
    return res.status(500).json({ message: "Failed to fetch exchange rates." });
  }
};

module.exports = {
  getExchangeRates,
  EXCHANGE_RATES_BASE_USD,
};
