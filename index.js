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

// NOTE: supertest 로 인해 이미 서버가 돌아가는데, 원래 코드로 인해 다시 한번 서버가 켜지려 하니 에러가 난다.
// app.listen(PORT, () => {
//   console.log(`Running on port ${PORT}`);
// });

// app.listen(PORT);
// console.log(`Running on port ${PORT}`);

module.exports = app;