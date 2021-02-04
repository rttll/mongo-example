const { ObjectID } = require("mongodb");
const { connectToDatabase, setCollection, getId} = require('../db_helper')
const log = console.log

let db = null, daysCollection = null;

async function setup() {
  if (db === null) db = await connectToDatabase()
  if (daysCollection === null) daysCollection = await setCollection('days')
}

const getOneDay = async (id) => {
  const day = await daysCollection.findOne({_id: parseInt(id)})
  const mealsCollection = await db.collection('meals')
  const meals = await mealsCollection.find( { _id: { $in: day.mealIds } })
  day.meals = await meals.toArray()
  return { day }
}

const getDays = async () => {
  const days = await daysCollection.find({}).toArray()
  return { days }
}

const methods = {
  get: async (req, res) => {
    const resp = req.query.id ? await getOneDay(req.query.id) : await getDays()
    res.status(200).json( resp )
  },
  post: async (req, res) => {
    let id = await getId('days')
    const result = await daysCollection.insertOne({
      _id: id,
      date: req.body.date,
      mealIds: [],
      mealOrder: [],
    })
    // todo remove second request here
    let resp = await getOneDay(id)
    res.status(200).json( resp )
  },
  patch: async (req, res) => {
    const result = await daysCollection.updateOne({_id: parseInt(req.body.id)}, { $set: req.body.day })
    const day = await getOneDay(req.body.id)
    res.status(200).json(day)
  },
  delete: async (req, res) => {
    const result = await daysCollection.deleteMany(req.body.docs)
    res.status(200).json(result)
  }
}

module.exports = async (req, res) => {
  await setup()
  const method = req.query.method || 'get'
  methods[method](req, res)
}