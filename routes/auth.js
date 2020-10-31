const express = require('express')
const router  = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')

// router.get('/protected',requireLogin,(req,res)=>{
//     res.send('hellow user')
// })

router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body
    if(!email || !password || !name){
        res.status(400).json({error:'Please add all the fields'})
    }
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
           return res.status(400).json({error:'User Already Exist with that Email'})
        }
        bcrypt.hash(password,8).then((hashPassword)=>{
            const user = new User({
                email:email,
                password:hashPassword,
                name:name
            })
            user.save().then((user)=>{
                res.json({message:'Saved Successfully'})
            }).catch((e)=>{
                console.log('e',e)
            })

        })
        
    }).catch((e)=>{
        console.log('Error',e)
    })
    
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({error:"Please Add email or password"})
    }
    
    User.findOne({email:email}).then((savedUser)=>{
        if(!savedUser){
            return res.status(400).json({error:"Invalid email or password"})
        }

        bcrypt.compare(password,savedUser.password).then((doMatch)=>{
            if(doMatch){
                //res.json({message:'Successfully signed in'})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                res.json({token:token})
            }else{
                return res.status(400).json({error:"Invalid email or password"})
            }
        }).catch((e)=>{
            console.log(e)
        })

    }).catch((e)=>{
        console.log(e)
    })
})


module.exports=router