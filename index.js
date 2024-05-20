const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mqe77mp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const menus = client.db('resturantDB');
    const menuCollcation = menus.collection('allFoods');
    const userOrderCollaction = menus.collection('userOrders');
    app.get('/menu', async (req, res) => {
      const result = await menuCollcation.find().toArray();
      res.send(result);
    });

    app.post('/userOrder', async (req, res) => {
      const user = req.body;
      const result = await userOrderCollaction.insertOne(user);
      res.send(result);
    });

    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const qurey = { email: email };
      const result = await userOrderCollaction.find(qurey).toArray();
      res.send(result);
    });

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await userOrderCollaction.deleteOne(qurey);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('restaurant server site is runing ');
});

app.listen(port, () => {
  console.log(`restaurant server port is :${port}`);
});
