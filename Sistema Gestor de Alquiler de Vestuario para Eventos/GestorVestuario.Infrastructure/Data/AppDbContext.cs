using Microsoft.EntityFrameworkCore;
using GestorVestuario.Infrastructure.Model;

public class AppDbContext : DbContext
{
    public DbSet<ClienteModel> Clientes { get; set; }
    public DbSet<VestuarioModel> Vestuarios { get; set; }
    public DbSet<CategoriaModel> Categorias { get; set; }
    public DbSet<AlquilerModel> Alquileres { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ClienteModel>()
            .HasMany(c => c.Alquileres)
            .WithOne(a => a.Cliente)
            .HasForeignKey(a => a.ClienteId);

        modelBuilder.Entity<CategoriaModel>()
            .HasMany(c => c.Vestuarios)
            .WithOne(v => v.Categoria)
            .HasForeignKey(v => v.CategoriaId);
    }
}