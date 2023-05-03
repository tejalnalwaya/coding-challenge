import Checkout, { PricingRules } from '../src/Solution';

describe('Checkout', () => {
  const pricingRules: PricingRules = {
    ipd: { price: 549.99, bulkDiscount: { threshold: 4, discountedPrice: 499.99 } },
    mbp: { price: 1399.99 },
    atv: { price: 109.5, multiBuy: { buy: 3, pay: 2 } },
    vga: { price: 30.0 },
  };

  describe('total', () => {
    test('should return 0 for an empty checkout', () => {
      const co = new Checkout(pricingRules);
      expect(co.total()).toBe(0);
    });

    test('should return the price of a single item', () => {
      const co = new Checkout(pricingRules);
      co.scan('ipd');
      expect(co.total()).toBe(549.99);
    });

    test('should apply bulk discount if item count meets threshold', () => {
      const co = new Checkout(pricingRules);
      co.scan('ipd');
      co.scan('ipd');
      co.scan('ipd');
      co.scan('ipd');
      co.scan('ipd');
      expect(co.total()).toBe(2499.95);
    });

    test('should apply multi-buy discount if item count meets threshold', () => {
      const co = new Checkout(pricingRules);
      co.scan('atv');
      co.scan('atv');
      co.scan('atv');
      expect(co.total()).toBe(219);
    });

    test('should apply both discounts if item count meets both thresholds', () => {
      const co = new Checkout(pricingRules);
      co.scan('ipd');
      co.scan('ipd');
      co.scan('ipd');
      co.scan('ipd');
      co.scan('ipd');
      co.scan('atv');
      co.scan('atv');
      co.scan('atv');
      expect(co.total()).toBe(2718.95);
    });

    test('should apply both discounts if item count meets both thresholds with non-discounted items', () => {
      const co = new Checkout(pricingRules);
      co.scan('ipd');
      co.scan('ipd');
      co.scan('ipd');
      co.scan('ipd');
      co.scan('ipd');
      co.scan('atv');
      co.scan('atv');
      co.scan('atv');
      co.scan('mbp');
      co.scan('vga');
      expect(co.total()).toBe(4148.94);
    });

    // mentioned test cases in question
    test('should calculate with discounts on multibuy and non-discounted item', () => {
      const co = new Checkout(pricingRules);
      co.scan('atv');
      co.scan('atv');
      co.scan('atv');
      co.scan('vga');
      expect(co.total()).toBe(249.00);
    });

    test('should calculate with discounts on threshold items and non-discounted category', () => {
      const co = new Checkout(pricingRules);
      co.scan('atv');
      co.scan('ipd');
      co.scan('ipd');
      co.scan('atv');
      co.scan('ipd');
      co.scan('ipd');
      co.scan('ipd');
      expect(co.total()).toBe(2718.95);
    });

    test('should throw an error for an unknown item code', () => {
      const co = new Checkout(pricingRules);
      co.scan('ptv');
      expect(() => co.total()).toThrow('No pricing rule found for item ptv');
    });
  });
});

