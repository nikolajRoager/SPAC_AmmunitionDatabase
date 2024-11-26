using ApiTry2.Models;
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;

public class AmmunitionContext : DbContext
{
    public AmmunitionContext(DbContextOptions<AmmunitionContext> options)
        : base(options)
    {
    }

    public DbSet<Ammunition> Ammunitions{ get; set; } = null!;
}