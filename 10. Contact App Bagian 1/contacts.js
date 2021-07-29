const fs = require('fs')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

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

const tulisPertanyaan = (pertanyaan) => {
    return new Promise((resolve, reject) => {
        rl.question(pertanyaan, (jawaban) => {
            resolve(jawaban)
        })
    })
}

const simpanContact = (nama, email, noHP) => {
    const contact = {nama, email, noHP}
    const fileBuffer = fs.readFileSync(dataPath, 'utf-8')
    const contacts = JSON.parse(fileBuffer)

    contacts.push(contact)

    fs.writeFileSync(dataPath, JSON.stringify(contacts))

    console.log('Terimakasih');
    rl.close()
}

module.exports = {tulisPertanyaan, simpanContact}