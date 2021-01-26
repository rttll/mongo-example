
if ( process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const log = console.log

const url = require('url')
const { MongoClient } = require("mongodb");

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

const getDays = async (req) => {
  await connectToDatabase()
  await setCollection()
  const params = req.query.id ? {id: req.query.id} : {}
  const days = await collection.find(params).toArray()
  return { days }
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

module.exports = {
  get: async (req, res) => {
    res.status(200).json( await getDays(req) )
  },
  post: async (req, res) => {
    await connectToDatabase()
    await setCollection()
    const result = await collection.insertOne({
      _id: await getId('days'),
      date: req.body.date,
    })
    res.status(200).json(result.ops[0])
  },
  delete: async (req, res) => {
    await connectToDatabase()
    await setCollection(db)
    const result = await collection.deleteMany(req.body.docs)
    res.status(200).json(result)
  }
}