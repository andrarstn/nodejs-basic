const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/coba',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

// Menambah 1 data
// const contact1 = new Contact({
//     nama: 'Andra',
//     nohp: '08888888',
//     email: 'andra@gmail.com'
// })

// Simpan ke collections
// contact1.save().then((contact)=>console.log(contact))