const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.port || 5000;
require('dotenv').config()


// middlewares
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n58ahyf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// database connectivity function 

async function run() {
    try {
        const categoryCollection = client.db('instantCamera').collection('categories')
        const userCollection = client.db('instantCamera').collection('users')

        // get categories from database 
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoryCollection.find(query).toArray();
            res.send(categories)
        });
        // send user data to database 

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result)
            res.send(result)
        });


    }
    finally {
        // await client.close();
    }
}
run().catch(error => console.error(error));






app.get('/', (req, res) => {
    res.send('Camera server running')
})
app.listen(port, () => {
    console.log(`camera server running on port ${port}`)
})