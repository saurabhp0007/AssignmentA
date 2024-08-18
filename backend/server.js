const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Replace with your actual model name and collection
const ShopifyOrder = mongoose.model('ShopifyOrder', new mongoose.Schema({}, { collection: 'shopifyOrders' }));

mongoose.connect('mongodb+srv://db_user_read:LdmrVA5EDEv4z3Wr@cluster0.n10ox.mongodb.net/RQ_Analytics', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


// Define a sample mode

app.get('/api/orders/total-sales', async (req, res) => {
    try {
        const orders = await ShopifyOrder.aggregate([
            {
                $project: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m",  // Change to monthly format
                            date: {
                                $cond: {
                                    if: { $isNumber: "$created_at" },
                                    then: "$created_at",
                                    else: {
                                        $dateFromString: {
                                            dateString: "$created_at"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    totalSales: { $toDouble: "$total_price" }
                }
            },
            {
                $group: {
                    _id: "$date",
                    totalSales: { $sum: "$totalSales" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const labels = orders.map(order => order._id);
        const sales = orders.map(order => order.totalSales);

        res.json({ labels, sales });
    } catch (error) {
        console.error('Error in /api/orders/total-sales:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});









// Start the server on port 8000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
