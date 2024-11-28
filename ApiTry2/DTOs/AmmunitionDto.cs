using ApiTry2.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiTry2.DTO;

public record AmmunitionDTO(int Id, int Quantity, int Caliber, string ShellStatus, int ShellStatusEnum, string ShellType, int ShellTypeEnum, bool Guidance,string Location);