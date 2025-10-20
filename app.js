require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const lootRoutes = require('./routes/lootRoutes');

const app = express();


app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  credentials: false
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.render('loot', { title: 'Fantasy Loot Generator' }); 
});


app.use('/loot', lootRoutes);


app.get('/health', (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState });
});


const buildPath = path.join(__dirname, 'client', 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
 
  app.get(/^\/(?!loot|health).*/, (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}


app.use(notFound);
app.use(errorHandler);


if (require.main === module) {
  const PORT = process.env.PORT || 3001;

  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
      app.listen(PORT, () =>
        console.log('Server listening on http://localhost:' + PORT)
      );
    })
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
}

module.exports = app;
