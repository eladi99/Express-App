const express = require('express');
const Customer = require('../models/customer');

const router = express.Router();

router.get('/', async (_, res) => {
    const customers = await Customer.find().sort('name').select('name isGold');
    res.send(customers);
});


router.get('/:id', async (req, res) => {
    const qid = req.params.id;
    
    let customer;
    try {
        customer = await Customer.findById(qid).select('id name');
    }
    catch(err) {
        res.status(400);
        if (err.kind == 'ObjectId') {
            return res.send('Incompatible genre ID');
        }
        return res.send(err.message);
    }

    if (!customer) {
        return res.status(404).send(`Genre ID ${qid} does not exist.`);
    }

    res.send(customer);
});


router.post('/', async (req, res) => {
    const { name, isGold, phone_num } = req.body;
    if (await Customer.find({ phone_num: phone_num }).length > 0) {
        return res.status(400).send(`Customer phone number "${phone_num}" already exists.`);
    }
    
    const customer = await new Customer({ name: name, isGold: isGold, phone_num: phone_num });
    try {
        customer.save();         
    } 
    catch(err) {
        return res.status(400).send(err);
    }

    res.send(`Posted ${JSON.stringify(customer)} successfully.`);
});


router.put('/', async (req, res) => {
    const { id, name, isGold, phone_num } = req.body;
    const customer = await Customer
        .findByIdAndUpdate(id, { 
                name: name,
                isGold: isGold,
                phone_num: phone_num
            },
            { new: true })
        .select('id name');
    
    if (!customer) {
        return res.status(404).send(`Customer ID ${qid} does not exist.`);
    }
    
    res.send(`Updated ${JSON.stringify(customer)} successfully.`);
});


router.delete('/', async (req, res) => {
    const deleted_genre = await Customer.findOneAndRemove({ phone_num: req.body }).select('id name');
    res.send(`Deleted ${JSON.stringify(deleted_genre)} successfully.`)
});

module.exports = router;