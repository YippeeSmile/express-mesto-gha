const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { PORT = 3000 } = process.env;

const errorHandler = (err, req, res, next) => {
  res.status(err.code).send(err.message);
  next();
};

app.use(errorHandler);

app.use((req, _, next) => {
  req.user = {
    _id: '628cbe6de71aa4a03c14ddea',
  };
  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (_, res) => res.status(404).send({ message: 'Cтраница не найдена.' }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
