import express from 'express';
import helmet from "helmet";
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
import { findLogos } from './get.js';

const app = express();
const port = 3005;

const isDev = process.env.NODE_ENV === 'dev';
const distPath = path.resolve('dist');

app.use(cors({
  origin: 'http://localhost:3005', // Allow only your front-end (same origin)
  methods: ['GET'],        // Allow the necessary HTTP methods
}));

// Configure CSP to allow images from external sources
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],  // Add any other sources as needed
    imgSrc: ["'self'", '*'],  // Allow images from logo.clearbit.com
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],  // Add if you're using HTTPS everywhere
  },
}));

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
    const result = await findLogos(req.query.q);
    return res.send(result);
  }catch(e) {
    console.error(e);
    res.send(500);
  }
});

if(!isDev) {
  app.use((req, res, next) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
