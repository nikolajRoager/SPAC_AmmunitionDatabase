import { useAddAmmunition } from "../hooks/AmmunitionHooks"
import { Ammunition } from "../types/Ammunition";
import AmmunitionForm from "./AmmunitionForm";

const AmmunitionAdd = () => {
    const addAmmunitionMutation = useAddAmmunition();


    const ammunition: Ammunition =
    {
        id: 0,
        quantity: 1,
        caliber: 152,
        shellStatus: "in transit",//By default, ammunition is shipped in from outside, or from a factory
        shellStatusEnum: 1,
        shellType: "HE",
        shellTypeEnum: 0,
        guidance: false,
        location: "Kharkiv Strategic depot"
    }

    return (
    <div>
        <h1>Add ammunition to database</h1>
        <AmmunitionForm
            ammunition={ammunition}
            submitted={(a) => addAmmunitionMutation.mutate(a)}
        />
    </div>
    )
}

export default AmmunitionAdd;