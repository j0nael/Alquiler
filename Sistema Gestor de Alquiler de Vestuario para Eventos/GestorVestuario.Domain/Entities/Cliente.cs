public class Cliente : Persona
{
    public string Cedula { get; set; }

    public List<Alquiler> Alquileres { get; set; } = new List<Alquiler>();

    public Cliente() { }

    public Cliente(string nombre, string cedula)
    {
        Nombre = nombre;
        Cedula = cedula;
    }

    public override string ObtenerInfo()
    {
        return $"{Nombre} - {Cedula}";
    }
}