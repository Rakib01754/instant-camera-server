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
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });






app.get('/', (req, res) => {
    res.send('Camera server running')
})
app.listen(port, () => {
    console.log(`camera server running on port ${port}`)
})