export default function SquareBox(props:any){
    return(
        <>
        <div onClick={props.onClick} id={props.id} className="w-4 z-40 cursor-pointer h-4 rounded-md p-3 shadow-md bg-white flex items-center justify-center">
         {props.num}
        </div>
        </>
    )
}

