const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

const { PORT = 3000 } = process.env;

const errorHandler = (err, req, res, next) => {
  res.status(err.code).send({ message: err.message });
  next();
};

app.use((req, _, next) => {
  req.user = {
    _id: '628cbe6de71aa4a03c14ddea',
  };
  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (_, res) => res.status(404).send({ message: 'Cтраница не найдена.' }));

app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
