using GestorVestuario.Infrastructure.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GestorVestuario.Infrastructure.Model;
using GestorVestuario.Infrastructure.Interfaces;

namespace GestorVestuario.Infrastructure.REPOSITORIOS
{ 
  public class AlquilerRepositorie : Baserepositorie<AlquilerModel>,IAlquilerRepository

    {

    public AlquilerRepositorie(AppDbContext contex) : base(contex)
    {

    }

}
    }