public class Categoria
{
    public int Id { get; set; }
    public string Nombre { get; set; }

    public List<Vestuario> Vestuarios { get; set; } = new List<Vestuario>();
}