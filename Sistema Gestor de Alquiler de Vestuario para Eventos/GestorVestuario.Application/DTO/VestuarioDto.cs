using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestorVestuario.Application.DTO { 
public class VestuarioDto
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    public string Talla { get; set; }
    public bool Disponible { get; set; }
    public decimal Precio { get; set; }
        public string Foto { get; set; }
        public int CategoriaId { get; set; }

   
    }
}


