using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestorVestuario.Infrastructure.Model
{
    public class AlquilerModel
    {
        public int Id { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public bool Devuelto { get; set; }
        public decimal Penalidad { get; set; }

        public int ClienteId { get; set; }
        public ClienteModel Cliente { get; set; }

        public int VestuarioId { get; set; }
        public VestuarioModel Vestuario { get; set; }

        public AlquilerModel() { }

        public AlquilerModel(int clienteId, int vestuarioId, DateTime fechaFin)
        {
            ClienteId = clienteId;
            VestuarioId = vestuarioId;
            FechaInicio = DateTime.Now;
            FechaFin = fechaFin;
        }
    }

}