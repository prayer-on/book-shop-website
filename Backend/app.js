const express = require('express');
const mongoose = require('mongoose');

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();
const cors = require('cors');

// DATABASE CONNECTION ⬇️
mongoose.connect(process.env.MONGO_URI)
.then(() => {
console.log('Successfully connected to MongoDB Atlas!')
})
.catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.log(error);
});

// CORS ⬇️
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(cors())



// BODY PARSER ⬇️
app.use(express.json());


app.use('/images/', express.static(path.join(__dirname, 'images')))
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;