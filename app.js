// Hello From MiNA SaLib, welcome=>:)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productsRouter = require('./Routes/products.routes');
const usersRouter = require('./Routes/users.routes');
mongoose.connect(process.env.MONGO_CONNECT).then(()=>{
    console.log("mongo server started");
});
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/products',productsRouter);
app.use('/api/users',usersRouter);
app.all('*',productsRouter);

app.listen(process.env.PORT, () => {
    console.log(`app listening on http://localhost:${process.env.PORT}`)
});

