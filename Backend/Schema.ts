import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserModel = new Schema({
    username : {type:String , unique:true, require:true},
    password : {type:String ,  require:true}
});

