import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';

import dotenv from 'dotenv';
import { AppDataSource } from './config/db';
import path from 'path';
import "reflect-metadata";
import { authenticateJWT } from './utils/authentication';
import controllers from './controllers';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3024;

// Middleware
app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

const publicRoutes = ['/signup', '/login'];

app.use((req, res, next) => {

  if (publicRoutes.includes(req.path)) {
    return next();
  }

  authenticateJWT(req, res, next);
});


app.use('/signup', controllers.signup);
app.use('/login', controllers.login);
app.use('/books', controllers.books);
app.use('/reviews', controllers.reviews);
app.use('/search', controllers.search);


// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully!');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}/`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process if the database connection fails
  });