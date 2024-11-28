using Microsoft.AspNetCore.Mvc;
using ApiTry2.Models;
using TodoApi.Models;
using ApiTry2.Repositories;
using ApiTry2.DTO;

namespace ApiTry2.Controllers;

[ApiController]
[Route("Ammunition")]
public class AmmoController : ControllerBase
{
    private IAmmunitionRepository ammunitionRepository;
    public AmmoController(IAmmunitionRepository _ammunitionRepository)
    {
        ammunitionRepository=_ammunitionRepository;
    }

    /// <summary>
    /// Get ALL ammunition tracked by this system
    /// </summary>
    /// <returns>List of all ammunition and status (Always OK)</returns>
    [HttpGet("GetAll")]
    public async Task<ActionResult<IEnumerable<AmmunitionDTO>>> Get()
    {
        var List =await ammunitionRepository.GetAll();
        if (List==null || List.Count()==0)
            return NoContent();
        else
            return Ok(List);
    }

    /// <summary>
    /// Get ammunition batch with this ID
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("Get/{id}")]
    public async Task<ActionResult<AmmunitionDTO>> Get(int id)
    {
        var ammunition = await ammunitionRepository.Get(id);
        if (ammunition==null)
            return NotFound();
        else
            return Ok(ammunition);
    }

    [HttpPost("Post")]
    public async Task<ActionResult<AmmunitionDTO>> PostAmmo(AmmunitionDTO Ammo)
    {
        try
        {
            //Add it to the repository, then save
            var added = ammunitionRepository.Add(Ammo);
            //The repository doesn't save automatically, because I want to be able to make multiple changes, and only save if everything is fine
            await ammunitionRepository.SaveChanges();

            //Show the user where they can find it
            return CreatedAtAction(nameof(Get), new {id=added.Id}, added);
        }
        catch (Exception e)
        {
            //This is mainly for debugging, I do not expect an end user to be able to understand this
            return BadRequest("There was an error adding the Ammunition batch, got serverside error: "+e.Message);
        }

    }

    /// <summary>
    /// Http Update function
    /// </summary>
    /// <param name="id"></param>
    /// <param name="product"></param>
    /// <returns></returns>
    [HttpPut("Put/{id}")]
    public async Task<ActionResult<AmmunitionDTO>> PutAmmo(int id, AmmunitionDTO product)
    {
        Console.WriteLine($"Received put request: {id} {product}");

        if (id != product.Id)
        {
            Console.WriteLine($"Returned bad request : {id} {product}");
            return BadRequest();
        }
        try
        {
            //Call the repository update, and return a variety of errors if saving or finding the product failed
            var productToUpdate = await ammunitionRepository.UpdateAmmoAsync(product);
            if (productToUpdate == null)
            {
                Console.WriteLine($"Returned not found : {id} {product}");
                return NotFound();
            }
            Console.WriteLine($"awaiting saving : {id} {product}");
            await ammunitionRepository.SaveChanges();

            Console.WriteLine($"done");
            //If we got here it is ok, return that we modified this, and the destination to get it back
            return AcceptedAtAction(nameof(Get), new {id=productToUpdate.Id}, productToUpdate);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Returned error : {id} {product}");
            //This is mainly for debugging, I do not expect an end user to be able to understand this
            return BadRequest("There was an error updating the Ammunition batch, got serverside error: "+e.Message);
        }
    }

    /// <summary>
    /// Simpler put function, which only allows modifying current status
    /// </summary>
    /// <param name="id"></param>
    /// <param name="Status"></param>
    /// <returns></returns>
    [HttpPut("Put/{id}/status")]
    public async Task<ActionResult<AmmunitionDTO>> SetAmmoStatus(int id, int Status)
    {
        Console.WriteLine($"Received put request: {id}.status to {Status}");

        if (Status<0 || Status>Enum.GetValues(typeof(Ammunition.Status)).Length-1)
            return BadRequest($"Status {Status} is outside range");
        try
        {

            //Add it to the repository, then save
            var added = ammunitionRepository.Get(id);
            //The repository doesn't save automatically, because I want to be able to make multiple changes, and only save if everything is fine
            await ammunitionRepository.SaveChanges();

            //Show the user where they can find it
            return CreatedAtAction(nameof(Get), new {id=added.Id}, added);
        }
        catch (Exception e)
        {
            //This is mainly for debugging, I do not expect an end user to be able to understand this
            return BadRequest("There was an error updating the Ammunition batch, got serverside error: "+e.Message);
        }
    }

    /// <summary>
    /// Http Delete function
    /// </summary>
    /// <param name="id"></param>
    /// <param name="product"></param>
    /// <returns></returns>
    [HttpDelete("Delete/{id}")]
    public async Task<ActionResult> DeleteAmmo(int id)
    {
        try
        {
            await ammunitionRepository.DeleteAmmoAsync(id);
            await ammunitionRepository.SaveChanges();
            return Ok();
        }
        catch (Exception e)
        {
            //This is mainly for debugging, I do not expect an end user to be able to understand this
            return BadRequest("There was an error deleting the Ammunition batch, got serverside error: "+e.Message);
        }
    }
}
