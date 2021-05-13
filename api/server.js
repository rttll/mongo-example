const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();

const PRODUCTION = process.env.NODE_ENV === 'production';

if (!PRODUCTION) require('dotenv').config();

log = console.log;

app.use(express.json());

const ORIGIN = PRODUCTION ? 'https://foo.bar' : '*';
app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }
  next();
});

let client = null,
  collection = null;

async function createClient() {
  try {
    // prettier-ignore
    const uri = process.env.MONGO_URL
      .replace('{PASSWORD}', process.env.MONGO_PASSWORD)
      .replace('{DATABASE}', process.env.MONGO_DATABASE);

    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db(process.env.MONGO_DATABASE);
    collection = db.collection('bots');
  } catch (error) {
    console.error(error);
  }
}

async function getBots() {
  try {
    let bots = await collection.find({});
    return bots;
  } catch (error) {
    console.error(error);
  }
}

async function getBot(id) {
  return await collection.findOne({ _id: parseInt(id) });
}

async function create(data) {
  try {
    return await collection.insertOne({
      _id: (Math.random() * 999999999999).toFixed(0), // should be fine 😅
      name: data.name,
      almostHuman: data.almostHuman,
    });
  } catch (error) {
    return { error };
  }
}

app.get('/bots', async (req, res) => {
  if (client === null) await createClient();
  let allBots = await getBots();
  allBots.toArray().then((bots) => {
    res.json({ bots });
  });
});

app.post('/bots', async (req, res) => {
  if (client === null) await createClient();
  let created = await create(req.body);
  res.json({ bot: created.ops[0] });
});

let port = process.env.PORT;
if (port == null || port == '') {
  port = 9000;
}

app.listen(port, () => {
  console.log(`Listening on port ${port}... [${process.env.NODE_ENV}]`);
});
