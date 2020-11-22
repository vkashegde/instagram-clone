const { request } = require('express');
const express = require('express')
const router  = express.Router();
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')



router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body
    if(!title ||!body ||!pic){
        return res.status(200).json({error:"Please add all the fields"})
    }

    //hide password from posts
    req.user.password = undefined

    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then((result)=>{
        res.json({post:result})
    }).catch((e)=>{
        console.log(e)
    })
})

router.get('/allpost',requireLogin,(req,res)=>{
    //populate will be used to populate data from id (second argument will specify what we want to show)
    Post.find().populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic").then((posts)=>{
        res.json({posts:posts})    
    }).catch((e)=>{
        console.log(e)
    })
})

router.get('/getmyfeed',requireLogin,(req,res)=>{
    //populate will be used to populate data from id (second argument will specify what we want to show)
    Post.find({postedBy:{$in:req.user.following}}).populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic").then((posts)=>{
        res.json({posts:posts})    
    }).catch((e)=>{
        console.log(e)
    })
})

router.get('/myposts', requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name pic")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch((e)=>{
        console.log(e)
    })
})

router.put('/like', requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }

    })
})
router.put('/unlike', requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }

    })
})
//for comment
router.put('/comment', requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }

    })
})

//delete route

router.delete('/deletepost/:postId', requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString()===req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json({result})
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})







module.exports = router