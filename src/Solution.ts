//defines a type for the pricing rules object
export type PricingRules = {
  [itemCode: string]: {
    price: number;
    bulkDiscount?: {
      threshold: number;
      discountedPrice: number;
    };
    multiBuy?: {
      buy: number;
      pay: number;
    };
  };
};

//  for scanning items and calculating the total price
export default class Checkout {
  pricingRules: PricingRules;
  scannedItems: string[];

  constructor(pricingRules: PricingRules) {
    this.pricingRules = pricingRules;
    this.scannedItems = [];
  }

  // adds an item code to the scannedItems array
  scan(itemCode: string) {
    this.scannedItems.push(itemCode);
  }

  // calculates the total price for the scanned items
  total() {
    const itemCounts = this.getCountsOfItems();
    let total = 0;

    for (const [itemCode, count] of Object.entries(itemCounts)) {
      const pricingRule = this.pricingRules[itemCode];

      //  If there is no pricing rule for the item
      if (!pricingRule) {
        throw new Error(`No pricing rule found for item ${itemCode}`);
      }

      const { price, bulkDiscount, multiBuy } = pricingRule;
      let itemTotal = count * price;
      if(multiBuy && Math.floor(count / multiBuy.buy)){
        let discountQuantity = Math.floor(count / multiBuy.buy)
        itemTotal -= price * discountQuantity
      }

      if (bulkDiscount && count > bulkDiscount.threshold) {
        itemTotal = count * bulkDiscount.discountedPrice;
      }

      total += itemTotal;
    }

    return total;
  }

  //  get a scanned count of each item
  private getCountsOfItems() {
    const counts: { [itemCode: string]: number } = {};
    for (const itemCode of this.scannedItems) {
      counts[itemCode] = (counts[itemCode] || 0) + 1;
    }
    return counts;
  }
}

// retrieves the pricing rule for each item
const pricingRules: PricingRules = {
  atv: {
    price: 109.50,
    multiBuy: {
      buy: 3,
      pay: 2,
    },
  },
  ipd: {
    price: 549.99,
    bulkDiscount: {
      threshold: 4,
      discountedPrice: 499.99,
    },
  },
  mbp: {
    price: 1399.99
  },
  vga: {
    price: 30.00
  },
};

// const co = new Checkout(pricingRules);
// co.scan("mbp");
// co.scan("vga");
// co.scan("atv");
// co.scan("atv");
// co.scan("atv");
// co.scan("ipd");
// co.scan("ipd");
// co.scan("ipd");
// co.scan("ipd");
// co.scan("ipd");
// console.log(co.total());