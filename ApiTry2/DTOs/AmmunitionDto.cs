using ApiTry2.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiTry2.DTO;

public record AmmunitionDTO(int Id, int Quantity, int Caliber, string status, string type, bool Guidance);