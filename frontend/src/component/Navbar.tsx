import Todo from "./Todo"

export function Navbar(){
    return(
        <>
        <div className="flex flex-col pl-2 justify-between  h-[70vh]">
            <div>
            <h1 className="text-3xl pb-[4vh]">Accerra</h1>
            <ul>
                <li onClick={()=>{return <Todo></Todo>}}>Home</li>
                <li>Understand with AI</li>
                <li>Bookmarked</li>
                <li>Setting</li>
            </ul>
            </div>

            <div>Profile</div>
        </div>
        </>
    )
}