const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')

const {body, validationResult, check} = require('express-validator')

// Flash message
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('./utils/db')
const Contact = require('./model/contact')

const app = express()
const port = 3000

// Setup method override
app.use(methodOverride('_method'))

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

// Halaman form tambah data kontak
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: 'Tambah Data Contact',
    })
})

// Proses tambah data contact
app.post('/contact', [
    body('nama').custom(async value => {
        const duplikat = await Contact.findOne({nama:value})
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
        Contact.insertMany(req.body, (error,result)=>{
            // Kirim flash message
            req.flash('msg', 'Data contact berhasil ditambahkan')
            res.redirect('/contact')
        })
    }
})

// Delete contact
// app.get('/contact/delete/:nama', async (req, res) => {
//     const contact = await Contact.findOne({nama: req.params.nama})

//     // Jika contact tidak ada
//     if (!contact) {
//         res.status(404)
//         res.send('<h1>404</h1>')
//     } else {
//         Contact.deleteOne({_id: contact._id}).then(result => {
//             // Kirim flash message
//             req.flash('msg', 'Data contact berhasil dihapus')
//             res.redirect('/contact')
//         })
//     }
// })
app.delete('/contact', (req,res)=>{
    Contact.deleteOne({nama: req.body.nama}).then(result => {
        // Kirim flash message
        req.flash('msg', 'Data contact berhasil dihapus')
        res.redirect('/contact')
    })
})

// Ubah data contact
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({nama: req.params.nama})
    res.render('edit-contact', {
        layout: 'layouts/main-layout',
        title: 'Form Ubah Data Contact',
        contact
    })
})

// Proses ubah data
app.put('/contact', [
    body('nama').custom(async(value,{req}) => {
        const duplikat = await Contact.findOne({nama:value})
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
        Contact.updateOne({_id: req.body._id},{
            $set:{
                nama: req.body.nama,
                email: req.body.email,
                nohp: req.body.nohp,
            }
        }).then((result)=>{
            // Kirim flash message
            req.flash('msg', 'Data contact berhasil diubah')
            res.redirect('/contact')
        })
    }
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