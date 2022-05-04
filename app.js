const express = require('express');
const mongoose = require('mongoose');

const Things = require ('./Models/Things')
const app = express();

mongoose.connect('mongodb+srv://Sasjojo:...@cluster0.opb4h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  
app.use(express.json());

app.use('/api/sauce', (req, res, next) => {
  const stuff = [
    {
      
    },
    {
     
    },
  ];
  res.status(200).json(stuff);
});

app.post('/api/sauce', (req, res, next) => {
  const Things = ({
    ... req.body
  })
  });

app.use('/api/sauce', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;