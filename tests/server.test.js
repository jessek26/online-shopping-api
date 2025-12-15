const request = require('supertest');
const app = require('../server');
const { sequelize, Employee, Order } = require('../database/db');
const bcrypt = require('bcryptjs');

//variables for ID tokens
let adminToken;
let shopperToken;

beforeAll(async () => {
    //wipe db
    await sequelize.sync({ force: true });

    //create/login admin
    const adminPass = await bcrypt.hash('admin123', 10);
    await Employee.create({
        name: 'Admin User',
        email: 'admin@test.com',
        role: 'admin',
        password: adminPass
    });
    const adminRes = await request(app).post('/login').send({
        email: 'admin@test.com',
        password: 'admin123'
    });
    adminToken = adminRes.body.token; //saves token

    //create/login shopper
    const shopperPass = await bcrypt.hash('shopper123', 10);
    await Employee.create({
        name: 'Shopper User',
        email: 'shopper@test.com',
        role: 'shopper',
        password: shopperPass
    });
    const shopperRes = await request(app).post('/login').send({
        email: 'shopper@test.com',
        password: 'shopper123'
    });
    shopperToken = shopperRes.body.token; //saves token
});

afterAll(async() => {
    await sequelize.close();
});

describe('Authentication Endpoints', () => {
    
    //non-employee sign up
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                name: 'Stranger',
                email: 'new@test.com',
                password: 'password',
                role: 'shopper'
            });
        expect(res.statusCode).toEqual(201); 
    });

    // wrong password rejection
    it('should reject login with wrong password', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                email: 'admin@test.com',
                password: 'WRONG_PASSWORD' 
            });
        expect(res.statusCode).toEqual(401); 
    });
});

describe('Role-Based Access Control (RBAC)', () => {

    // admin creates order
    it('Admin should be able to create an order', async () => {
        const res = await request(app)
            .post('/orders')
            .set('Authorization', adminToken) 
            .send({
                customerName: 'Admin Order',
                pickupTime: '5:00 PM',
                status: 'pending'
            });
        expect(res.statusCode).toEqual(201);
    });

    // shopper creates order
    it('Shopper should not be able to create an order', async () => {
        const res = await request(app)
            .post('/orders')
            .set('Authorization', shopperToken) 
            .send({ customerName: 'Illegal Order' });
        
        expect(res.statusCode).toEqual(403); 
    });
});

describe('Advanced Logic', () => {

    // shopper sees empty list because the Admin's order wasn't assigned to them
    it('Shopper should see EMPTY orders list (Ownership)', async () => {

        const res = await request(app)
            .get('/orders')
            .set('Authorization', shopperToken);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(0); 
    });

    // filter testing
    it('should filter orders by status', async () => {
        const res = await request(app)
            .get('/orders?status=pending')
            .set('Authorization', adminToken); 
        
        expect(res.statusCode).toEqual(200);
        // ensures results match the filter
        if (res.body.length > 0) {
            expect(res.body[0].status).toBe('pending');
        }
    });
});