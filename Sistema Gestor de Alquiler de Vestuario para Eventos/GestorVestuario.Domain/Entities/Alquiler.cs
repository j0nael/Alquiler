public class Alquiler
{
    public int Id { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public bool Devuelto { get; set; }
    public decimal Penalidad { get; set; }

    public int ClienteId { get; set; }
    public Cliente Cliente { get; set; }

    public int VestuarioId { get; set; }
    public Vestuario Vestuario { get; set; }

    public Alquiler() { }

    public Alquiler(int clienteId, int vestuarioId, DateTime fechaFin)
    {
        ClienteId = clienteId;
        VestuarioId = vestuarioId;
        FechaInicio = DateTime.Now;
        FechaFin = fechaFin;
    }
}