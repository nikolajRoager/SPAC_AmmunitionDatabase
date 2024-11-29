using Microsoft.EntityFrameworkCore;
using ApiTry2.Models;
using ApiTry2.DTO;
using TodoApi.Models;


namespace ApiTry2.Repositories;

public interface IAmmunitionRepository
{
    public Task<IEnumerable<AmmunitionDTO>> GetAll();
    public Task<AmmunitionDTO?> Get(int Id);

    public Task SaveChanges();

    public Task<AmmunitionDTO> Add(AmmunitionDTO A);

    public Task<AmmunitionDTO?> UpdateAmmoAsync(AmmunitionDTO A);
    
    public Task DeleteAmmoAsync(int id);


    public Task<AmmunitionDTO> SendAmmo(int id, int Quantity, string destination);
}

class AmmunitionRepository : IAmmunitionRepository
{
    private readonly AmmunitionContext context;
    public AmmunitionRepository(AmmunitionContext _context)
    {
        context=_context;
    }

    private AmmunitionDTO toDTO(Ammunition A)
    {
        string[] StatusNames={"in storage","in transit","assigned to combat regiments"};
        return new AmmunitionDTO(A.Id,A.Quantity,A.Caliber,StatusNames[(int)A.status],(int)A.status,A.type.ToString(),(int)A.type,A.Guidance,A.Location);
    }
    private Ammunition fromDTO(AmmunitionDTO Ammo)
    {
        //Create a new piece of ammunition from this Dto Disregard the ID as that will be updated by the database
        return new Ammunition
        {
            Quantity=Ammo.Quantity,
            Caliber=Ammo.Caliber,
            type = (Ammunition.Type)Math.Clamp(Ammo.ShellTypeEnum,0,Enum.GetValues(typeof(Ammunition.Type)).Length-1),//I happen to know that there are 3 
            status=(Ammunition.Status)Math.Clamp(Ammo.ShellStatusEnum,0,Enum.GetValues(typeof(Ammunition.Status)).Length-1),
            Guidance=Ammo.Guidance,
            Location=Ammo.Location
        };
    }

    /// <summary>
    /// Copy data from the DTO into out
    /// </summary>
    /// <param name="OUT"></param>
    /// <param name="Ammo"></param>
    private void CopyfromDTO(ref Ammunition OUT,AmmunitionDTO Ammo)
    {
        OUT.Quantity=Ammo.Quantity;
        OUT.Caliber=Ammo.Caliber;
        OUT.type = (Ammunition.Type)Math.Clamp(Ammo.ShellTypeEnum,0,Enum.GetValues(typeof(Ammunition.Type)).Length-1);//I happen to know that there are 3 
        OUT.status=(Ammunition.Status)Math.Clamp(Ammo.ShellStatusEnum,0,Enum.GetValues(typeof(Ammunition.Status)).Length-1);
        OUT.Guidance=Ammo.Guidance;
        OUT.Location=Ammo.Location;
    }

    public async Task<IEnumerable<AmmunitionDTO>> GetAll()
    {
        return await context.Ammunitions.Select(A => toDTO(A)).ToListAsync();;
    }

    public async Task<AmmunitionDTO?> Get(int Id)
    {
        var Re =  await context.Ammunitions.FirstOrDefaultAsync(A => A.Id==Id);
        
        return Re==null? null : toDTO(Re);
    }

    public async Task SaveChanges()
    {
        await context.SaveChangesAsync();
    }

    public async Task<AmmunitionDTO> Add(AmmunitionDTO ADto)
    {
        //Convert from a DTO to an actual shell and add it
        var A = fromDTO(ADto);
        await context.Ammunitions.AddAsync(A);

        //Adding updated the ID, convert this back to a DTO with the correct ID
        return toDTO(A);
    }

    /// <summary>
    /// Get A.id followed by setting
    /// </summary>
    /// <param name="A"></param>
    /// <returns></returns>
    public async Task<AmmunitionDTO?> UpdateAmmoAsync(AmmunitionDTO A)
    {

        var Entity=  await context.Ammunitions.FirstOrDefaultAsync(a => a.Id==A.Id);
        if (Entity!=null)
        {
            CopyfromDTO(ref Entity,A);
            context.Ammunitions.Entry(Entity).State=EntityState.Modified;

        }
        else
            return null;
        return A;
    }

    public async Task DeleteAmmoAsync(int id)
    {
        var Entity=  await context.Ammunitions.FirstOrDefaultAsync(a => a.Id==id);
        if (Entity!=null)
        {
            context.Ammunitions.Remove(Entity);
        }
        else
            throw new ArgumentException($"Illegal ID:{id} to delete");
    }

    /// <summary>
    /// Send quantity ammo from id to destination, and return the remaining batch at id
    /// </summary>
    /// <param name="id"></param>
    /// <param name="Quantity"></param>
    /// <param name="destination"></param>
    /// <returns></returns>
    public async Task<AmmunitionDTO> SendAmmo(int id, int Quantity, string destination)
    {
        var ammunition =  await context.Ammunitions.FirstOrDefaultAsync(A => A.Id==id);
        if (ammunition==null)
            throw new Exception($"No batch has id {id}");
        else
        {
            if (ammunition.status!=0)
                throw new Exception($"Can only send from batch in storage, this is {ammunition.status.ToString()}");
            //Verify that the quantity is valid
            if (ammunition.Quantity<Quantity)
            {
                throw new Exception($"Not enough ammunition in batch to ship (Has {ammunition.Quantity} trying to send {Quantity})");
            }else if (ammunition.Quantity==Quantity)
            {//Just switch the status and owner of this thing

                //Send to ourself = put in use
                if (ammunition.Location==destination)
                    ammunition.status=Ammunition.Status.Use;
                else
                    ammunition.status=Ammunition.Status.Transit;
                ammunition.Location=destination;
            }
            else//Send delivery and keep  original as smaller
            {
                //Copy all basic stats, but fix the quantity
                var delivery=new Ammunition
                {
                    //Leave Id explicitly undefined, it is going to be set to the next id
                    Quantity=Quantity,
                    Caliber =ammunition.Caliber,
                    type    = ammunition.type,
                    status  =ammunition.Location==destination ? Ammunition.Status.Use : Ammunition.Status.Transit,//Send to self=put into use
                    Guidance=ammunition.Guidance,
                    Location=destination
                };
                //Then fix the numbers, and location
                ammunition.Quantity-=Quantity;

                //Send it off
                await context.Ammunitions.AddAsync(delivery);
           }
            //Update this state
            context.Ammunitions.Entry(ammunition).State=EntityState.Modified;
            context.SaveChanges();

            //Return the original ammunition
            return toDTO(ammunition);
        }
    }
}