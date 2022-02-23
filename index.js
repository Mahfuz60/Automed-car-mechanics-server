const express = require("express");
const Port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
//middleware
app.use(cors());
app.use(express.json());
//MongoDB Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hegct.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const database = client.db("auto-MedCar-Mechanics");
    const servicesCollection = database.collection("services");

    

    //GET API(ALL Service)
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
      // console.log(services);
    });

    //GET API (Single Service)
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    //POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      // console.log(service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // //DELETE API Service
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
      console.log("Deleted service", result);
    });
    //UPDATE API Services
    app.put("/services/:id", async (req, res) => {
      const id = req.params.id;
      const updateService = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateService.name,
          description: updateService.description,
          price: updateService.price,
          img: updateService.img,
        },
      };

      const result = await servicesCollection.updateOne(filter, updateDoc, options);
      res.json(result);
      console.log("update service", result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//GET API
app.get("/", (req, res) => {
  res.send("Hello,Today is Boring day");
});

app.listen(Port, () => {
  console.log(`listening on this port:${Port}`);
});
