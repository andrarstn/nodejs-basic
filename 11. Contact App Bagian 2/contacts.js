const fs = require('fs')
const chalk = require('chalk')
const validator = require('validator')

// Membuat folder data
const dirPath = './data'
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

// Membuat file contact.json
const dataPath = './data/contacts.json'
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

const simpanContact = (nama, email, noHP) => {
    const contact = {nama, email, noHP}
    const fileBuffer = fs.readFileSync(dataPath, 'utf-8')
    const contacts = JSON.parse(fileBuffer)

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

module.exports = {simpanContact}