import mongoose from mongoose;
const UserSchema=new mongoose.Schema({
      name:{
        type :String,
        required:true
      },
      email:{
        type :String,
        required:true,
        unique:true

      }, pasword:{
        type :String,
        required:true
      },image:{
        type :String,
      },
      bio:{
        type :String,
        maxlength:500
      },
      


});