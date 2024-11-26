using Microsoft.AspNetCore.Mvc;
using ApiTry2.Models;
using TodoApi.Models;
using ApiTry2.Repositories;
using ApiTry2.DTO;

namespace ApiTry2.Controllers;

[ApiController]
[Route("[controller]")]
public class AmmoControler : ControllerBase
{
    private IAmmunitionRepository ammunitionRepository;
    public AmmoControler(IAmmunitionRepository _ammunitionRepository)
    {
        ammunitionRepository=_ammunitionRepository;
    }

    /// <summary>
    /// Get ALL ammunition tracked by this system
    /// </summary>
    /// <returns>List of all ammunition and status (Always OK)</returns>
    [HttpGet("All")]
    public async Task<IEnumerable<AmmunitionDTO>> Get()
    {
        return await ammunitionRepository.GetAll();
    }
}
