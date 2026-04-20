public class Vestuario
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    public string Talla { get; set; }
    public bool Disponible { get; set; }
    public decimal Precio { get; set; }

    public int CategoriaId { get; set; }
    public Categoria Categoria { get; set; }
}