import { useParams } from "react-router-dom";
import  {useFetchSingleAmmunition ,useUpdateAmmunition } from "../hooks/AmmunitionHooks";
import ApiStatus from "../apiStatus";
import AmmunitionForm from "./AmmunitionForm";

const AmmunitionEdit = () => {
  const { id } = useParams();
  if (!id) throw Error("Need a batch id");
  const AmmoId = parseInt(id);

  const { data, status, isSuccess } = useFetchSingleAmmunition(AmmoId);
  const updateAmmunitionMutation = useUpdateAmmunition();

  if (!isSuccess) return <ApiStatus status={status} />;

  return (
    <div>
        <h1>Advanced editing form</h1>
        <AmmunitionForm
            ammunition={data}
            submitted={a => updateAmmunitionMutation.mutate(a)}
        />
    </div>
  );
};



export default AmmunitionEdit;
