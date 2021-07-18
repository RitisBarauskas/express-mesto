const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');

const users = require('./routes/users');
const cards = require('./routes/cards');

const app = express();


app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '60f4321ce6da4a1f44121fbd',
  };

  next();
});
app.use('/users', users);
app.use('/cards', cards);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
