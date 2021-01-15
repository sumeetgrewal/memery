import express from 'express';
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const app = express();
const port = process.env.PORT || '8000';

app.use(compression({ filter: shouldCompress }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

function shouldCompress (req: any, res: any) {
  if (req.headers['x-no-compression']) {
    return false
  }
  return compression.filter(req, res)
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

app.listen(port,  () => {
  console.log(`Server is listening on ${port}`);
});

app.on('error', (err) => console.log(err))
