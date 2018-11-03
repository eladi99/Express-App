const express = require('express');
const Customer = require('../models/customer');

const router = express.Router();

router.get('/', async (_, res) => {
    const customers = await Customer
        .find()
        .sort('name')
        .select('-__v');
    res.send(customers);
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    let customer;
    try {
        customer = await Customer.findById(id).select('-__v');
    }
    catch(err) {
        res.status(400);
        if (err.kind == 'ObjectId' && err.path == "_id") {
            return res.send(`Customer ID ${id} is invalid.`);
        }
        return res.send(err.message);
    }

    if (!customer) {
        return res.status(404).send(`Customer ID ${id} does not exist.`);
    }

    res.send(customer);
});


router.post('/', async (req, res) => {
    const { name, isGold, phone_num } = req.body;
    const customer = await new Customer(
        { name: name, isGold: isGold, phone_num: phone_num }
    );
    try {
        await customer.save();         
    } 
    catch(err) {
        res.status(400);
        if (err.name == 'MongoError' && err.code == 11000) {
            return res.send(`Phone number ${phone_num} already exists.`);
        }
        
        res.send(err);
    }

    res.send(`Posted ${JSON.stringify(customer)} successfully.`);
});


router.put('/', async (req, res) => {
    const { id } = req.body;
    let customer;
    try {
        customer = await Customer
            .findOneAndUpdate({ _id: id }, req.body, { new: true })
            .select('name phone_num');
    }
    catch(err) {
        if (err.kind == 'ObjectId' && err.path == "_id") {
            return res.status(400).send(`Customer ID ${id} is invalid.`);
        }

        return res.status(404).send(err);
    }
    
    if (!customer) {
        return res.status(404).send(`Customer ID ${req.body.id} does not exist.`);
    }
    
    res.send(`Updated ${JSON.stringify(customer)} successfully.`);
});


router.delete('/', async (req, res) => {
    const { id } = req.body;
    const customer = await Customer
        .findOneAndDelete({ _id: id })
        .select('name phone_num');

    if (!customer) {
        return res.status(404).send(`Customer ID ${id} does not exist.`)
    }
    
    res.send(`Deleted ${JSON.stringify(customer)} successfully.`)
});

module.exports = router;