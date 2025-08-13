const mongoose = require('mongoose');
const { mobileNo } = require('../middlware/validation');
const Schema = mongoose.Schema;
const loginschema = Schema({
    login_id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'marketing'],
        default: 'admin'
    },
    mobileNo: {
        type: Number,
        required: false

    }
});

const Login = mongoose.model('Login', loginschema)

module.exports = Login;