const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js"); // Adjusted path

const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';

// connecting database to website
main()
    .then(() => {
        console.log("connected to DB");
        initDB(); // Call initDB after connection is successful
    })
    .catch((err) => {
        console.log("Connection Error:", err.message);
    });

async function main() {
    await mongoose.connect(mongo_url);
}

const initDB = async () => {
    try {
        await listing.deleteMany({});
        initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "652d0081ae547c5d37e56b5f" }));
        await listing.insertMany(initdata.data);
        console.log("data was initialized");
    } catch (error) {
        console.log("Data Initialization Error:", error.message);
    }
};
initDB();
