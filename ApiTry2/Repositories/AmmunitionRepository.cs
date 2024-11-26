using Microsoft.EntityFrameworkCore;
using ApiTry2.Models;
using ApiTry2.DTO;
using TodoApi.Models;


namespace ApiTry2.Repositories;

public interface IAmmunitionRepository
{
    public Task<IEnumerable<AmmunitionDTO>> GetAll();
}

class AmmunitionRepository : IAmmunitionRepository
{
    private readonly AmmunitionContext context;
    public AmmunitionRepository(AmmunitionContext _context)
    {
        context=_context;
    }

    public async Task<IEnumerable<AmmunitionDTO>> GetAll()
    {
        return await context.Ammunitions.Select(A => new AmmunitionDTO(A.Id,A.Quantity,A.Caliber,A.status.ToString(),A.type.ToString(),A.Guidance)).ToListAsync();
    }
}