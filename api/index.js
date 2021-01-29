const meals = require('./meals/[method]')
const days = require('./days/[method]')
const express = require('express')
const app = express();

log = console.log; 

app.use(express.json())

app.use(function(req, res, next) {
  res.header('Content-Type','application/json');
  res.header("Access-Control-Allow-Origin", '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }
  next();
});

const actions = {
  meals: meals,
  days: days
}

app.all('*', async (req, res) => {
  let url = req.url.replace(/\/api/, '')
  // log('index.js', url)
  
  if (url === '/') {
    res.status(200).send(`OK [${process.env.NODE_ENV}]`)
  }
  
  const action = actions[url.split('/')[1]]
  // log('index.js action', action)
  if (action) {
    req.query.method = url.split('/').pop().split('?')[0]
    // log('method', req.query.method)
    await action(req, res)
  } else {
    res.status(404)
  }

})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 9000;
}

app.listen(port, () => {
  console.log(`Listening on port ${port}... [${process.env.NODE_ENV}]`)
})
