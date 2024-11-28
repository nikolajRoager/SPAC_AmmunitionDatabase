import { Link, useNavigate } from "react-router-dom";
import ApiStatus from "../apiStatus";
import useFetchAmmunitions, { useDeleteAmmunition } from "../hooks/AmmunitionHooks";
import { useEffect, useState } from "react";

const AmmunitionList=()=>
{
    const nav = useNavigate();
    //Get list of ammunition and status

    const {data: original_ammunitionList, status, isSuccess} = useFetchAmmunitions();

    
    const [ammunitionList, setList] = useState(original_ammunitionList);

    const [reSort, setReSort] = useState(false);

    
    const [sortKey, setSortKey] = useState("null");
    const [Asc, setAsc] = useState(1);

    useEffect( ()=>
    {
        if (original_ammunitionList)
            setList(original_ammunitionList);
    },[original_ammunitionList])


    useEffect( ()=>
    {
        if (ammunitionList)
        {
            let temp = ammunitionList.slice();
            switch(sortKey)
            {
                default:
                    break;
                case "caliber":
                    temp.sort((a,b) => a.caliber>b.caliber ? -Asc : Asc);
                    break;
                case "warhead":
                    temp.sort((a,b) => a.shellType.localeCompare(b.shellType)*Asc);
                break;
                case "quantity":
                    temp.sort((a,b) => a.quantity>b.quantity? -Asc : Asc);
                break;
                case "guidance":
                    temp.sort((a,b) => a.guidance == b.guidance ? 0 : (a.guidance?Asc:-Asc));
                break;
                case "status":
                    temp.sort((a,b) => a.shellStatus.localeCompare(b.shellStatus)*Asc);
                break;
                case "owner":
                    temp.sort((a,b) => a.location.localeCompare(b.location)*Asc);
                break;
            }
            setList(temp);
        }

    },[Asc,sortKey,reSort]);

    //We can delete straight from the table
    const deleteAmmunitionMutation = useDeleteAmmunition();

    //If not loaded yet, print message (when the status changes, we will reload)
    if (!isSuccess)
        return <ApiStatus status={status}/>
    //Return TSX table:
    return (
        <div>
            <div className="row mb-2">
                <caption className="themeFontColor text-center">
                    Ammunition batches in logistics database sorted by {sortKey}
                </caption>
            </div>
            <table className="table table-hover">
                <thead>
                    <th>
                        Shipment
                    </th>
                    <th>
                        Losses
                    </th>
                    <th>
                        Caliber <button className="SortButon"
                        //On botton click, change the sorting:
                        onClick={()=>{/*If we click this header*/if (sortKey=="caliber"){/*and we already clicked it before: change ascending/descending*/setAsc(-Asc)}else{/*First time around we sort descending*/setAsc(1)} /*Now set the key*/setSortKey("caliber");/*Flip the sort flag, this causes sort to be re-called*/setReSort(!reSort)}}>
                            {sortKey=="caliber"?(/*Print arrow up or down if we are sorting by this*/Asc>0?"\u2B9D":"\u2B9F"):"-"/*print simple - if not sorting by this*/}
                        </button>
                    </th>
                    <th>
                        Warhead <button className="SortButon"
                        //On botton click, change the sorting:
                        onClick={()=>{/*If we click this header*/if (sortKey=="warhead"){/*and we already clicked it before: change ascending/descending*/setAsc(-Asc)}else{/*First time around we sort descending*/setAsc(1)} /*Now set the key*/setSortKey("warhead");/*Flip the sort flag, this causes sort to be re-called*/setReSort(!reSort)}}>
                            {sortKey=="warhead"?(/*Print arrow up or down if we are sorting by this*/Asc>0?"\u2B9D":"\u2B9F"):"-"/*print simple - if not sorting by this*/}
                        </button>
                    </th>
                    <th>
                        Guidance? <button className="SortButon"
                        //On botton click, change the sorting:
                        onClick={()=>{/*If we click this header*/if (sortKey=="guidance"){/*and we already clicked it before: change ascending/descending*/setAsc(-Asc)}else{/*First time around we sort descending*/setAsc(1)} /*Now set the key*/setSortKey("guidance");/*Flip the sort flag, this causes sort to be re-called*/setReSort(!reSort)}}>
                            {sortKey=="guidance"?(/*Print arrow up or down if we are sorting by this*/Asc>0?"\u2B9D":"\u2B9F"):"-"/*print simple - if not sorting by this*/}
                        </button>
                    </th>
                    <th>
                        Quantity <button className="SortButon"
                        //On botton click, change the sorting:
                        onClick={()=>{/*If we click this header*/if (sortKey=="quantity"){/*and we already clicked it before: change ascending/descending*/setAsc(-Asc)}else{/*First time around we sort descending*/setAsc(1)} /*Now set the key*/setSortKey("quantity");/*Flip the sort flag, this causes sort to be re-called*/setReSort(!reSort)}}>
                            {sortKey=="quantity"?(/*Print arrow up or down if we are sorting by this*/Asc>0?"\u2B9D":"\u2B9F"):"-"/*print simple - if not sorting by this*/}
                        </button>

                    </th>
                    <th>
                        Status <button className="SortButon"
                        //On botton click, change the sorting:
                        onClick={()=>{/*If we click this header*/if (sortKey=="status"){/*and we already clicked it before: change ascending/descending*/setAsc(-Asc)}else{/*First time around we sort descending*/setAsc(1)} /*Now set the key*/setSortKey("status");/*Flip the sort flag, this causes sort to be re-called*/setReSort(!reSort)}}>
                            {sortKey=="status"?(/*Print arrow up or down if we are sorting by this*/Asc>0?"\u2B9D":"\u2B9F"):"-"/*print simple - if not sorting by this*/}
                        </button>
                    </th>
                    <th>
                        Owner <button className="SortButon"
                        //On botton click, change the sorting:
                        onClick={()=>{/*If we click this header*/if (sortKey=="owner"){/*and we already clicked it before: change ascending/descending*/setAsc(-Asc)}else{/*First time around we sort descending*/setAsc(1)} /*Now set the key*/setSortKey("owner");/*Flip the sort flag, this causes sort to be re-called*/setReSort(!reSort)}}>
                            {sortKey=="owner"?(/*Print arrow up or down if we are sorting by this*/Asc>0?"\u2B9D":"\u2B9F"):"-"/*print simple - if not sorting by this*/}
                        </button>
                    </th>
                </thead>
                <tbody>
                    {ammunitionList && ammunitionList.map((A)=>(//Ammunitions.map((A)=>(
                        <tr key={A.id}>
                            <td>
                                <button className="actionbutton">
                                {
                                    //Combat regiments can not ship their ammunition
                                    (A.shellStatusEnum==1? "Arrived" : A.shellStatusEnum==0? "Send" : "return")
                                }
                                </button>
                            </td>
                            <td>
                                <button className="actionbutton"
                                
                                
                                onClick={()=>{
                                    if (window.confirm("Register entire batch as lost?"))
                                        deleteAmmunitionMutation.mutate(A);
                                    //Force a reload of this page
                                    window.location.reload()
                                }}
                                >
                                All lost
                                </button>
                            </td>
                            <td className="maintabled" onClick={()=>nav(`/AmmoBatch/${A.id}`)}>{A.caliber}mm</td>
                            <td className="maintabled" onClick={()=>nav(`/AmmoBatch/${A.id}`)}>{A.shellType}</td>
                            <td className="maintabled" onClick={()=>nav(`/AmmoBatch/${A.id}`)}>{(A.guidance?"yes":"no")}</td>
                            <td className="maintabled" onClick={()=>nav(`/AmmoBatch/${A.id}`)}>{A.quantity}</td>
                            <td className="maintabled" onClick={()=>nav(`/AmmoBatch/${A.id}`)}>{A.shellStatus}</td>
                            <td className="maintabled" onClick={()=>nav(`/AmmoBatch/${A.id}`)}>{A.location}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <Link className="btn btn-primary" to="/AmmoBatch/add">
                                New batch
                        </Link>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default AmmunitionList;