const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 31
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone_num: {
        type: String,
        required: true,
        unique: true,
        match: /05[0|2|3|4|5|7]-?\d{7}/,
        get: phone => phone[3] == '-'? phone : `${phone.slice(0, 3)}-${phone.slice(3)}`,
        set: phone => phone[3] == '-'? phone : `${phone.slice(0, 3)}-${phone.slice(3)}`
    }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;