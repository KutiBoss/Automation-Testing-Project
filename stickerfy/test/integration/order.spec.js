const Cart = require('../../models/cart'); // Imports the Cart model from the specified file path.
const Product = require('../../models/product'); // Imports the Product model from the specified file path.
const assert = require('assert'); // Imports the assert module for making assertions in tests.
let chai = require('chai'); // Imports the Chai assertion library.
let chaiHttp = require('chai-http'); // Imports the Chai HTTP plugin for making HTTP requests in tests.
let app = require('../../app'); // Imports the Express application instance from the specified file path.
let should = chai.should(); // Initializes the should style of Chai assertions.

chai.use(chaiHttp); // Tells Chai to use the Chai HTTP plugin.

describe('Shopping cart Integration Test', () => { // Defines a test suite for shopping cart integration tests.
  describe('shopping cart model', () => { // Defines a nested test suite for the Cart model.

    describe('order test suite', () => { // Defines a test suite for order-related tests.
      let happyProduct; // Declares a variable to hold an instance of the Happy product.
      let angryProduct; // Declares a variable to hold an instance of the Angry product.
      let cart; // Declares a variable to hold an instance of the Cart.

      beforeEach(() => { // Sets up the test environment before each test in this suite.
        cart = new Cart({}); // Creates a new Cart instance with an empty initial state.
        happyProduct = new Product({ // Creates a new Product instance for the Happy product.
          "imagePath": "https://cdn.shopify.com/s/files/1/1061/1924/products/Emoji_Icon_-_Happy_large.png?v=1571606093",
          "title": "Happy",
          "price": 5.5
        });
        happyProduct.id = 'happy-id'; // Assigns an ID to the Happy product (adjust based on your ID generation).

        angryProduct = new Product({ // Creates a new Product instance for the Angry product.
          "imagePath": "https://cdn.shopify.com/s/files/1/1061/1924/products/Very_Angry_Emoji_7f7bb8df-d9dc-4cda-b79f-5453e764d4ea_large.png?v=1480481058",
          "title": "Angry",
          "price": 4.5
        });
        angryProduct.id = 'angry-id'; // Assigns an ID to the Angry product (adjust based on your ID generation).
      });

      it('adds two happy products and one angry product, reduces one happy, checks the cart, and completes an order', (done) => { // Defines a test case for cart operations and checkout.
        // Add two happy products
        cart.add(happyProduct, happyProduct.id); // Adds the Happy product to the cart.
        cart.add(happyProduct, happyProduct.id); // Adds the Happy product to the cart again.

        // Add one angry product
        cart.add(angryProduct, angryProduct.id); // Adds the Angry product to the cart.

        // Reduce one happy product
        cart.reduceByOne(happyProduct.id); // Reduces the quantity of the Happy product in the cart by one.

        // Check the cart contents
        const expectedCart = { // Defines the expected contents of the cart after operations.
          [happyProduct.id]: { item: happyProduct, qty: 1, price: 5.5 }, // Expects one Happy product.
          [angryProduct.id]: { item: angryProduct, qty: 1, price: 4.5 } // Expects one Angry product.
        };
        assert.deepEqual(cart.items, expectedCart); // Asserts that the actual cart contents match the expected contents.

        // Check the total price
        assert.equal(cart.totalPrice, 10); // Asserts that the total price of the cart is 9.5.

        // Simulate checkout (make a request to the checkout endpoint)
        chai.request(app) // Creates an HTTP request using Chai HTTP.
          .get('/checkout') // Makes a GET request to the /checkout endpoint.
          .end((err, res) => { // Executes the request and handles the response.
            res.should.have.status(200); // Asserts that the response status code is 200 (OK).
            done(); // Signals to Mocha that the asynchronous test is complete.
          });
      });
    });
  });
});