require('dotenv').config({path:'./config/.env'})
const express = require("express")
const bodyParser = require('body-parser');
const connectDB = require('./config/mongodb');
const morgan = require('morgan');
const app = express()


var port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB()

const loginroute = require("./App/router/login.route")
app.use('/api', loginroute)

const shoproute = require("./App/router/shop.route")
app.use('/api', shoproute)

const architec = require("./App/router/architec.route")
app.use('/api', architec)

const carpenter = require("./App/router/carpenter.route")
app.use('/api', carpenter)

app.listen(port,()=>{
    console.log(`Server is running to port ${port}`);
})