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

if (process.env.NODE_ENV == 'production') {
  app.listen(PORT, () => {
    console.log(`production Running on port ${PORT}`);
  });
}
else if (process.env.NODE_ENV == 'development') {
  console.log(`development!`);
}
else if (process.env.NODE_ENV == 'test') {
  console.log('test!');
}

app.use((error, req, res, next) => {
  return res.status(500).json({ message: error.message })
})

module.exports = app;