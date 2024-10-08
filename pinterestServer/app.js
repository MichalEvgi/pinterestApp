import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import pinsRouter from './routes/pins.js';
import boardsRouter from './routes/boards.js';

import cors from 'cors'; // Add this line to enable CORS

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: 'http://localhost:5174' // Replace with your client-side URL
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/pins', pinsRouter);
app.use('/api/boards', boardsRouter);
app.use('/uploads', express.static('uploads'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({ message: 'Not Found' });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

export default app;