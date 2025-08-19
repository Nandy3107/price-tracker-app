"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const importController_1 = require("../controllers/importController");
const router = (0, express_1.Router)();
router.post('/url', importController_1.importProductFromUrl);
exports.default = router;
