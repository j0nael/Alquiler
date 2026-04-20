using GestorVestuario.Infrastructure.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestorVestuario.Application.DTO
{
    public class AlquilerDto
{
        public int Id { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public bool Devuelto { get; set; }
        public decimal Penalidad { get; set; }

        public int ClienteId { get; set; }

        public int VestuarioId { get; set; }

        
        }


    }

