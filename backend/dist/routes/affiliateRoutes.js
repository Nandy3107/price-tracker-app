"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const affiliateController_1 = require("../controllers/affiliateController");
const router = (0, express_1.Router)();
router.post('/convert', affiliateController_1.getAffiliateLink);
exports.default = router;
