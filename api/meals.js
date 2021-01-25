const { MongoClient } = require("mongodb");
 
let user = 'mongo0', pass = 'u3N4wvwP9NXy3j8f', dbName = 'meals'
const url = `mongodb+srv://${user}:${pass}@cluster0.ikg5o.mongodb.net/${dbName}?retryWrites=true&w=majority&useUnifiedTopology=true`;
const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    const db = client.db('mongo0')
    const meals = db.collection('meals')
    let attrs = {
      text: "new meal"
    }
    // let newMeal = await meals.insertOne(attrs)
    const items = await meals.find({}).toArray();
    return items

  } catch (err) {
    console.error(err)
  }
  finally {
    // await client.close();
  }
}


module.exports = async (req, res) => {
  let resp = await run()
  return {meals: resp}
}