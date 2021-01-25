const db = require('./db')

async function get() {
  try {
    return db().then( (db) => {
      const collection = db.collection('meals')
      return collection.find({}).toArray();
    })
  } catch (err) {
    console.error(err)
  }
  finally {
    // await client.close();
  }
}


module.exports = async (req, res) => {
  let resp = await get()
  return {meals: resp}
}