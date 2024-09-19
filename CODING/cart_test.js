const Cart = require('./cart');

const cart = new Cart();

cart.createCart();

cart.addProduct('A', 3, 500);
cart.addProduct('B', 5, 1700);
cart.addProduct('A', 7, 500);
cart.addProduct('C', 30, 14);

console.log("Products in cart: ", cart.getProductList());
console.log(`Number of products: ${cart.countUniqueProduct()}`);
console.log(`Total amount of products: ${cart.totalAmountProduct()}`);

cart.updateProduct('D', 10);
cart.removeProduct('A');
cart.updateProduct('B', 1);

console.log("Products A exits: ", cart.checkProductExist('A'));
console.log("Products B exits: ", cart.checkProductExist('B'));
console.log("Products C exits: ", cart.checkProductExist('C'));
console.log("Cart is empty: ", cart.isEmpty());

cart.addProduct('D', 11, 32);
console.log("Products in cart: ", cart.getProductList());
console.log("Total amount: ", cart.calculateTotalAmount());

cart.applyCoupon('Hot Sale', 'fixed', 100);
console.log("Total amount: ", cart.calculateTotalAmount());

cart.removeCoupon('Hot Sale');
console.log("Total amount: ", cart.calculateTotalAmount());

cart.applyCoupon('Special Sale', 'percentage', 50, 1000);
console.log("Total amount: ", cart.calculateTotalAmount());

console.log("Products in cart: ", cart.getProductList());
cart.addFreebie('B', 'D', 2);
cart.checkAndAppleFreebie();

console.log("Products in cart: ", cart.getProductList());
console.log("Total amount: ", cart.calculateTotalAmount());