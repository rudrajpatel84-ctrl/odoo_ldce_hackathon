const express = require("express");
const {
  getRecommendationsByCity,
  getPopularDestinations,
} = require("../controllers/recommendationController");

const router = express.Router();

router.get("/popular", getPopularDestinations);
router.get("/:city", getRecommendationsByCity);

module.exports = router;
