require('dotenv').config({path:'./config/.env'})
const express = require("express")
const bodyParser = require('body-parser');
const connectDB = require('./config/mongodb');
const morgan = require('morgan');
const app = express()
const loginroute=require('./App/router/timberland.route')
const shoproute = require('./App/router/timberland.route')
const architectureRoute = require('./App/router/timberland.route')
const carpenterRoute= require('./App/router/timberland.route')
const userroute = require('./App/router/timberland.route')

var port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB()

app.use('/api', loginroute)
app.use('/api', shoproute)
app.use('/api', architectureRoute)
app.use('/api', carpenterRoute)
app.use('/api', userroute)

app.listen(port,()=>{
    console.log(`Server is running to port ${port}`);
})