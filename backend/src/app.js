const express=require('express')
const todoSchema=require('./models/todo.models')
const cors=require('cors')

const app=express()
app.use(cors())
app.use(express.json())

app.post('/todo-create', async (req,res)=>{
    try{
        let title= req.body.title;
        let description=req.body.description
        if(!title || !description){
            res.status(400).json({
                message:'title and description is require'
            })
        }
      let post=  await todoSchema.create({
            title:title,
            description:description
        })
        res.status(201).json({
            message:'Successful create data',
            post
        })
    }
    catch(e){
     res.status(500).json({
        message:'Error in create',
        Error:e.message
     })
    }
})

app.get('/todo-read', async (req,res)=>{
    try{
        let post =await todoSchema.find()
        res.status(200).json({
            message:'Success read Data',
            post
        })
    }
    catch(e){
        res.status(500).json({
            message:'Error in read data',
            Error:e.message
        })
    }
})

app.delete('/todo-delete/:id', async (req,res)=>{
    try{
        let id=req.params.id
        let post = await todoSchema.findOneAndDelete({
            _id:id
        })
        // if(!post){
        //     res.status(404).json({
        //         message:'post not found'
        //     })
        // }
        res.status(200).json({
            message:"Delete Successful",
            post:post
        })
    }
    catch(e){
        res.status(500).json({
            message:"Error in delete",
            Error:e.message
        })
    }
} )

app.patch('/todo-update/:id', async (req,res)=>{
    try{
        let id=req.params.id
       let {title,description}=req.body
        let post = await todoSchema.findOneAndUpdate({_id:id},{title:title,description:description})

        res.status(200).json({
            message:'Update successful',
            post:post  
        })
    }
    catch(e){
        res.status(500).json({
            message:'Error in patch'
        })
    }
} )


module.exports=app