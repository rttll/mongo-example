const { ObjectID } = require("mongodb");
const { connectToDatabase, setCollection, getId} = require('./db_helper')
const log = console.log

let db = null, collection = null;

async function setup() {
  db = await connectToDatabase()
  collection = await setCollection('days')
}

const getOneDay = async (id) => {
  const day = await collection.findOne({_id: parseInt(id)})
  const mealsCollection = await db.collection('meals')
  const foo = await mealsCollection.find( { _id: { $in: day.meals } })
  day.foo = await foo.toArray()
  return { day }
}

const getDays = async () => {
  const days = await collection.find({}).toArray()
  return { days }
}

module.exports = {
  get: async (req, res) => {
    await setup()
    const resp = req.query.id ? await getOneDay(req.query.id) : await getDays()
    res.status(200).json( resp )
  },
  post: async (req, res) => {
    await setup()
    const result = await collection.insertOne({
      _id: await getId('days'),
      date: req.body.date,
      meals: []
    })
    res.status(200).json(result.ops[0])
  },
  patch: async (req, res) => {
    await setup()
    const result = await collection.updateOne({_id: parseInt(req.body.id)}, { $set: req.body.day })
    const day = await getOneDay(req.body.id)
    res.status(200).json(day)
  },
  delete: async (req, res) => {
    await setup()
    const result = await collection.deleteMany(req.body.docs)
    res.status(200).json(result)
  }
}