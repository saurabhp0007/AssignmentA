// models/ShopifyCustomer.js
const mongoose = require('mongoose');

const shopifyCustomerSchema = new mongoose.Schema({
    // Define schema fields here
});

module.exports = mongoose.model('ShopifyCustomer', shopifyCustomerSchema);
