//imports 
const request = require('supertest'); 
const app = require('../server'); 
const { sequelize } = require('../database/db'); 

//gets a clean db before running
beforeAll(async () => {
    await sequelize.sync({ force: true });
});

// closes db after running
afterAll(async () => {
    await sequelize.close();
});

describe('API Tests', () => {
    it('should fetch all orders', async () =>{
        const res = await request(app).get('/orders');
        expect(res.statusCode).toEqual(200);
    });

    it('should create a new order', async () => {
        const res = await request(app).post('/orders').send({
            customerName: 'Test User',
            pickupTime: '3:00',
            isDelivery: true,
        });
        expect(res.statusCode).toEqual(201);
    });

    it('should retun 400 for missing data', async () => {
        const res = await request(app)
        .post('/orders')
        .send({});

        //expecting an error
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    }); 
});