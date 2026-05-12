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
// CORS 🛡️
app.use(cors({
  origin: 'https://book-shop-website-frontend.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
}));


// BODY PARSER ⬇️
app.use(express.json());


app.use('/images/', express.static(path.join(__dirname, 'images')))
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;