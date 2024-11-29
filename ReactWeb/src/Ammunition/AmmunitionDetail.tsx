import { useLocation, useNavigate, useParams } from "react-router-dom"
import {useDeleteAmmunition, useFetchSingleAmmunition, useSendAmmunition, useUpdateAmmunition} from "../hooks/AmmunitionHooks";
import ApiStatus from "../apiStatus";
import { useEffect, useState } from "react";
import Tab from "../Tabs/Tab";
import Tabs from "../Tabs/Tabs";
import AmmunitionForm from "./AmmunitionForm";

const AmmunitionDetail = () =>
{

    const nav = useNavigate();
    const { id} = useParams();

    const location = useLocation();

    const tab = (new URLSearchParams(location.search)).get('tab');



    if (!id) throw Error("Ammunition batch Id is not in database");
    const AmmoId = parseInt(id);
    const initTab = tab?parseInt(tab):0;


    const {data, status, isSuccess} = useFetchSingleAmmunition(AmmoId);

    const [Ammo, setAmmunitionState] = useState(data);
    const [myQuantity,setMyQuantity] = useState(0);
    const [destination,setDestination] = useState("null")
    useEffect(
        ()=>
            {
                setAmmunitionState(data);
                //If something changes, reset the selections
                setMyQuantity(0)
                setDestination("null")
            },[data]
    )

    const deleteAmmunitionMutation = useDeleteAmmunition();
    const updateAmmunitionMutation = useUpdateAmmunition();
    const sendAmmunitionMutation = useSendAmmunition();

    //For easier reading, define the Send tab for all situations, and use a switch to select
    const sendElements=()=>
    {
        if (!Ammo)//This will NOT be called, I am just trying to get VSCode to STFU
            return <div></div>
        switch(Ammo.shellStatusEnum)
        {

            default:
            case 0:
                return(
                    <div>
                        Send {myQuantity==Ammo.quantity?" all ":" "} {<input
                        min={1}
                        max={Ammo.quantity}
                        type="number"
                        className="form-control"
                        placeholder="Amount"
                        value={myQuantity}
                        onChange={(e) =>
                            setMyQuantity(parseInt(e.target.value))
                        }/>} 
                        shells from this batch to
                        <select
                        className="form-control"
                        value={destination}
                        onChange={(e) =>
                            {
                                setDestination(e.target.value)
                            }
                        }
                        >
                            <option value={Ammo.location}>Own combat regiments</option>
                            <option value="null">-</option>
                            {Ammo.location!="Kharkiv Strategic Depot"?   <option value="Kharkiv Strategic Depot">Kharkiv Strategic Depot</option>:<></>}
                            {Ammo.location!="Sumy Strategic Depot"?      <option value="Sumy Strategic Depot">Sumy Strategic Depot</option>:<></>}
                            {Ammo.location!="Dnipro Depot"?              <option value="Dnipro Depot">Dnipro Strategic Depot</option>:<></>}
                            {Ammo.location!="Kryvyi Rhi Strategic Depot"?<option value="Kryvyi Rhi Strategic Depot">Kryvyi Rhi Strategic Depot</option>:<></>}
                            {Ammo.location!="26th Brigade"?              <option value="26th Brigade">26th Brigade</option>:<></>}
                            {Ammo.location!="40th Brigade"?              <option value="40th Brigade">40th Brigade</option>:<></>}
                            {Ammo.location!="43th Brigade"?              <option value="43th Brigade">43th Brigade</option>:<></>}
                            {Ammo.location!="44th Brigade"?              <option value="44th Brigade">44th Brigade</option>:<></>}
                            {Ammo.location!="55th Brigade"?              <option value="55th Brigade">55th Brigade</option>:<></>}
                        </select>
                        <button className="actionbutton"
                        disabled={destination=="null" || Ammo.quantity<myQuantity}
                        onClick={()=>{
                                if (myQuantity==Ammo.quantity)
                                {
                                    if (window.confirm("transfer entire batch?"))
                                    {
                                        //To combat
                                        if (destination==Ammo.location)
                                            setAmmunitionState({...Ammo, shellStatus : "assigned to combat regiments", shellStatusEnum : 2});
                                        else//To somewhere else
                                            setAmmunitionState({...Ammo, location : destination, shellStatus : "in transit", shellStatusEnum : 1});
                                        updateAmmunitionMutation.mutate(Ammo);
                                        setMyQuantity(0)
                                        setDestination("null")

                                    }
                                }
                                else
                                {
                                    sendAmmunitionMutation.mutate({Ammo : Ammo, quantity : myQuantity, destination : destination})
                                    setAmmunitionState({...Ammo, quantity: Ammo.quantity-myQuantity});
                                    setMyQuantity(0)
                                    setDestination("null")
                                }
                            }}
                            >
                            Confirm
                        </button>
                    </div>)
            case 1:
                return(
                    <div>
                        Confirm that this batch has arrived at the {Ammo.location}
                        <button className="actionbutton"
                        onClick={()=>{
                                setAmmunitionState({...Ammo, shellStatus : "in storage", shellStatusEnum : 0 });
                                updateAmmunitionMutation.mutate(Ammo);
                            }}
                            >
                            Confirm
                        </button>
                    </div>)
            case 2:
                return(
                    <div>
                        Return  {myQuantity==Ammo.quantity?" all ":" "} {<input
                        min={1}
                        max={Ammo.quantity}
                        type="number"
                        className="form-control"
                        placeholder="Amount"
                        value={myQuantity}
                        onChange={(e) =>
                            setMyQuantity(parseInt(e.target.value))
                        }/>} unussed shells from this batch to storage.
                        <button className="actionbutton"
                        onClick={()=>{
                                setAmmunitionState({...Ammo, quantity : myQuantity , shellStatus : "in storage", shellStatusEnum : 0 });
                                updateAmmunitionMutation.mutate(Ammo);

                                setMyQuantity(0)
                                setDestination("null")
                            }}
                            >
                            Return
                        </button>
                    </div>)
        }
    }
    
    if (!isSuccess)
        return <ApiStatus status={status}/>
    else if (!Ammo || !data)
        return <div className="Error">Ammunition batch could not be resolved!</div>
    else
    {
        return(
            <div>
                <h3>Batch of {Ammo.quantity} {Ammo.caliber}mm {Ammo.guidance?"guided":"unguided"} {Ammo.shellType} shells currently {Ammo.shellStatus} at {Ammo.location}</h3>
                <button className="actionbutton"
                onClick={()=>nav("/")}
                >
                    Back
                </button>


                <Tabs initialTab={initTab>2?2:initTab}>
                    <Tab title={Ammo.shellStatusEnum==0?"Send ammunition":(Ammo.shellStatusEnum==1?"register arrival":"return to storage")}>
                        {sendElements()}
                    </Tab>
                    <Tab title="Register losses">
                        <div>
                            <h4> Register spent or lost shells</h4>
                            <div>
                                Remaining shells: 
                                {<input
                                min={0}
                                max={Ammo.quantity}
                                type="number"
                                className="form-control"
                                placeholder="Amount"
                                value={myQuantity}
                                onChange={(e) =>
                                    setMyQuantity(parseInt(e.target.value))
                                }/>} lost shells: {<input
                                min={0}
                                max={Ammo.quantity}
                                type="number"
                                className="form-control"
                                placeholder="Amount"
                                value={Ammo.quantity-myQuantity}
                                onChange={(e) =>
                                    setMyQuantity(Ammo.quantity-parseInt(e.target.value))
                                }/>}
                                <button className="actionbutton"
                                onClick={()=>{
                                        if (myQuantity==0)
                                        {
                                            if (window.confirm("this will delete this batch from the database, are you sure?"))
                                            {
                                                deleteAmmunitionMutation.mutate(Ammo);
                                                setMyQuantity(0)
                                                setDestination("null")
                                            }

                                        }
                                        else
                                        {
                                            
                                            setAmmunitionState({...Ammo, quantity : myQuantity , shellStatus : "in storage", shellStatusEnum : 0 });
                                            updateAmmunitionMutation.mutate(Ammo);
                                            setMyQuantity(0)
                                            setDestination("null")
                                        }
                                    }}
                                    >
                                    Confirm
                                </button>
                            </div>
                            <h4>
                                Lost all
                            </h4>
                            <div>
                                Register the loss of this Entire batch, and delete it from the database:
                                <button className="actionbutton"
                                onClick={()=>{
                                    if (window.confirm("Are you sure? This can not be undone"))
                                    {
                                        deleteAmmunitionMutation.mutate(Ammo);

                                        setMyQuantity(0)
                                        setDestination("null")
                                    }
                                }}
                                >
                                All lost
                                </button>


                            </div>
                        </div>
                    </Tab>
                    <Tab title="Advanced edit">
                        <AmmunitionForm
                            ammunition={Ammo}
                            submitted={a => {updateAmmunitionMutation.mutate(a);setAmmunitionState(a)}}
                        />
                        </Tab>
                </Tabs>
            </div>
        )
    }
}

export default AmmunitionDetail;