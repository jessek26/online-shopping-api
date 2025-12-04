//imports
const {sequelize, Employee, Order, Item} = require('./database/db');

//seed function
async function seed() {
    await sequelize.sync({ force: true });
    console.log('database tables created');

    //create data
    const Mike = await Employee.create({
        name: 'Mike',
        email: 'mike@store.com',
        role: 'admin'
    });

    const Sarah = await Employee.create({
        name: "Sarah",
        email: 'sarah@store.com',
        role: 'shopper'
    });

    const order1 = await Order.create({
        customerName: 'John Doe',
        pickupTime : '3:00',
        isDelivery: true,
        employeeId: Sarah.id
    });

    await Item.create({
        name: 'Milk',
        price: 3.99,
        orderId: order1.id
    });
    
    await Item.create({
        name: 'Bread',
        price: 2.50,
        orderId: order1.id
    });

    console.log('seeding complete.')
}

//run function
seed();