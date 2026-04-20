using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestorVestuario.Infrastructure.Model
{
    public class VestuarioModel
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Talla { get; set; }
        public bool Disponible { get; set; }
        public decimal Precio { get; set; }

        public int CategoriaId { get; set; }
        public CategoriaModel Categoria { get; set; }

        public VestuarioModel() { }

        public VestuarioModel(int id, string nombre, string talla, bool disponible, decimal precio, int categoriaId)
        {
            Id = id;
            Nombre = nombre;
            Talla = talla;
            Disponible = disponible;
            Precio = precio;
            CategoriaId = categoriaId;
        }
    }

}