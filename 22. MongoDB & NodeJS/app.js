const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017'
const dbName = 'coba'

const client = new MongoClient(uri,{
    useUnifiedTopology: true
});

client.connect((error, client)=>{
    if (error) {
        return console.log('koneksi gagal');
    }

    // Pilih database
    const db = client.db(dbName)

    // Insert 1 data ke collection
    // db.collection('mhs').insertOne(
    //     {
    //         nama: "Andra",
    //         email: "andra@gmail.com"
    //     },
    //     (error,result)=>{
    //         if (error) {
    //             console.log('gagal menambahkan data');
    //         }
    //         console.log(result);
    //     }
    // )

    // Insert lebih dari data
    // db.collection('mhs').insertMany(
    //     [
    //         {
    //             nama: "Ristiano",
    //             email: "ristiano@gmail.com"
    //         },
    //         {
    //             nama: "adrs",
    //             email: "adrs@gmail.com"
    //         }
    //     ],
    //     (error, result)=>{
    //         if (error) {
    //             console.log('data gagal ditambahkan');
    //         }
    //         console.log(result);
    //     }
    // )

    // Read all data
    // console.log(db.collection('mhs').find().toArray((error, result)=>{
    //     console.log(result);
    // }))

    // Read data berdasarkan kriteria
    // console.log(db.collection('mhs').find({_id: ObjectId('6134432f5a77b017410e2e5b')}).toArray((error, result)=>{
    //     console.log(result);
    // }))

    // Update berdasarkan ID
    // const updatePromise = db.collection('mhs').updateOne(
    //     {
    //         _id: ObjectId('6134432f5a77b017410e2e5b')
    //     },
    //     {
    //         $set:{
    //             email: "aaaa@gmail.com"
    //         }
    //     }
    // )

    // updatePromise
    //     .then(result=>{
    //         console.log(result);
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     })

    // Mengubah banyak data
    // db.collection('mhs').updateMany(
    //     {
    //         nama: 'adrs'
    //     },
    //     {
    //         $set:{
    //             nama: 'Adrrrr'
    //         }
    //     }
    // )

    // Menghapus 1 data
    // db.collection('mhs').deleteOne(
    //     {
    //         _id: ObjectId('6134432f5a77b017410e2e5b')
    //     }
    // )
    // .then(result=>{
    //     console.log(result);
    // })
    // .catch(error => {
    //     console.log(error);
    // })

    // Menghapus lebih dari 1 data
    db.collection('mhs').deleteMany(
        {
            nama: "Ristiano"
        }
    )
    .then(result=>{
        console.log(result);
    })
    .catch(error => {
        console.log(error);
    })
})