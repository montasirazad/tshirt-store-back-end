const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.k8hkv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// ADMIN API
async function run() {
    try {
        await client.connect();
        const database = client.db("all-tShirt");
        const tShirtDB = database.collection("tShirt");
        // POST
        app.post('/add-products', async (req, res) => {
            const frontEndData = req.body
            const result = await tShirtDB.insertOne(frontEndData)
            console.log(result);
            res.send(result)
        });

        // GET 
        app.get('/all-products', async (req, res) => {
            const allProducts = tShirtDB.find({});
            const result = await allProducts.toArray();
            res.send(result)
        });

        // DElETE 

        app.delete('/all-products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tShirtDB.deleteOne(query);
            console.log(result);
            res.send(result);

        })

        // Find an Item

        app.get('/all-products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tShirtDB.findOne(query);
            res.send(result);
            // console.log('Getting data of', id);
            // console.log(result);
        });



    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

// CLIENT ORDER 

async function clientOrder() {
    try {
        await client.connect();
        const database = client.db("all-order");
        const orderDB = database.collection("order");
        // Orders Api
        app.post('/add-order', async (req, res) => {
            const frontEndOrder = req.body;
            const result = await orderDB.insertOne(frontEndOrder);
            res.send(result);
            console.log(result);

        });
        // All order Api
        app.get('/add-order', async (req, res) => {
            const allOrders = orderDB.find({});
            const result = await allOrders.toArray();
            res.send(result)
        })

        // get order data api
        app.get('/confirmed-order', async (req, res) => {
            console.log(req.query);
            const allOrders = orderDB.find({ email: req.query.email });
            const result = await allOrders.toArray();
            res.send(result);
            //console.log(result);
        })

    } finally {
        //await client.close();
    }
}
clientOrder().catch(console.dir);


app.get('/', (req, res) => {
    res.send('setup done')
})

app.listen(port, () => {
    console.log('listening to port', port);
})