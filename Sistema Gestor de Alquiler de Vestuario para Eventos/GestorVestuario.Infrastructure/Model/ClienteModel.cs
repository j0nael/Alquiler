using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestorVestuario.Infrastructure.Model
{
    public class ClienteModel : PersonaModel
    {
        public string Cedula { get; set; }

        public List<AlquilerModel> Alquileres { get; set; } = new List<AlquilerModel>();

        public ClienteModel() { }

        public ClienteModel(string nombre, string cedula)
        {
            Nombre = nombre;
            Cedula = cedula;
        }

        public override string ObtenerInfo()
        {
            return $"{Nombre} - {Cedula}";
        }
    }
}
 