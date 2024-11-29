namespace ApiTry2.Models;

public class Ammunition
{
    public int Id {get; set;}//Unique ID of this batch

    public int Quantity {get; set;}//Amount of ammunition in this batch, in individual shells

    //Caliber in mm (rounded to nearest integer)
    public int Caliber {get; set;}=155;


    public enum Status {Depot/*In storage behind the lines (and not owned by anyone)*/,Transit/*Currently en-route to the destination*/,Use/*In use at the front, or in training*/};
    public Status status {get; set;}=Status.Depot;

    public enum Type {HE, AP, Cluster}
    public Type type {get;set;}=Type.HE;

    public bool Guidance {get;set;} = false;


    //TEMP this should be a Location ID
    //
    //Can either be an Ammunition depot, or a military unit (In this example, it will be Brigades)
    //For Ammunition in transit, the location is that of the final destination (Even if it technically is still in the old location)
    public string Location {get; set;}="Null";

    //Default constructor
    public Ammunition(){}

    //Copy constructor
    public Ammunition(Ammunition other)
    {
        Id=other.Id;
        Quantity=other.Quantity;
        Caliber=other.Caliber;
        status=other.status;
        type=other.type;
        Guidance=other.Guidance;
        Location=other.Location;
    }
}
