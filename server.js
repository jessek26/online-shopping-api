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

//replaces try/catch blocks
const errorHandler = (fn) => (req,res,next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

//middleware to authenticate JWT
const authToken = (req,res,next) => {
    //get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader ;

    //if user doesn't have a token, they get kicked out
    if(!token) return res.sendStatus(401);

    //token verification
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if(err) return res.sendStatus(403);

        req.user = user;
        next();
    });
};

//used for Admin only tasks
const requireAdmin = (req,res,next) => {
    //check role
    //if user isn't an admin do not allow their action
    if (req.user.role !== 'admin') {
        return res.status(403).json({error: "Access denied. Admins only"});
    }
    //allow admins
    next();
};

//json middleware
app.use(express.json());

//request routes
//get /orders - gets and displays every order w/ their items
app.get('/orders', authToken, errorHandler(async (req, res) => {
        const orders = await Order.findAll({
            include: Item
        });
    res.json(orders);
}));

//post /orders - create an order
app.post('/orders', authToken, requireAdmin, errorHandler(async (req, res) => {
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
    
}));

//delete /orders:id - deletes an order
app.delete('/orders/:id', authToken, requireAdmin, errorHandler(async (req,res) => {

        //grab order id from url
        const id = req.params.id;
        //find order
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({error: 'Order not found'});
        }
            await order.destroy();
            return res.status(200).json({message: 'Order deleted.'})
}));

//patch /orders/:id - update an order
app.patch('/orders/:id', authToken, errorHandler(async (req,res) => {
    const id = req.params.id;
    const order = await Order.findByPk(id);

    //if the order doesn't exists
    if(!order) return res.status(404).json({error: 'Order not found'});

    if(req.user.role !== 'admin') {
        if(order.employeeId !== req.user.id) {
            return res.status(403).json({error: 'You can only make changes to orders assigned to you'});
        }
    }
    await order.update(req.body);
    res.json(order);
}));

//post /items - create items
app.post('/items', authToken, errorHandler(async (req,res) => {
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
}));

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

//post /login
app.post('/login', errorHandler(async (req,res) => {
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

app.post('/logout', (req, res) => {
    res.json({message: 'Logout successful'});
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: err.message});
});


// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`server running on http://localhost:${PORT}`);
    });
}
module.exports = app;