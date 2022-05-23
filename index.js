const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/accessories', async (req, res) => {
            const accessories = await accessoriesCollection.find({}).toArray();
            res.send(accessories);
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