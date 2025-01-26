const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


// middleware
app.use(cors())
app.use(express.json())



// mongodb 
// 
// 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.56yvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // 
    const myMarathonCollection = client.db('marathonDb').collection('marathon');
    const registerdUserCollection = client.db('marathonRegister').collection('register')


// post addMarathon Data
    app.post('/addMarathon', async(req,res) => {
             const newMarathon = req.body;
             const result = await myMarathonCollection.insertOne(newMarathon);
             res.send(result)
    })

    // get addMarathon data

    app.get('/addMarathon', async(req,res) => {
           const cursor =  myMarathonCollection.find();
           const result = await cursor.toArray();
           res.send(result)
    })

    // get single Marathon data
    app.get('/addMarathon/:id', async(req, res) => {
       const id = req.params.id;
        const query = {_id : new ObjectId(id)}
       const result = await myMarathonCollection.findOne(query);

         res.send(result)
    })

    app.delete('/addMarathon/:id' , async(req,res) => {
       const id = req.params.id;
       const query = {_id : new ObjectId(id)};
       const result = await myMarathonCollection.deleteOne(query);
       res.send(result)
    })




            // Marathon Register form start

    // post Marathon  register form
    app.post('/marathonRegisterForm', async(req , res) => {
        const newRegisterData = req.body;
        const result = await  registerdUserCollection.insertOne(newRegisterData);
        res.send(result) 
    }) 

    app.get('/marathonRegisterForm', async(req,res) => {
      const cursor = registerdUserCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/marathonRegisterForm/:id' , async(req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await registerdUserCollection.findOne(query);
      res.send(result)
    })

    // delete regigterd User data
    app.delete('/marathonRegisterForm/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await registerdUserCollection.deleteOne(query);
        res.send(result)
    })

  // update regigterd User data

  app.patch('/marathonRegisterForm/:id' , async(req,res) => {
        const id = req.params.id;
        const body = req.body;
        const query = {_id : new ObjectId(id)};

        const update = {
           $set : {
            firstName : body.firstName,
            lastName : body.lastName,
            contactNumber : body.contactNumber,
            additionlInfo : body.additionlInfo
           }
        }
        const result = await registerdUserCollection.updateOne(query,update);
        res.send(result)
  })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req,res) =>  {
    res.send('marathon web server is running')
})

app.listen(port ,() => {
    console.log('marathon server is running port', port);
    
})