const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/myrtpq/image/upload/v1606035756/blank_dfyjsx.jpg"
    },

    followers:[
        {
            type:ObjectId,
            ref:"user"
        }
    ],
    following:[
        {
            type:ObjectId,
            ref:"user"
        }
    ]
})

mongoose.model("User",userSchema)