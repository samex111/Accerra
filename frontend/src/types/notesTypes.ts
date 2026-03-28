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
        id : string ,
        body : string ,
        studentId : string
        createdAt  : string ,
    }[]
}