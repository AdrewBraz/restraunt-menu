#! /usr/bin/env node

import getApp from '../index.js';

const port = process.env.PORT || 4000;
const app = getApp();
app.listen(port, '127.0.0.1', () => {
  console.log(`Server has been started on ${port}`);
});
