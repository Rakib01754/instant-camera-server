const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // databse collections 
        const categoryCollection = client.db('instantCamera').collection('categories')
        const userCollection = client.db('instantCamera').collection('users')
        const productCollection = client.db('instantCamera').collection('products')
        const bookingCollection = client.db('instantCamera').collection('bookings')

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
        //get advertised product by query
        app.get('/advertised', async (req, res) => {
            const query = { advertise: 'true' }
            const data = await productCollection.find(query).toArray();
            res.send(data)
        });

        //get advertised details product by id
        app.get('/advertisement/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result)
        })
        //get reported product by query
        app.get('/reported', async (req, res) => {
            const query = { reported: 'true' }
            const data = await productCollection.find(query).toArray();
            res.send(data)
        });

        // get products by categoryid 
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                categoryId: id
            }
            const selectedProducts = await productCollection.find(query).toArray();
            res.send(selectedProducts)
        });
        // get products data by email query 
        app.get('/myproducts', async (req, res) => {
            const queryEmail = req.query.email;
            const query = { email: queryEmail };
            const filtereProduct = await productCollection.find(query).toArray();
            res.send(filtereProduct)
        })

        // get user details by email 
        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            res.send(user);
        });

        // get all sellers from database 
        app.get('/allsellers', async (req, res) => {
            const query = { userType: 'Seller' }
            const sellers = await userCollection.find(query).toArray();
            res.send(sellers)
        })

        //get all buyers from database 
        app.get('/allbuyers', async (req, res) => {
            const query = { userType: 'Buyer' }
            const buyers = await userCollection.find(query).toArray();
            res.send(buyers)
        });

        // verify admin 
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.userType === 'Admin' })
        });
        //verify seller
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            res.send({ isSeller: user?.userType === 'Seller' })
        });
        // verify buyer 
        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            res.send({ isBuyer: user?.userType === 'Buyer' })
        });

        //send added products data to database
        app.post('/products', async (req, res) => {
            const data = req.body;
            const result = await productCollection.insertOne(data);
            res.send(result);
        });
        // send bookings data to database 
        app.post('/bookings', async (req, res) => {
            const data = req.body;
            const result = await bookingCollection.insertOne(data);
            res.send(result);
        });
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
        // delete product by id 
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query);
            res.send(result)
        });
        // delete buyer by id
        app.delete('/buyer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        });
        // delete seller by id
        app.delete('/seller/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        });
        // delete reported product 
        app.delete('/products/reported/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        });


        // verify seller by
        app.put('/seller/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    verified: `true`
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc, options)
            console.log(result)
            res.send(result)
        })


        // advertise product by id 
        app.put('/advertise/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    advertise: `true`
                }
            };
            const result = await productCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        });

        // report  product by id 
        app.put('/product/report/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    reported: `true`
                }
            };
            const result = await productCollection.updateOne(filter, updateDoc, options)
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