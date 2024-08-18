const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');


app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb+srv://db_user_read:LdmrVA5EDEv4z3Wr@cluster0.n10ox.mongodb.net/RQ_Analytics', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define models
const ShopifyOrder = mongoose.model('ShopifyOrder', new mongoose.Schema({}, { collection: 'shopifyOrders' }));
const ShopifyCustomer = mongoose.model('ShopifyCustomer', new mongoose.Schema({}, { collection: 'shopifyCustomers' }));

// Total Sales Over Time
app.get('/api/orders/total-sales', async (req, res) => {
    const { interval = 'monthly' } = req.query; // Default to monthly if not specified

    let dateFormat;
    switch (interval) {
        case 'daily':
            dateFormat = "%Y-%m-%d";
            break;
        case 'monthly':
            dateFormat = "%Y-%m";
            break;
        case 'quarterly':
            dateFormat = "%Y-Q";
            break;
        case 'yearly':
            dateFormat = "%Y";
            break;
        default:
            dateFormat = "%Y-%m"; // Default to monthly
    }

    try {
        const orders = await ShopifyOrder.aggregate([
            {
                $project: {
                    date: {
                        $dateToString: {
                            format: dateFormat,
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


// Sales Growth Rate Over Time
app.get('/api/orders/sales-growth-rate', async (req, res) => {
    try {
        const orders = await ShopifyOrder.aggregate([
            {
                $project: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m", // Group by month
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

        const growthRates = [];
        let previousSales = null;

        orders.forEach((order, index) => {
            if (index === 0) {
                growthRates.push(0); // No growth rate for the first period
            } else {
                const growthRate = ((order.totalSales - previousSales) / previousSales) * 100;
                growthRates.push(growthRate);
            }
            previousSales = order.totalSales;
        });

        res.json({
            labels: orders.map(order => order._id),
            growthRates,
        });
    } catch (error) {
        console.error('Error in /api/orders/sales-growth-rate:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});


// New Customers Added Over Time
app.get('/api/customers/new-customers', async (req, res) => {
    try {
        const customers = await ShopifyCustomer.aggregate([
            {
                $project: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m", // Group by month
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
                    }
                }
            },
            {
                $group: {
                    _id: "$date",
                    newCustomers: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            labels: customers.map(customer => customer._id),
            newCustomers: customers.map(customer => customer.newCustomers)
        });
    } catch (error) {
        console.error('Error in /api/customers/new-customers:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});


// Number of Repeat Customers
app.get('/api/customers/repeat-customers', async (req, res) => {
    try {
        const interval = req.query.interval || 'monthly'; // Default to monthly
        let dateFormat;

        // Determine the date format based on the interval
        switch (interval) {
            case 'yearly':
                dateFormat = "%Y";
                break;
            case 'quarterly':
                dateFormat = {
                    $concat: [
                        { $substr: [{ $year: { $dateFromString: { dateString: "$customerDetails.created_at" } } }, 0, 4] },
                        "-Q",
                        {
                            $substr: [
                                { $ceil: { $divide: [{ $month: { $dateFromString: { dateString: "$customerDetails.created_at" } } }, 3] } }, 0, 1
                            ]
                        }
                    ]
                };
                break;
            case 'daily':
                dateFormat = "%Y-%m-%d";
                break;
            case 'monthly':
            default:
                dateFormat = "%Y-%m";
        }

        const repeatCustomers = await ShopifyOrder.aggregate([
            {
                $group: {
                    _id: "$customer.email",
                    purchaseCount: { $sum: 1 }
                }
            },
            {
                $match: {
                    purchaseCount: { $gt: 1 }
                }
            },
            {
                $lookup: {
                    from: 'shopifyCustomers',
                    localField: '_id',
                    foreignField: 'email',
                    as: 'customerDetails'
                }
            },
            { $unwind: "$customerDetails" },
            {
                $project: {
                    date: {
                        $dateToString: {
                            format: dateFormat,
                            date: {
                                $cond: {
                                    if: { $isNumber: "$customerDetails.created_at" },
                                    then: "$customerDetails.created_at",
                                    else: {
                                        $dateFromString: {
                                            dateString: "$customerDetails.created_at"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$date",
                    repeatCustomers: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            labels: repeatCustomers.map(customer => customer._id),
            repeatCustomers: repeatCustomers.map(customer => customer.repeatCustomers)
        });
    } catch (error) {
        console.error('Error in /api/customers/repeat-customers:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});



// Geographical Distribution of Customers
app.get('/api/customers/geographical-distribution', async (req, res) => {
    try {
        const cityDistribution = await ShopifyCustomer.aggregate([
            {
                $group: {
                    _id: "$default_address.city", // Group by city
                    customerCount: { $sum: 1 }
                }
            },
            { $sort: { customerCount: -1 } } // Sort by customer count descending
        ]);

        res.json({
            cities: cityDistribution.map(city => city._id),
            customerCount: cityDistribution.map(city => city.customerCount)
        });
    } catch (error) {
        console.error('Error in /api/customers/geographical-distribution:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});


// Customer Lifetime Value by Cohorts
app.get('/api/customers/lifetime-value-cohorts', async (req, res) => {
    try {
        const cohortLifetimeValue = await ShopifyOrder.aggregate([
            {
                $lookup: {
                    from: 'shopifyCustomers', // Join with the customers collection
                    localField: 'email',
                    foreignField: 'email',
                    as: 'customerDetails'
                }
            },
            { $unwind: "$customerDetails" },
            {
                $group: {
                    _id: {
                        cohort: {
                            $dateToString: {
                                format: "%Y-%m",
                                date: {
                                    $cond: {
                                        if: { $isNumber: "$customerDetails.created_at" },
                                        then: "$customerDetails.created_at",
                                        else: {
                                            $dateFromString: {
                                                dateString: "$customerDetails.created_at"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        customerId: "$customerDetails._id"
                    },
                    totalSpent: { $sum: { $toDouble: "$total_price" } }
                }
            },
            {
                $group: {
                    _id: "$_id.cohort",
                    lifetimeValue: { $sum: "$totalSpent" },
                    customerCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            cohorts: cohortLifetimeValue.map(cohort => cohort._id),
            lifetimeValue: cohortLifetimeValue.map(cohort => cohort.lifetimeValue),
            customerCount: cohortLifetimeValue.map(cohort => cohort.customerCount)
        });
    } catch (error) {
        console.error('Error in /api/customers/lifetime-value-cohorts:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
