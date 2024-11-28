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
}