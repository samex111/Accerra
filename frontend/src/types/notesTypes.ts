export interface addNotesProps {
    title? : string ,
    body ? : string
};

export interface notesId{
    id : string
}
export interface notesData {
    success : boolean , 
    data : {
        _id : string ,
        title : string ,
        body : string ,
        studentId : string
        createdAt  : string ,
    }[]
}