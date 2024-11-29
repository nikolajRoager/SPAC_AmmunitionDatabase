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
        Console.WriteLine("Get");
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
        Console.WriteLine("post");
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
        Console.WriteLine("put");

        if (id != product.Id)
        {
            return BadRequest();
        }
        try
        {
            //Call the repository update, and return a variety of errors if saving or finding the product failed
            var productToUpdate = await ammunitionRepository.UpdateAmmoAsync(product);
            if (productToUpdate == null)
            {
                return NotFound();
            }
            await ammunitionRepository.SaveChanges();

            //If we got here it is ok, return that we modified this, and the destination to get it back
            return AcceptedAtAction(nameof(Get), new {id=productToUpdate.Id}, productToUpdate);
        }
        catch (Exception e)
        {
            //This is mainly for debugging, I do not expect an end user to be able to understand this
            return BadRequest("There was an error updating the Ammunition batch, got serverside error: "+e.Message);
        }
    }


    /// <summary>
    /// Create a new shipment batch, by splitting it of from batch id, and sending it to the destination
    /// </summary>
    /// <param name="id"></param>
    /// <param name="Quantity"></param>
    /// <param name="destination"></param>
    /// <returns></returns>
    [HttpPut("Send/{id}")]
    public async Task<ActionResult<AmmunitionDTO>> SendAmmo(int id, [FromQuery] int Quantity, [FromQuery] string destination)
    {
        Console.WriteLine($"received send from {id}, sending: {Quantity}, {destination} ");
        AmmunitionDTO Out;
        try
        {
            Out=await ammunitionRepository.SendAmmo(id,Quantity,destination);
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            //This is mainly for debugging, I do not expect an end user to be able to understand this
            return BadRequest(e.Message);
        }
        return Out;
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
