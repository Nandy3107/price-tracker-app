import express, { Request, Response } from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const router = express.Router();

// Utility: Detect store from URL
function detectStore(url: string) {
  if (url.includes('amazon.in') || url.includes('amzn.in')) return 'amazon';
  if (url.includes('flipkart.com')) return 'flipkart';
  if (url.includes('myntra.com')) return 'myntra';
  if (url.includes('ajio.com')) return 'ajio';
  if (url.includes('nykaa.com')) return 'nykaa';
  if (url.includes('meesho.com')) return 'meesho';
  if (url.includes('snapdeal.com')) return 'snapdeal';
  if (url.includes('paytmmall.com')) return 'paytm';
  if (url.includes('bigbasket.com')) return 'bigbasket';
  if (url.includes('jiomart.com')) return 'jiomart';
  return null;
}

// POST /api/import-product-url
// Unify with robust import logic from importController
import { importProductFromUrl } from '../controllers/importController';
// Enhance: Follow amzn.in short links before importing
import https from 'https';

async function resolveShortAmazonUrl(url: string): Promise<string> {
  // Only resolve if it's a short link
  if (!url.includes('amzn.in')) return url;
  return new Promise((resolve) => {
    https.get(url, { method: 'HEAD' }, (res) => {
      // Amazon short links always redirect (301/302) to the real product page
      const location = res.headers.location;
      if (location && (location.includes('amazon.in') || location.includes('amazon.com')))
        resolve(location);
      else
        resolve(url);
    }).on('error', () => resolve(url));
  });
}

const importProductWithShortLinkSupport = async (req: Request, res: Response) => {
  let { url } = req.body;
  if (url && url.includes('amzn.in')) {
    url = await resolveShortAmazonUrl(url);
    req.body.url = url;
  }
  // Call the main import logic
  return importProductFromUrl(req, res);
};

router.post('/import-product-url', importProductWithShortLinkSupport);

export default router;
