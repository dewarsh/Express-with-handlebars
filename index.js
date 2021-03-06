const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const members = require('./members')

// app.get('/', (req, res) => {
//     console.log('Demo on handling http requests for URL /api/members')
// })

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Homepage Route
app.get('/', (req, res) => res.render('index', {
    title: 'Member App',
    members
}))

// Body parser because body of request Object was unable to read JSON
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

// Members API routes
app.use('/api/members', require('./routes/api/membersData'))

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}...`))