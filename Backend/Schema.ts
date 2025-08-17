import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type:String, unique:true, require:true},
    username : {type:String , unique:true, require:true},
    password : {type:String ,  require:true}
});

const questionSchema = new Schema({
    
})
export const UserModel = mongoose.model('users', userSchema);