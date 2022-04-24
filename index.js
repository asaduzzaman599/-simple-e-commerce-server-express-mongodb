require('dotenv').config()
const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const port = process.env.PORT || 4000

//middleware
app.use(cors())
app.use(express.json())

//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.waslu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async () => {
    try {
        await client.connect()
        const connectionDB = client.db('emajohn').collection('product')

        app.get('/product', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size)
            const query = {}
            const result = await connectionDB.find(query).skip(page * size).limit(size).toArray();
            res.send(result)
        })

        app.get('/productcount', async (req, res) => {
            const count = await connectionDB.countDocuments()
            res.send({ count })
        })
    }
    finally { }


}

run().catch(console.dir)


/* client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log("DB Connected")
    client.close();
});
 */

app.get('/', (req, res) => {
    res.send(`Server Running Port : ${port}`)
})

app.listen(port, () => {
    console.log(`Server Running Port : ${port}`)
})
