namespace TarkovMapWebsite;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        // Db
        //builder.Services.AddDbContext<TodoDb>(opt => opt.UseInMemoryDatabase("TodoDb"));
        
        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        
        // Spa setup
        builder.Services.AddSpaStaticFiles(config =>
        {
            config.RootPath = "ClientApp/dist";
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        // #region Todos minimal api
        //
        // // Todos minimal API
        // app.MapGet("/api/todoitems", async (TodoDb db) => await db.Todos.ToListAsync());
        // app.MapGet("/api/todoitems/complete", async (TodoDb db) => await db.Todos.Where(x => x.IsComplete).ToListAsync());
        // app.MapGet("/api/todoitems/{id}", async (int id, TodoDb db) => await db.Todos.FindAsync(id) is Todo todo
        //     ? Results.Ok(todo)
        //     : Results.NotFound());
        // app.MapPost("/api/todoitems", async (Todo todo, TodoDb db) =>
        // {
        //     // Check if todo item already exists with the same name
        //     if (await db.Todos.AnyAsync(x => x.Name == todo.Name))
        //     {
        //         return Results.Conflict(new { message = "Todo item with the same name already exists" });
        //     }
        //     
        //     db.Todos.Add(todo);
        //     await db.SaveChangesAsync();
        //     return Results.Created($"/todoitems/{todo.Id}", todo);
        // });
        //
        // app.MapPut("/api/todoitems/{id}", async (int id, Todo inputTodo, TodoDb db) =>
        // {
        //     var todo = await db.Todos.FindAsync(id);
        //
        //     if (todo is null) return Results.NotFound();
        //
        //     todo.Name = inputTodo.Name;
        //     todo.IsComplete = inputTodo.IsComplete;
        //
        //     await db.SaveChangesAsync();
        //
        //     return Results.NoContent();
        // });
        //
        // app.MapDelete("/api/todoitems/{id}", async (int id, TodoDb db) =>
        // {
        //     if (await db.Todos.FindAsync(id) is Todo todo)
        //     {
        //         db.Todos.Remove(todo);
        //         await db.SaveChangesAsync();
        //         return Results.NoContent();
        //     }
        //
        //     return Results.NotFound();
        // });
        //
        // #endregion

        app.UseSpaStaticFiles();
        
        app.MapWhen(x => x.Request.Path.Value.StartsWith("/api") == false, builder =>
        {
            builder.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                
                if (app.Environment.IsDevelopment())
                {
                    spa.UseProxyToSpaDevelopmentServer("https://localhost:5173/");
                }
            });
        });
        
        app.Run();
    }
}