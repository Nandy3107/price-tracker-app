"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAffiliateLink = void 0;
const affiliateService_1 = require("../services/affiliateService");
const getAffiliateLink = (req, res) => {
    const { url } = req.body;
    if (!url)
        return res.status(400).json({ error: 'Missing url' });
    const affiliateUrl = (0, affiliateService_1.convertToAffiliateLink)(url);
    res.json({ affiliateUrl });
};
exports.getAffiliateLink = getAffiliateLink;
