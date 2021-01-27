const { ObjectID } = require("mongodb");
const { connectToDatabase, setCollection, getId} = require('./db_helper')
const log = console.log

let db = null, collection = null;

async function setup() {
  db = await connectToDatabase()
  collection = await setCollection('meals')
}

const getOneMeal = async (id) => {
  const meal = await collection.findOne({_id: parseInt(id)})
  return { meal }
}

const getMeals = async () => {
  const meals = await collection.find({}).toArray()
  return { meals }
}

module.exports = {
  get: async (req, res) => {
    await setup()
    const resp = req.query.id ? await getOneMeal(req.query.id) : await getMeals()
    res.status(200).json( resp )
  },
  post: async (req, res) => {
    await setup()
    const result = await collection.insertOne({
      _id: await getId('meals'),
      name: req.body.name,
    })
    res.status(200).json(result.ops[0])
  },
  patch: async (req, res) => {
    await setup()
    const result = await collection.updateOne({_id: parseInt(req.body.id)}, { $set: req.body.meal })
    res.status(200).json(result)
  },
  delete: async (req, res) => {
    await setup()
    const result = await collection.deleteMany(req.body.docs)
    res.status(200).json(result)
  }
}