import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { downloadLogo } from './get.js';

const app = express();
const port = 3005;

const isDev = process.env.NODE_ENV === 'dev';

console.log(isDev);

const distPath = path.resolve('dist');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30 // limit each IP to 30 requests per minute
});

app.use(limiter);

app.disable('x-powered-by');

app.use(morgan('combined'));

if(!isDev) {
  // Serve static files from dist folder
  app.use(express.static(distPath));
}

app.get('/api/getLogo', async (req, res) => {
  try {
    const result = await downloadLogo(req.query.q);
    return res.send(result);
  }catch(e) {
    console.error(e);
    res.send(e);
  }
});

if(!isDev) {
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
