const express = require("express");
const { getExchangeRates } = require("../controllers/currencyController");

const router = express.Router();

router.get("/rates", getExchangeRates);

module.exports = router;
