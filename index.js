const express = require('express')
const app = express()

// app.get('/', (req, res) => {
//     console.log('Demo on handling http requests for URL /api/members')
// })

// Body parser because body of request Object was unable to read JSON
app.use(express.json())

// Members API routes
app.use('/api/members', require('./routes/api/membersData'))

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}...`))