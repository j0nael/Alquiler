using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestorVestuario.Infrastructure.Model
{
    public abstract class PersonaModel
{
    public int Id { get; set; }
    public string Nombre { get; set; }

    public abstract string ObtenerInfo();
}
    }