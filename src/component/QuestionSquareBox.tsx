export default function SquareBox(props:any){
    return(
        <>
        <div id={"id-"+props.ID} className="w-4 h-4 rounded-md p-3 shadow-md      bg-white flex items-center justify-center">
         {props.num}
        </div>
        </>
    )
}