require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { PORT = 3000, SENRTY_DSN } = process.env;
const { notFoundHandler, errorHandler } = require('./middlewares/index.middlewares');

Sentry.init({
  dsn: SENRTY_DSN,
  integrations: [new Sentry.Integrations.Http({ tracing: true }), new Sentry.Integrations.Express({ app })],
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// router index
app.get('/', (req, res) => {
  return res.status(200).json({ status: true, message: 'Welcome to techacademy app', err: null, data: null });
});
app.use('/api/v1', require('./routes/index.routes'));

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// server error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => console.log('Running on port', PORT));
