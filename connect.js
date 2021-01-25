const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
let user = 'mongo0', pass = 'u3N4wvwP9NXy3j8f'
const url = `mongodb+srv://${user}:${pass}@cluster0.ikg5o.mongodb.net/<dbname>?retryWrites=true&w=majority&useUnifiedTopology=true`;
const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");

    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}

run().catch(console.dir);