namespace Api.Models;

public class Dimdum
{
    public int Id=0;
}

/// <summary>
/// A single batch of ammunition, stored in one particular location or en-route
/// </summary>
public class Ammunition
{
    public int Id;//Unique ID of this batch


    public string Name;//Name of this model of ammunition
    public int Quantity;//Amount of ammunition in this batch, in individual shells

    //Modern artillery shells like Excalibur have wings and can be controlled (but are susceptible to jamming)
    public bool Guided;

    //Calibre in mm (For this purpose, submm precision is not available, as all major artillery producers use whole mm)
    public int Calibre=155;


    public enum Status {Depot/*In storage behind the lines (and not owned by anyone)*/,Transit/*Currently en-route to the destination*/,Use/*In use at the front, or in training*/};
    public Status status=Status.Depot;


    //TEMP this should be a Location ID
    //
    //Can either be an Ammunition depot, or a division (Where exactly the division stores the ammunition, and divides it up among its regiments is not tracked here)
    //For Ammunition in transit, the location is that of the final destination (Even if it technically is still in the old location)
    public string Location;

    public Ammunition(int id, string name, int quantity, int calibre, Status _status, string loc, bool guided=false)
    {
        Location=loc;
        Id=id;
        Name=name;
        Quantity=quantity;
        Guided=guided;
        Calibre=calibre;
        status=_status;
    }

}
