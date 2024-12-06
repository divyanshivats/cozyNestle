const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
})

userSchema.plugin(passportLocalMongoose); // this plug-in is used for storing passwords and username

module.exports = mongoose.model('User', userSchema)

// passport-local-mongoose will automatically define the password for the app
// we do not need to define it explicityly in the schema
