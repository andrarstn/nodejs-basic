const express = require('express')
const expressLayouts = require('express-ejs-layouts')
// Flash message
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('./utils/db')
const Contact = require('./model/contact')

const app = express()
const port = 3000

// gunakan EJS
app.set('view engine', 'ejs')

// Third-Party Middleware
app.use(expressLayouts);

// Built-in middleware
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))

// Konfigurasi flash
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

// Home
app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama: 'Andra',
            email: 'andra@gmail.com'
        },
        {
            nama: 'Ristiano',
            email: 'ristiano@gmail.com'
        },
    ]

    res.render('index', {
        layout: 'layouts/main-layout',
        nama: 'Andra',
        title: 'Home',
        mahasiswa
    })
})

// About
app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'About'
    })
})

// Contact
app.get('/contact', async (req, res) => {
    // Contact.find().then(contact => {
    //     res.send(contact)
    // })

    const contacts = await Contact.find()
    
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Contact',
        contacts,
        msg: req.flash('msg')
    })
})

// Halaman detail data kontak
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({
        nama: req.params.nama
    })
    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Detail Contact',
        contact
    })
})

app.listen(port, () => {
    console.log(`Mongo Contact App | listening at http://localhost:${port} `);
})