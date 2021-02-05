const jetpack = require('fs-jetpack')
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

const getAction = (req) => {
  const tree = jetpack.inspectTree(`${jetpack.cwd()}/api`).children
  try {
    const actionName = req.url
      .replace(/\/api\//, '')
      .match(/^\w+/)[0]
    
    let results = tree.filter(obj => obj.name.replace('.js', '') === actionName )
    if ( results.length === 0 ) return null
    
    let path = './' + results[0].name
    if ( results[0].type === 'dir') {
      path += '/' + results[0].children[0].name
    }
    return require(path)
  } catch (error) {
    log(error)
    return null
  }
}


app.all('*', async (req, res) => {
  let url = req.url.replace(/\/api/, '')
  if (url === '/') {
    res.status(200).send(`OK [${process.env.NODE_ENV}]`)
  }
  
  // Get the serverless endpoint for this url
  const action = getAction(req)
  if (action) {
    req.query.method = url.split('/').pop().split('?')[0]
    await action(req, res)
  } else {
    res.status(404).json({})
  }

})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 9000;
}

app.listen(port, () => {
  console.log(`Listening on port ${port}... [${process.env.NODE_ENV}]`)
})
