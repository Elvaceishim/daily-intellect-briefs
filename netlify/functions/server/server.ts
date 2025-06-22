import dotenv from 'dotenv';
import express from 'express';
import newsRouter from './routes/news';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api/news', newsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
