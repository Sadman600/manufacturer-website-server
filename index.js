const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.jtzcp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const accessoriesCollection = client.db("accessories_manufacturer").collection("accessories");
        const orderCollection = client.db("accessories_manufacturer").collection("orders");
        const userCollection = client.db("accessories_manufacturer").collection("users");

        // create an API for get all accessories data
        app.get('/accessories', async (req, res) => {
            const accessories = await accessoriesCollection.find().toArray();
            res.send(accessories);
        });
        // create an API for get single accessories data
        app.get('/accessories/:id', async (req, res) => {
            const id = req.params.id;
            const result = await accessoriesCollection.findOne({ _id: ObjectId(id) });
            res.send(result);
        });
        // create an API to update accessories data
        app.put('/accessories/:id', async (req, res) => {
            const id = req.params.id;
            const accessories = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: accessories.name,
                    description: accessories.description,
                    minimumOrder: accessories.minimumOrder,
                    availableQuantity: accessories.availableQuantity,
                    price: accessories.price,
                    img: accessories.img
                },
            };
            const result = await accessoriesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });
        // create an API for get login user order data
        app.get('/order/:email', async (req, res) => {
            const email = req.params.email;
            const result = await orderCollection.find({ email: email }).toArray();
            res.send(result)
        });
        // create an API to insert order
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.USER_SECRET_TOKEN, { expiresIn: '1d' });
            res.send({ result, token });
        });

    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello accessories manufacturer server');
})

app.listen(port, () => {
    console.log(`Accessories manufacturer listening on port ${port}`);
})