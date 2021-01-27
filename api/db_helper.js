if ( process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = require('url')
const { MongoClient, ObjectID } = require("mongodb");

const log = console.log

let db = null, collection = {}, counters = {};

async function connectToDatabase(uri = process.env.MONGODB_URI) {
  if (db) return db
  
  const client = await MongoClient.connect(uri, { useNewUrlParser: true })
  db = await client.db(url.parse(uri).pathname.substr(1))
  return db
}

async function setCollection(name) {
  if ( collection[name] ) return collection[name]

  collection[name] = await db.collection(name)
  return collection[name]
}

async function _setCounters(name) {
  if ( counters[name] ) return
  counters[name] = await db.collection('counters')
  if ( await counters[name].countDocuments() === 0) {
    counters[name].insertOne({
      _id: name,
      seq: 0
    })
  }
}

async function getId(name) {
  await _setCounters(name)
  const counter = await counters[name].findOneAndUpdate(
    { _id: name, },
    { $inc: { seq: 1 } },
    { returnOriginal: true }
  )
  return counter.value.seq
}

module.exports = { connectToDatabase, setCollection, getId}