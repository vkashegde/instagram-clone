const express = require('express')
const router  = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model('User')

router.get('/',(req,res)=>{
    res.send('Hellows')
})

router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body
    if(!email || !password || !name){
        res.status(400).json({error:'Please add all the fields'})
    }
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
           return res.status(400).json({error:'User Already Exist with that Email'})
        }
        const user = new User({
            email:email,
            password:password,
            name:name
        })
        user.save().then((user)=>{
            res.json({message:'Saved Successfully'})
        }).catch((e)=>{
            console.log('e',e)
        })
    }).catch((e)=>{
        console.log('Error',e)
    })
    
})

module.exports=router