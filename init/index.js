const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require('../models/listing.js');

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>console.log('MongoDB Connected')).catch(err=>console.log(err)); //connect to the database

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6774e1691e707138046f85b3",}));
    await Listing.insertMany(initData.data);
    console.log("Data Initialized");
};
initDB(); //initialize the database