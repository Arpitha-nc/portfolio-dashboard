const express = require("express");
const portfolioController = require("../controllers/portfolioController");

const router = express.Router();

router.get("/", portfolioController.getPortfolioData);

module.exports = router;
