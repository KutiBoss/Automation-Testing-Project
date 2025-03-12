const Cart = require('../../models/cart'); // Imports the Cart model.
const Product = require('../../models/product'); // Imports the Product model.
const assert = require('assert'); // Imports the assert module for assertions.

describe('Shopping cart', function() { // Describes the test suite for the shopping cart.
  describe('shopping cart model', () => { // Describes the test suite for the Cart model.

    describe('Happy product', () => { // Describes the test suite for the Happy product scenario.
      let cart; // Declares a variable to hold a Cart instance.
      let product; // Declares a variable to hold a Product instance.

      beforeEach(() => { // Sets up the test environment before each test.
        cart = new Cart({}); // Creates a new Cart instance.
        product = new Product({ // Creates a new Product instance with Happy product details.
          "imagePath": "https://cdn.shopify.com/s/files/1/1061/1924/products/Emoji_Icon_-_Happy_large.png?v=1571606093",
          "title": "Happy",
          "description": "Happy",
          "price": 5.5
        });
      });

      it('adds a sticker to the cart', function() { // Tests adding a Happy product to the cart.
        cart.add(product, product.id); // Adds the product to the cart.
        assert.equal(cart.totalPrice, 5.5); // Asserts that the total price is correct.
      });

      it('removes a sticker from the cart', function() { // Tests removing one Happy product from the cart.
        cart.add(product, product.id); // Adds the product to the cart.
        cart.reduceByOne(product.id); // Removes one product.
        assert.deepEqual(cart.items, {}); // Asserts that the cart is empty.
        assert.equal(cart.totalPrice, 0); // Asserts that the total price is 0.
      });

      it('remove all quantities of sticker from the cart', function() { // Tests removing all Happy products from the cart.
        cart.add(product, product.id); // Adds the product.
        cart.add(product, product.id); // Adds the product again.
        cart.removeItem(product.id); // Removes all products.
        assert.deepEqual(cart.items, {}); // Asserts the cart is empty.
        assert.equal(cart.totalPrice, 0); // Asserts the total price is 0.
      });
    });

    describe('Angry product', () => { // Describes the test suite for the Angry product scenario.
      let cart; // Declares a variable to hold a Cart instance.
      let product; // Declares a variable to hold a Product instance.

      beforeEach(() => { // Sets up the test environment before each test.
        cart = new Cart({}); // Creates a new Cart instance.
        product = new Product({ // Creates a new Product instance with Angry product details.
          "imagePath": "https://cdn.shopify.com/s/files/1/1061/1924/products/Very_Angry_Emoji_7f7bb8df-d9dc-4cda-b79f-5453e764d4ea_large.png?v=1480481058",
          "title": "Angry",
          "description": "Angry",
          "price": 4.5
        });
      });

      it('adds a sticker to the cart', function() { // Tests adding an Angry product to the cart.
        cart.add(product, product.id); // Adds the product to the cart.
        assert.equal(cart.totalPrice, 4.5); // Asserts that the total price is correct.
      });

      it('removes a sticker from the cart', function() { // Tests removing one Angry product from the cart.
        cart.add(product, product.id); // Adds the product to the cart.
        cart.reduceByOne(product.id); // Removes one product.
        assert.deepEqual(cart.items, {}); // Asserts that the cart is empty.
        assert.equal(cart.totalPrice, 0); // Asserts that the total price is 0.
      });

      it('remove all quantities of sticker from the cart', function() { // Tests removing all Angry products from the cart.
        cart.add(product, product.id); // Adds the product.
        cart.add(product, product.id); // Adds the product again.
        cart.removeItem(product.id); // Removes all products.
        assert.deepEqual(cart.items, {}); // Asserts the cart is empty.
        assert.equal(cart.totalPrice, 0); // Asserts the total price is 0.
      });
    });

    it('returns an empty array', function() { // Tests that an empty cart returns an empty array.
      cart = new Cart({}); // Creates a new Cart instance.
      assert.deepEqual(cart.generateArray(), []); // Asserts that generateArray returns an empty array.
    });

    it('handles cart with both happy and angry products, removing angry product', () => { // Tests removing the Angry product when both Happy and Angry are in the cart.
      const cart = new Cart({}); // Creates a new Cart instance.
      const happyProduct = new Product({ // Creates a new Happy product.
        "imagePath": "https://cdn.shopify.com/s/files/1/1061/1924/products/Emoji_Icon_-_Happy_large.png?v=1571606093",
        "title": "Happy",
        "description": "Happy",
        "price": 5.5
      });
      happyProduct.id = 'happy-id'; // Sets the ID for the Happy product.

      const angryProduct = new Product({ // Creates a new Angry product.
        "imagePath": "https://cdn.shopify.com/s/files/1/1061/1924/products/Very_Angry_Emoji_7f7bb8df-d9dc-4cda-b79f-5453e764d4ea_large.png?v=1480481058",
        "title": "Angry",
        "description": "Angry",
        "price": 4.5
      });
      angryProduct.id = 'angry-id'; // Sets the ID for the Angry product.

      cart.add(happyProduct, happyProduct.id); // Adds the Happy product to the cart.
      cart.add(angryProduct, angryProduct.id); // Adds the Angry product to the cart.

      cart.removeItem(angryProduct.id); // Removes the Angry product from the cart.

      assert.deepEqual(cart.items, { // Asserts that only the Happy product remains in the cart.
        [happyProduct.id]: { item: happyProduct, qty: 1, price: 5.5 }
      });
      assert.equal(cart.totalPrice, 5.5); // Asserts that the total price reflects only the Happy product.
    });
  });
});