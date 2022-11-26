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
        const productCollection = client.db('instantCamera').collection('products')

        // get categories from database 
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoryCollection.find(query).toArray();
            res.send(categories)
        });

        // get products from database 
        app.get('/products', async (req, res) => {
            const query = {}
            const products = await productCollection.find(query).toArray();
            res.send(products);
        });

        // get products by categoryid 
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                categoryId: id
            }
            const selectedProducts = await productCollection.find(query).toArray();
            res.send(selectedProducts)
        })
        // send user data to database 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const userEmail = user.email;
            const emailQuery = { email: userEmail }
            const alreadyRegistred = await userCollection.findOne(emailQuery);
            if (alreadyRegistred) {
                return
            }
            const result = await userCollection.insertOne(user);
            console.log(result)
            res.send(result)
        });

        // get user details by email 
        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            res.send(user);
        });
        //post added products data to database
        app.post('/products', async (req, res) => {
            const data = req.body;
            const result = await productCollection.insertOne(data);
            res.send(result);
        })


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