import express from 'express';
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const app = express();
const port = process.env.NODE_ENV === 'test' ? 3001 : process.env.PORT || '8000';

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

const gameRouter = require('./routes/game')
const playerRouter = require('./routes/player')
app.use('/game', gameRouter);
app.use('/player', playerRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
  });
}

app.on('error', (err) => {
  console.log(err)
})

module.exports = app;
