#!/usr/bin/env node
import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 5001;
const mount = '/threat-modeling-card-game';
const distPath = path.resolve(process.cwd(), 'dist');

app.use(mount, express.static(distPath));

// Serve index for the base path
app.get(mount + '/', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Serving dist at http://localhost:${port}${mount}/`);
});
