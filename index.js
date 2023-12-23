const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.orneeg0.mongodb.net/?retryWrites=true&w=majority`;

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

        const addManagement = client.db('taskDB').collection('adds')

        // add
        app.get('/adds', async (req, res) => {
            const result = await addManagement.find().toArray();
            res.send(result)
        })

        // app.get('/adds/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) };
        //     const result = await addManagement.findOne(query);
        //     res.send(result)
        // })

        app.get('/adds', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await addManagement.find(query).toArray();
            res.send(result)
        })


        app.post('/adds', async (req, res) => {
            const item = req.body;
            const result = await addManagement.insertOne(item);
            res.send(result)
        })

        app.patch('/adds/:id', async (req, res) => {
            const item = req.body;
            console.log(item);
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    title: item.taskItem.title,
                    priority: item.taskItem.priority,
                    date: item.taskItem.date,
                    description: item.taskItem.description,
                    status: "onGoing"
                }
            }
            console.log(updateDoc);
            const result = await addManagement.updateOne(filter, updateDoc)
            res.send(result);
        })

        // app.patch('/adds/onGoing/:id', async (req, res) => {
        //     const item = req.body;
        //     console.log(item);
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) }
        //     const updateDoc = {
        //         $set: {
        //             title: item.taskItem.title,
        //             priority: item.taskItem.priority,
        //             date: item.taskItem.date,
        //             description: item.taskItem.description,
        //             status: "onGoing"
        //         }
        //     }
        //     console.log(updateDoc);
        //     const result = await addManagement.updateOne(filter, updateDoc)
        //     res.send(result);
        // })



        app.delete('/adds/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addManagement.deleteOne(query);
            res.send(result);
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



app.get('/', (req, res) => {
    res.send('server in running')
})

app.listen(port, () => {
    console.log(`task management server is running on port ${port}`);
})