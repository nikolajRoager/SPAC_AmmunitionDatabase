using Microsoft.EntityFrameworkCore;
using ApiTry2.Models;
using TodoApi.Models;
using ApiTry2.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddDbContext<AmmunitionContext>(opt =>
    opt.UseInMemoryDatabase("Ammunition"));
builder.Services.AddScoped<IAmmunitionRepository,AmmunitionRepository>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

//TESTING Allow our testing site to access this
//SHOULD BE REPLACED WITH ACTUAL SITE
app.UseCors("http://localhost:3000");

//// Initialize database from a file FOR TESTING ONLY!
//// WARNING, THIS DELETES THE EXISTING DATABASE TABLES! DO NOT USE UNLESS YOU WANT TO DELETE ALL DATA
///
//IDK if this is the best way of seeding a database
using (var scope = app.Services.CreateScope())
{

    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AmmunitionContext>();



        //Some quick example data, the depot locations are Cities (I do not know the actual locations of depots, obviously)
        //The Brigades are the 5 artillery brigades in the Ukrainian Army
        string[] Locs               = {"Kharkiv","Sumy","Dnipro","Kryvyi Rih","26th Brigade","43rd Brigade","44th Brigade","55th Brigade"};
        Ammunition.Status[] statuses= {Ammunition.Status.Depot,Ammunition.Status.Depot,Ammunition.Status.Depot,Ammunition.Status.Depot,Ammunition.Status.Use,Ammunition.Status.Use,Ammunition.Status.Use,Ammunition.Status.Use,Ammunition.Status.Use
        };
        int[] Sizes = {1500000,500000,800000,600000,//Sizes of depots
        10000,20000,15000,17000,14000};//Stocks of the brigades

        for (int i = 0; i < Locs.Count(); ++i)
        {
            //Some example ammunition types:
            //Excalibur (famously overpriced and unreliable)
            context.Ammunitions.Add( new Ammunition {
                Id=context.Ammunitions.Count(),
                Quantity=(int)(Sizes[i]*0.004),//Overpriced means that there is not a lot of this
                Caliber=155,
                type = Ammunition.Type.HE,
                status=Ammunition.Status.Depot,
                Guidance=true,
                Location=Locs[i]
            });
            //Western AP shells, somewhat common
            context.Ammunitions.Add( new Ammunition {
                Id=context.Ammunitions.Count(),
                Quantity=(int)(Sizes[i]*0.146),
                Caliber=155,
                type = Ammunition.Type.AP,
                status=Ammunition.Status.Depot,
                Guidance=false,
                Location=Locs[i]
            });
            //Standard western high explosive, very common
            context.Ammunitions.Add( new Ammunition {
                Id=context.Ammunitions.Count(),
                Quantity=(int)(Sizes[i]*0.20),
                Caliber=155,
                type = Ammunition.Type.HE,
                status=Ammunition.Status.Depot,
                Guidance=false,
                Location=Locs[i]
            });
            context.Ammunitions.Add( new Ammunition {
                Id=context.Ammunitions.Count(),
                Quantity=(int)(Sizes[i]*0.25),
                Caliber=152,
                type = Ammunition.Type.Cluster,
                status=Ammunition.Status.Depot,
                Guidance=false,
                Location=Locs[i]
            });
            //Standard Soviet HE shell VERY common
            context.Ammunitions.Add( new Ammunition {
                Id=context.Ammunitions.Count(),
                Quantity=(int)(Sizes[i]*0.4),
                Caliber=152,
                type = Ammunition.Type.HE,
                status=Ammunition.Status.Depot,
                Guidance=false,
                Location=Locs[i]
            });
            //Very heavy Soviet shell
            context.Ammunitions.Add( new Ammunition {
                Id=context.Ammunitions.Count(),
                Quantity=(int)(Sizes[i]*0.05),
                Caliber=203,
                type = Ammunition.Type.HE,
                status=Ammunition.Status.Depot,
                Guidance=false,
                Location=Locs[i]
            });
            //Soviet AP shells
            context.Ammunitions.Add( new Ammunition {
                Id=context.Ammunitions.Count(),
                Quantity=(int)(Sizes[i]*0.1),
                Caliber=100,
                type = Ammunition.Type.HE,
                status=Ammunition.Status.Depot,
                Guidance=false,
                Location=Locs[i]
            });

        }
        context.SaveChanges();
    }
    catch (Exception e)
    {
        Console.WriteLine("error while seeding context");
        Console.WriteLine(e.Message);
        return;
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
