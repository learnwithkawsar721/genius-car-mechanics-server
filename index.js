const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleqare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.858ok.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("geniusCarMechanics");
    const servicesCollection = database.collection("services");
    // get Services
    app.get("/services", async (req, res) => {
      const getServices = servicesCollection.find({});
      const services = await getServices.toArray();
      res.send(services);
    });
    //get Single Services
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });
    //Post API
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      console.log("Inserted SuccessFully");
      res.json(result);
    });
    console.log("connect To DAtaBase");
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Running Genius Server");
});
app.listen(port, () => {
  console.log("Genius Car Server");
});
