"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const referralController_1 = require("../controllers/referralController");
const router = (0, express_1.Router)();
router.get('/code', referralController_1.getReferralCode);
router.post('/cashback', referralController_1.processCashback);
exports.default = router;
