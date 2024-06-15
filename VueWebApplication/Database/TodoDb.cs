using Microsoft.EntityFrameworkCore;
using VueWebApplication.Database.Entities;

namespace VueWebApplication.Database;

public class TodoDb(DbContextOptions<TodoDb> options) : DbContext(options)
{
    public DbSet<Todo> Todos => Set<Todo>();
}