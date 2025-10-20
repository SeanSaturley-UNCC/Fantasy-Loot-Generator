require('dotenv').config();  // <-- add this at the very top
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB connection error:", err));


const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const lootRoutes = require('./routes/lootRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',   
    methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
    credentials: false
}));


app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("some_secret_cookie"));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

//! --------------------------- Routes ---------------------------
app.use('/loot', lootRoutes);
app.use('/users', userRoutes);

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get(/^\/(?!loot).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log('Server listening on http://localhost:' + PORT));
}

module.exports = app;
