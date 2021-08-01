const fs = require('fs')
const chalk = require('chalk')
const validator = require('validator')

// Membuat folder data
const dirPath = './data'
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

const loadContact = () => {
    const fileBuffer = fs.readFileSync(dataPath, 'utf-8')
    const contacts = JSON.parse(fileBuffer)
    return contacts
}

// Membuat file contact.json
const dataPath = './data/contacts.json'
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

const simpanContact = (nama, email, noHP) => {
    const contact = {nama, email, noHP}
    const contacts = loadContact()

    // Cek nama duplikat
    const duplikat = contacts.find((contact)=>contact.nama === nama)
    if (duplikat) {
        console.log(chalk.red.inverse.bold(' Contact sudah terdaftar, gunakan nama lain! '));
        return false;
    }
    
    // Cek email
    if (email) {
        if (!validator.isEmail(email)) {
            console.log(chalk.red.inverse.bold(' Email tidak valid! '));
            return false;
        }
    }
    
    // Cek nomor HP
    if (!validator.isMobilePhone(noHP, 'id-ID')) {
        console.log(chalk.red.inverse.bold(' Nomor HP tidak valid! '));
        return false;
    }

    contacts.push(contact)

    fs.writeFileSync(dataPath, JSON.stringify(contacts))

    console.log(chalk.greenBright.inverse.bold(' Terimakasih '));
}

const listContact = () => {
    const contacts = loadContact()
    console.log(chalk.cyanBright.inverse.bold(' Daftar Kontak: '));
    contacts.forEach((contact, i) => {
        console.log(`${i+1}. ${contact.nama} - ${contact.noHP}`);
    });
}

const detailContact = nama => {
    const contacts = loadContact()

    const contact = contacts.find((c) => c.nama.toLowerCase() === nama.toLowerCase())
    if (!contact) {
        console.log(chalk.red.inverse.bold(` ${nama} tidak ditemukan! `));
        return false;
    }
    console.log(chalk.cyan.inverse.bold(` ${contact.nama} `));
    console.log(` ${contact.noHP} `);
    if (contact.email) {
        console.log(` ${contact.email} `);
    }
}

const deleteContact = nama => {
    const contacts = loadContact()
    const newContacts = contacts.filter((c) => c.nama.toLowerCase() !== nama.toLowerCase())

    if (contacts.length === newContacts.length) {
        console.log(chalk.red.inverse.bold(` ${nama} tidak ditemukan! `));
        return false;
    }
    fs.writeFileSync(dataPath, JSON.stringify(newContacts))
    console.log(chalk.greenBright.inverse.bold(` ${nama} berhasil dihapus! `));
}

module.exports = {simpanContact, listContact, detailContact, deleteContact}