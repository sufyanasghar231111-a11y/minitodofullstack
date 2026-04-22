const mongoose=require('mongoose')

 const connectDb= async() =>{
    await mongoose.connect('mongodb+srv://yt:BTIOmYMGTsc4DfTy@backend1.p2nymqa.mongodb.net/todo')
    console.log('Connected to db');
    
 }

 module.exports=connectDb