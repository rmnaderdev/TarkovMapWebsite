using Microsoft.EntityFrameworkCore;
using TarkovMapWebsite.Database.Entities;

namespace TarkovMapWebsite.Database;

public class TodoDb(DbContextOptions<TodoDb> options) : DbContext(options)
{
    public DbSet<Todo> Todos => Set<Todo>();
}