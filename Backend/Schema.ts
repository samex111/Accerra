import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const userSchema = new Schema({
    username: {type:String, unique:true, required:true},
    email : {type:String , unique:true, required:true},
    password : {type:String ,  required:true}
});
const adminSchema = new Schema({
    email: {type:String, unique:true, required:true},
    username : {type:String , unique:true, required:true},
    password : {type:String ,  required:true}
});

const questionSchema = new Schema({
    question:{type:String, required:true},
    option:[{type:String, required:true}],
    answer:[{type:String, required:true}],
    subject:{type:String, required:true},
    year:{type:Number , required:true },
    examType: [{type:String, enum:["JEE", "NEET", "OTHER"], default:"OTHER"}],
    difficulty:[{type:String , enum:["EASY", "MEDIUM", "DIFFICULT"] ,default:"MEDIUM"}],
    tags: [{ type: String }] ,// which topic eg - 'thermo', 'law of motion'
    
} ,  { timestamps: true });

const attemtQuestionsSchema = new Schema ({
    question: {
        type: mongoose.Schema.Types.ObjectId,  // Question ID store hogi
        ref: 'questions',
        required: true
    },
    status:   { type: String, required: true },
    answer:   { type: String },
    timeTaken:{ type: String },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

export const attemtQuestionsModel = mongoose.model("attemt", attemtQuestionsSchema );
export const QuestionModel = mongoose.model("questions", questionSchema );
export const UserModel = mongoose.model('users', userSchema);
export const adminModel = mongoose.model('admin', adminSchema);