import config from "../config";
import { Ammunition } from "../types/Ammunition";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

//use Axios package to get all ammunition
const useFetchAmmunitions = ()=>{
    return useQuery<Ammunition[],AxiosError>(
        {
            queryKey: ["ammunitions"],
            queryFn: async () =>
                await axios.get(config.ApiUrlGetAll).then((resp) => resp.data),
        });
}

//Or get a single batch
const useFetchSingleAmmunition = (id: number)=>{
    return useQuery<Ammunition,AxiosError>(
        {
            queryKey: ["ammunition", id],
            queryFn: async () =>
                await axios.get(`${config.ApiUrlBase}/Get/${id}`).then((resp) => resp.data),
        });
}

const useAddAmmunition = () =>
{
    const queryClient = useQueryClient();
    const nav = useNavigate();
    return useMutation<AxiosResponse, AxiosError,Ammunition>({
        mutationFn: async (A) =>await axios.post(`${config.ApiUrlBase}/Post`,A),
        onSuccess: ()=>{
            //Drop the cache for all ammunitions
            queryClient.invalidateQueries({queryKey:["Ammunitions"]})
            //Go to root
            nav("/");}
    });
}

const useUpdateAmmunition = () =>
{
    const queryClient = useQueryClient();
    const nav = useNavigate();
    return useMutation<AxiosResponse, AxiosError,Ammunition>({
        mutationFn: async (A) => {
            return await axios.put(`${config.ApiUrlBase}/Put/${A.id}`,A)
        },
        onSuccess: (_, Ammo)=>{
            //Drop the cache for all ammunitions
            queryClient.invalidateQueries({queryKey:["Ammunitions"]})
            //Go to root
            nav(`/AmmoBatch/${Ammo.id}`);}
    });
}

const useDeleteAmmunition = () =>
{
    const queryClient = useQueryClient();
    const nav = useNavigate();
    return useMutation<AxiosResponse, AxiosError,Ammunition>({
        mutationFn: async (A) => await axios.delete(`${config.ApiUrlBase}/Delete/${A.id}`),
        onSuccess: ()=>{
            //Drop the cache for all ammunitions
            queryClient.invalidateQueries({queryKey:["Ammunitions"]})
            //Go to root
            nav(`/`);}
    });
}

export default useFetchAmmunitions;
export {useFetchSingleAmmunition,useAddAmmunition,useDeleteAmmunition,useUpdateAmmunition};