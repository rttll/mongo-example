
if ( process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const log = console.log

const url = require('url')
const { MongoClient, ObjectID } = require("mongodb");

let db = null, collection = null, counters;

async function connectToDatabase(uri = process.env.MONGODB_URI) {
  if (db) {
    return db
  }
  
  const client = await MongoClient.connect(uri, { useNewUrlParser: true })
  db = await client.db(url.parse(uri).pathname.substr(1))
}

const setCollection = async () => {
  if ( collection ) {
    return collection
  }
  collection = await db.collection('days')
}

const setCounters = async (name) => {
  if ( counters ) {
    return
  }
  counters = await db.collection('counters')
  if ( await counters.countDocuments() === 0) {
    counters.insertOne({
      _id: name,
      seq: 0
    })
  }
}

const getId = async (name) => {
  await setCounters(name)
  const counter = await counters.findOneAndUpdate(
    { _id: name, },
    { $inc: { seq: 1 } },
    { returnOriginal: true }
  )
  return counter.value.seq
}


const getOneDay = async (id) => {
  const day = await collection.findOne({_id: parseInt(id)})
  const mealsCollection = await db.collection('meals')
  const foo = await mealsCollection.find( { _id: { $in: day.meals.map(id => ObjectID(id)) } })
  day.foo = await foo.toArray()
  return { day }
}

const getDays = async () => {
  const days = await collection.find({}).toArray()
  return { days }
}

module.exports = {
  get: async (req, res) => {
    await connectToDatabase()
    await setCollection()
    const resp = req.query.id ? await getOneDay(req.query.id) : await getDays()
    res.status(200).json( resp )
  },
  post: async (req, res) => {
    await connectToDatabase()
    await setCollection()
    const result = await collection.insertOne({
      _id: await getId('days'),
      date: req.body.date,
      meals: []
    })
    res.status(200).json(result.ops[0])
  },
  patch: async (req, res) => {
    await connectToDatabase()
    await setCollection()
    const result = await collection.updateOne({_id: parseInt(req.body.id)}, { $set: req.body.day })
    res.status(200).json(result)
  },
  delete: async (req, res) => {
    await connectToDatabase()
    await setCollection(db)
    const result = await collection.deleteMany(req.body.docs)
    res.status(200).json(result)
  }
}