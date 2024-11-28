import { useParams } from "react-router-dom"
import {useDeleteAmmunition, useFetchSingleAmmunition, useUpdateAmmunition} from "../hooks/AmmunitionHooks";
import ApiStatus from "../apiStatus";
import { Link} from "react-router-dom";
import { Ammunition } from "../types/Ammunition";
import { useEffect, useState } from "react";
//import { AmmunitionFormStatus } from "./AmmunitionForm";

const AmmunitionDetail = () =>
{
    const { id} = useParams();
    if (!id) throw Error("Ammunition batch Id is not in database");
    const AmmoId = parseInt(id);

    const {data, status, isSuccess} = useFetchSingleAmmunition(AmmoId);

    const [Ammo, setAmmunitionState] = useState(data);

    useEffect(
        ()=>
            {
                setAmmunitionState(data);
            },[data]
    )

    const deleteAmmunitionMutation = useDeleteAmmunition();
    const updateAmmunitionMutation = useUpdateAmmunition();


    if (!isSuccess)
        return <ApiStatus status={status}/>
    else if (!Ammo || !data)
        return <div className="Error">Ammunition batch could not be resolved!</div>
    else
    {
        //let [ammunitionState, setAmmunitionState] = useState({...Ammo});
        switch(Ammo.shellStatusEnum)
        {
            //This ammunition is in storage
            default:
            case 0:
                return (
                <div>
                    <h5>
                        Batch of {Ammo.caliber}mm {Ammo.guidance?"guided":"unguided"} {Ammo.shellType} artillery shells
                    </h5>
                    <div className="row mt-3">
                        This batch contains {Ammo.quantity} shells, and is currently {Ammo.shellStatus} ({Ammo.shellStatusEnum}) at the {Ammo.location}. 
                    </div>
                    <div className="col">
                        <div className="row">This batch is available for shipping to any location or combat regiments:
                        <div className="col"></div>
                        <button 
                            className="actionbutton col-2"
                            onClick={()=>{
                                
                            }}
                            >
                                Send to ...
                        </button>
                        <button 
                            className="actionbutton col-2"
                            onClick={()=>{
                                
                            }}
                            >
                                Assign to regiments
                        </button>
                        </div>
                        <div className="row">Register loss or revise number of shells:
                        <div className="col"></div>
                            <button 
                                className="actionbutton col-2"
                                onClick={()=>{
                                    if (window.confirm("Register entire batch as lost?"))
                                        deleteAmmunitionMutation.mutate(Ammo);
                                }}
                                >
                                    All Lost
                            </button>
                            <button 
                                className="actionbutton col-2"
                                onClick={()=>{
                                    
                                }}
                                >
                                    Revise quantity
                            </button>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <Link className="btn btn-primary" to={`/AmmoBatch/edit/${Ammo.id}`}>
                                    Go to advanced edit
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )
            //This is in transit
            case 1:
                return(
                <div>
                    <h5>
                        Batch of {Ammo.caliber}mm {Ammo.guidance?"guided":"unguided"} {Ammo.shellType} artillery shells
                    </h5>
                    <div className="row mt-3">
                        This batch contains {Ammo.quantity} shells, and is currently {Ammo.shellStatus}  ({Ammo.shellStatusEnum})to the {Ammo.location}: 
                        <button 
                            className="actionbutton col-2"
                            onClick={async ()=>{
                                if (window.confirm("Register batch as delivered?"))
                                {
                                    setAmmunitionState({ ...Ammo, shellStatus : "in storage",shellStatusEnum : 0})

                                    await updateAmmunitionMutation.mutate(Ammo);
                                }
                            }}
                            >
                                Register arrived
                        </button>


                        <button 
                            className="actionbutton col-2"
                            onClick={()=>{
                                if (window.confirm("Register entire batch as lost?"))
                                    deleteAmmunitionMutation.mutate(Ammo);
                            }}
                            >
                                All Lost
                        </button>
                            <div className="row">
                                <div className="col-2">
                                    <Link className="btn btn-primary" to={`/AmmoBatch/edit/${Ammo.id}`}>
                                        Go to advanced edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
            )
            
            //This is in combat use
            case 2:
                return (
                <div>
                    <h5>
                        Batch of {Ammo.caliber}mm {Ammo.guidance?"guided":"unguided"} {Ammo.shellType} artillery shells
                    </h5>
                    <div className="row mt-3">
                        This batch contains {Ammo.quantity} shells, and is currently {Ammo.shellStatus} ({Ammo.shellStatusEnum}) at the {Ammo.location}. 
                    </div>
                    <div className="col">
                        <div className="row">This batch is in combat use:
                        <div className="col"></div>
                        <button 
                            className="actionbutton col-2"
                            onClick={()=>{
                                
                            }}
                            >
                                Return to storage
                        </button>
                        <button 
                            className="actionbutton col-2"
                            onClick={()=>{
                                
                            }}
                            >
                                Register losses
                        </button>
                        <button 
                            className="actionbutton col-2"
                            onClick={()=>{
                                if (window.confirm("Register entire batch as lost?"))
                                    deleteAmmunitionMutation.mutate(Ammo);
                            }}
                            >
                                All Lost
                        </button>
                            <div className="row">
                                <div className="col-2">
                                    <Link className="btn btn-primary" to={`/AmmoBatch/edit/${Ammo.id}`}>
                                        Go to advanced edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )

        }
    }
}

export default AmmunitionDetail;