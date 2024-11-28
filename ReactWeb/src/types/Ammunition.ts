//The ammunition type: a single shipment of artillery shells
export type Ammunition= {
    id: number;
    quantity: number;
    caliber: number;
    shellStatus: string;//Will be either Depot,Transit or Use
    shellStatusEnum: number;
    shellType: string;//Will likely be either HE, AP or Cluster
    shellTypeEnum: number;
    guidance: boolean;
    location: string;
}