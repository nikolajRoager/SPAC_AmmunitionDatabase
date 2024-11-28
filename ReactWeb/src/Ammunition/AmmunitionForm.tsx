import { useState } from "react";
import { Ammunition } from "../types/Ammunition"

//We need a piece of ammo, and a function to call when it was submitted
type Args = {
    ammunition: Ammunition;
    submitted: (ammunition: Ammunition) => void;
}

const AmmunitionForm = ({ ammunition, submitted}: Args)=>
{
    const [ammunitionState, setAmmunitionState] = useState({...ammunition});



    //Do the submission
    const onSubmit: React.MouseEventHandler<HTMLButtonElement>=
        async (e) =>
        {
            e.preventDefault();
            submitted(ammunitionState);
        }

    return (
        <form className="mt-2">
        <div className="form-group">
            <label htmlFor="Caliber">Caliber (mm) </label>
            <input
            min={1}
            type="number"
            className="form-control"
            placeholder="Caliber (mm)"
            value={ammunitionState.caliber}
            onChange={(e) =>
                setAmmunitionState({ ...ammunitionState, caliber: parseInt(e.target.value)})
            }
            />
        </div>
        <div className="form-group">
            <label htmlFor="Quantity">Amount </label>
            <input
            min={1}
            type="number"
            className="form-control"
            placeholder="Amount"
            value={ammunitionState.quantity}
            onChange={(e) =>
                setAmmunitionState({ ...ammunitionState, quantity: parseInt(e.target.value)})
            }
            />
        </div>
        <div className="form-group">
            <label htmlFor="Guided">Guided </label>
            <input
            min={1}
            type="checkbox"
            className="form-control"
            placeholder="Guided"
            value="Yes"
            onChange={(e) =>
                setAmmunitionState({ ...ammunitionState, guidance: e.target.checked})
            }
            />
        </div>
        <div className="form-group mt-2">
            <label htmlFor="status">Current status</label>
            <select
            className="form-control"
            value={ammunitionState.shellStatus}
            onChange={(e) =>
                {
                    switch (e.target.value)
                    {
                        default:
                        case "in storage":
                            setAmmunitionState({ ...ammunitionState, shellStatusEnum: 0, shellStatus : e.target.value})
                        break;
                        case "in transit":
                            setAmmunitionState({ ...ammunitionState, shellStatusEnum: 1, shellStatus : e.target.value})
                        break;
                        case "assigned to combat regiments":
                            setAmmunitionState({ ...ammunitionState, shellStatusEnum: 2, shellStatus : e.target.value})
                        break;

                    }
                }
            }
            >
                <option value="in storage">in storage</option>
                <option value="in transit">in transit</option>
                <option value="assigned to combat regiments">assigned to combat regiments</option>
            </select>
            
        </div>
        <div className="form-group mt-2">
            <label htmlFor="Owner">Owner </label>
            <select
            className="form-control"
            value={ammunitionState.location}
            onChange={(e) =>
                setAmmunitionState({ ...ammunitionState, location: e.target.value })
            }
            >
                <option value="Kharkiv Strategic Depot">Kharkiv Strategic Depot</option>
                <option value="Sumy Strategic Depot">Sumy Strategic Depot</option>
                <option value="Dnipro Depot">Dnipro Strategic Depot</option>
                <option value="Kryvyi Rhi Strategic Depot">Kryvyi Rhi Strategic Depot</option>
                <option value="26th Brigade">26th Brigade</option>
                <option value="40th Brigade">40th Brigade</option>
                <option value="43th Brigade">43th Brigade</option>
                <option value="44th Brigade">44th Brigade</option>
                <option value="55th Brigade">55th Brigade</option>
                
            </select>
            
        </div>
        <button
            className="submitbutton"
            disabled={!ammunitionState.quantity || !ammunitionState.caliber || ammunitionState.quantity<=0 || ammunitionState.caliber<0 }
            onClick={onSubmit}
        >
            Submit
        </button>
        </form>
    );
};


//A few minimal forms
const AmmunitionFormStatus = ({ ammunition, submitted}: Args)=>
{

    //Single button
    return (
        <button
            className="submitbutton"
            onClick={ ()=>
            submitted(
                {
                    id : ammunition.id,
                    quantity : ammunition.quantity,
                    caliber: ammunition.caliber,
                    shellStatus:  "in storage",
                    shellStatusEnum: 0,
                    shellType: ammunition.shellType,
                    shellTypeEnum: ammunition.shellTypeEnum,
                    guidance: ammunition.guidance,
                    location: ammunition.location
                } as Ammunition
            )
            }
        >
            Submit
        </button>
    );
};

export default AmmunitionForm;
export {AmmunitionFormStatus}