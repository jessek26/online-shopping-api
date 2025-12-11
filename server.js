//imports 
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//database
const {sequelize, Employee, Order, Item} = require('./database/db');
const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET;

//json middleware
app.use(express.json());

//replaces try/catch blocks
const errorHandler = (fn) => (req,res,next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

//request routes
//get /orders - gets and displays every order w/ their items
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: Item
        });
    res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//post /orders - create an order
app.post('/orders', async (req, res) => {
    try{
        const {customerName, pickupTime, isDelivery, status} = req.body;

        //create new order using user data
        const newOrder = await Order.create({
            customerName: customerName,
            pickupTime: pickupTime,
            isDelivery: isDelivery,
            status: status
        });
        //return order with 201 status
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

//delete /orders:id - deletes an order
app.delete('/orders/:id', async (req,res) => {
    try {
        //grab order id from url
        const id = req.params.id;
        //find order
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({error: 'Order not found'});
        }
            await order.destroy();
            return res.status(200).json({message: 'Order deleted.'})

    } catch (err){
        res.status(400).json({error: err.message});
    }
});

//patch /orders/:id - update an order
app.patch('/orders/:id', async (req,res) => {
    try {
        //grab id from url and find order
        const id = req.params.id;
        const order = await Order.findByPk(id);

        //if there order with provided id doesnt exist
        if(!order) {
            return res.status(404).json({error: 'order not found'});
        }
        //update the order and return it
        await order.update(req.body);
        return res.json(order);

    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

//post /items - create items
app.post('/items', async (req,res) => {
    try {
        //collect item info from body 
        const {name, price, department, orderId} = req.body;
        //create new item with info
        const newItem = await Item.create({
            name,
            price,
            department,
            orderId
        });
        //return the new item
        res.status(201).json(newItem);

    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

//post /register
app.post('/register', errorHandler(async (req,res) => {
    const {name, email, password, role} = req.body;

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const user = await Employee.create({
        name, 
        email,
        role,
        password: hashedPassword
    });

    res.status(201).json(user);
}));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: err.message});
});

//post /login
app.post('/login', errorHandler( async (req,res) => {
    const user = await Employee.findOne({ where: {
        email: req.body.email
    }});

    if(!user) {
        return res.status(401).json({ error: "Invalid credentials"} );
    }

    //compares password
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if(!isValid) {
        return res.status(401).json({ error: "Incorrect password"});
    }

    //gives the user a token which expires in 1 hour
    const token = jwt.sign(
        {id: user.id, role: user.role},
        SECRET_KEY,
        {expiresIn: '1h' }
    );
    res.json({ token });
}));

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`server running on http://localhost:${PORT}`);
    });
}
module.exports = app;