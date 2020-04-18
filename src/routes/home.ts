import express from 'express';

export const homeRouter = express.Router();

homeRouter.all('', (req, res) => {
  res.render('index', { title: 'Express' });
});
