const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './store.db'
});

//initialize employee table
const Employee = sequelize.define('Employee', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'shopper'
    }
});

//intialize order table
const Order = sequelize.define('Order', {
    customerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pickupTime: {
        type: DataTypes.STRING
    },
    isDelivery: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    }
});

//intialize price table
const Item = sequelize.define('Item', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
    },
    department: {
        type: DataTypes.STRING
    },
    inStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

//defining relationships
//employees and orders
Employee.hasMany(Order, {foreignKey: 'employeeId'});
Order.belongsTo(Employee, {foreignKey: 'employeeId'});

//orders and items
Order.hasMany(Item, {foreignKey: 'orderId'});
Item.belongsTo(Order, {foreignKey: 'orderId'});

//exports
module.exports = {sequelize, Employee, Order, Item};