import mongoose from 'mongoose';
import { optional, string } from 'zod';
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    otp: String, 
    otpExpiry: Date, 
    isVerified: { type: Boolean, default: false }
});
const adminSchema = new Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const questionSchema = new Schema({
    question: { type: String, required: true },
    questionDiagram: { type: string },
    option: [{ type: String, required: true }],
    answer: [{ type: String, required: true }],
    subject: { type: String, required: true },
    year: { type: Number, required: true },
    solution:{type:String,required:true},
    examType: [{ type: String, enum: ["JEE", "NEET", "OTHER"], default: "OTHER" }],
    difficulty: [{ type: String, enum: ["EASY", "MEDIUM", "DIFFICULT"], default: "MEDIUM" }],
    tags: [{ type: String }],// which topic eg - 'thermo', 'law of motion'

}, { timestamps: true });

const attemtQuestionsSchema = new Schema({
    question: {
        type: String, required: true
    },
    questionDiagram: { type: string },

    subject: { type: String },
    status: { type: String, required: true },
    userAnswer: [{ type: String }],
    answer: [{ type: String }],
    timeTaken: { type: String },
    tags: [{ type: String }],
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, { timestamps: true });
const todosSchema = new Schema({    
    todo: { type: String, required: true },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
},{ timestamps: true })
const notesSchema = new Schema({
    note: [{ type: String, required: true }],
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
})
const BookMarkedSchema = new Schema({
    questionId: {type :mongoose.Schema.Types.ObjectId ,required:true},
    student :{
        type : mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }

})

export const NoteModel = mongoose.model("notes", notesSchema);
export const TodoModel = mongoose.model("todo", todosSchema);
export const attemtQuestionsModel = mongoose.model("attempts", attemtQuestionsSchema);
export const QuestionModel = mongoose.model("questions", questionSchema);
export const UserModel = mongoose.model('users', userSchema);
export const adminModel = mongoose.model('admin', adminSchema);
export const BookMarkModel = mongoose.model('bookmark',BookMarkedSchema);