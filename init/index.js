const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require("../models/listing");

main()
.then(()=> {
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");
};


const initDB = async () => {
    // await Listing.deleteMany({ });
    const existingListings = await Listing.find({});
    initData.data = initData.data.map((obj)=>({...obj , owner:'67c8358fb409d60f77eb51b8'}))
    console.log(initData.data);
    await Listing.insertMany(initData.data);
    console.log("data was initialize");
};

initDB();