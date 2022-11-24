const express = require('express')
const app = express();
const cors = require('cors')
const port = process.env.port || 5000;


// middlewares
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Camera server running')
})
app.listen(port, () => {
    console.log(`camera server running on port ${port}`)
})