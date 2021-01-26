const meals = require('./meals')
const days = require('./days')
const express = require('express')
const app = express();

const production = process.env.NODE_ENV === 'production';
app.use(express.json())

app.use(function(req, res, next) {
  let origin;
  if (production) {
    if ( process.env.ORIGINS.split('_').indexOf(req.headers.origin) > -1 ) {
      origin = req.headers.origin
    }
  } else {
    origin = '*'
  }
  res.header('Content-Type','application/json');
  res.header("Access-Control-Allow-Origin", origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
});

app.get('/', (req, res) => {
  res.status(200).send(`OK [${process.env.NODE_ENV}]`)
})

app.get('/meals', async (req, res) => {
  await meals(req, res)
})

app.get('/days', async (req, res) => {
  await days.get(req, res)
})

app.post('/days', async (req, res) => {
  await days.post(req, res)
})

app.delete('/days', async (req, res) => {
  await days.delete(req, res)
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 9000;
}

app.listen(port, () => {
  console.log(`Listening on port ${port}... [${process.env.NODE_ENV}]`)
})
