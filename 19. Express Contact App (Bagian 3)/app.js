const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require('./utils/contacts')
const { body, validationResult, check } = require('express-validator');
// Flash message
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

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

app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'About'
    })
})

app.get('/contact', (req, res) => {
    const contacts = loadContact()
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Contact',
        contacts,
        msg: req.flash('msg')
    })
})

// Halaman form tambah data kontak
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: 'Tambah Data Contact',
    })
})

// Proses data contact
app.post('/contact', [
    body('nama').custom(value => {
        const duplikat = cekDuplikat(value)
        if (duplikat) {
            throw new Error('Nama sudah digunakan')
        }
        return true
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('nohp', 'Nomor HP tidak valid').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //   return res.status(400).json({ errors: errors.array() });
        res.render('add-contact', {
            layout: 'layouts/main-layout',
            title: 'Tambah Data Contact',
            errors: errors.array()
        })
    } else {
        addContact(req.body)
        // Kirim flash message
        req.flash('msg', 'Data contact berhasil ditambahkan')
        res.redirect('/contact')
    }
})

// Delete contact
app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama)

    // Jika contact tidak ada
    if (!contact) {
        res.status(404)
        res.send('<h1>404</h1>')
    } else {
        deleteContact(req.params.nama)
        // Kirim flash message
        req.flash('msg', 'Data contact berhasil dihapus')
        res.redirect('/contact')
    }
})

// Ubah data contact
app.get('/contact/edit/:nama', (req, res) => {
    const contact = findContact(req.params.nama)
    res.render('edit-contact', {
        layout: 'layouts/main-layout',
        title: 'Form Ubah Data Contact',
        contact
    })
})

// Proses ubah data
app.post('/contact/update', [
    body('nama').custom((value,{req}) => {
        const duplikat = cekDuplikat(value)
        if (value !== req.body.oldNama && duplikat) {
            throw new Error('Nama sudah digunakan')
        }
        return true
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('nohp', 'Nomor HP tidak valid').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //   return res.status(400).json({ errors: errors.array() });
        res.render('edit-contact', {
            layout: 'layouts/main-layout',
            title: 'Form Ubah Contact',
            errors: errors.array(),
            contact: req.body
        })
    } else {
        updateContacts(req.body)
        // Kirim flash message
        req.flash('msg', 'Data contact berhasil diubah')
        res.redirect('/contact')
    }
})

// Halaman detail data kontak
app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama)
    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Detail Contact',
        contact
    })
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404</h1>')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})