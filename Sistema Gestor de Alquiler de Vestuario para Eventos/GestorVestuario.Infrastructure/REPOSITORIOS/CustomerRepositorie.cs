using GestorVestuario.Infrastructure.Core;
using GestorVestuario.Infrastructure.Model;
using GestorVestuario.Infrastructure.Interfaces;    
namespace GestorVestuario.Infrastructure.REPOSITORIOS
{
    public class CustomerRepositorie : Baserepositorie<ClienteModel>,IClienteRepository

    {

        public CustomerRepositorie(AppDbContext contex) : base(contex)
        {

        }

    }
}