const express = require('express');
const mongoose = require('mongoose');
const productRouters = require('./routes.js');

// Constants
const PORT = 8080;

// App
const app = express();

require('dotenv').config()

app.use(express.json());

mongoose.connect(`mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.gnquy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
  .then(() => console.log(`MongoDB Connected...`))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use("/api/products", productRouters)

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});