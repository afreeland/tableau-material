const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))
app.use(express.static('public'))
app.listen(4100, () => console.log('Tableau Exentions app listening on port 4100!'))