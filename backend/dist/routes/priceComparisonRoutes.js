"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const priceComparisonController_1 = require("../controllers/priceComparisonController");
const router = (0, express_1.Router)();
router.get('/:productId', priceComparisonController_1.getPriceComparison);
exports.default = router;
