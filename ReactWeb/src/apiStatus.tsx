type Args = 
{
    status: "success" | "error" | "pending";
}

const ApiStatus = ({status} : Args) =>
{
    switch ( status) {
        case "error":
            return <div className="Error" >Could not connect to database!</div>
        case "pending":
            return <div>Loading..</div>
        case "success":
            return <div>Done</div>
        default:
            throw Error("Unknown API state")
    }
}

export default ApiStatus;