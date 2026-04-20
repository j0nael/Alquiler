using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestorVestuario.Infrastructure.Model
{
    public class CategoriaModel
    {
        public int Id { get; set; }
        public string Nombre { get; set; }

        public List<VestuarioModel> Vestuarios { get; set; } = new List<VestuarioModel>();

        public CategoriaModel() { }

        public CategoriaModel(int id,string nombre)
        {
            Nombre = nombre;
            Id = id;
        }
    }
}