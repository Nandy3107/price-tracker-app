"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePrices = void 0;
const comparePrices = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    // Stub: Replace with real scraping/API logic
    return [
        { name: 'Amazon', price: 999, url: 'https://amazon.com/product/' + productId },
        { name: 'Flipkart', price: 950, url: 'https://flipkart.com/product/' + productId },
        { name: 'Myntra', price: 970, url: 'https://myntra.com/product/' + productId }
    ];
});
exports.comparePrices = comparePrices;
