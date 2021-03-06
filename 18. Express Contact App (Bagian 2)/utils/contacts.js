const fs = require('fs')
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

const findContact = nama => {
    const contacts = loadContact()

    const contact = contacts.find((c) => c.nama.toLowerCase() === nama.toLowerCase())
    
    return contact
}

const saveContacts = contacts => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}

const addContact = contact => {
    const contacts = loadContact()
    contacts.push(contact)
    saveContacts(contacts)
}

// Cek nama duplikat
const cekDuplikat = (nama) => {
    const contacts = loadContact()
    return contacts.find(contact => contact.nama === nama)
}

module.exports = {loadContact, findContact, addContact, cekDuplikat}