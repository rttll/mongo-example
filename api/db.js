const { MongoClient } = require("mongodb");
 
let user = 'mongo0', pass = 'u3N4wvwP9NXy3j8f', dbName = 'meals'
const url = `mongodb+srv://${user}:${pass}@cluster0.ikg5o.mongodb.net/${dbName}?retryWrites=true&w=majority&useUnifiedTopology=true`;
const client = new MongoClient(url);

const db = client.connect().then((a, b) => {
  return client.db('mongo0')
})

export default { db }
// module.exports = async (req, res) => {
//   let resp = await run()
//   return {meals: resp}
// }