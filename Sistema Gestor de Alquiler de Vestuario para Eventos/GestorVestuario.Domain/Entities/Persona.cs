public abstract class Persona
{
    public int Id { get; set; }
    public string Nombre { get; set; }

    public abstract string ObtenerInfo();
}