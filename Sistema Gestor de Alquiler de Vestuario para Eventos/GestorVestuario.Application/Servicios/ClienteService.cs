using GestorVestuario.Application.DTO;
using Mapster;
using GestorVestuario.Application.Contracts;
using GestorVestuario.Infrastructure.Model;
using GestorVestuario.Infrastructure.Model;
using GestorVestuario.Infrastructure.Interfaces;
namespace GestorVestuario.Application.Servicios
{
    public class ClienteService: IClienteService
    {
        private readonly IClienteRepository _cliente;

        public ClienteService(IClienteRepository cliente)
        {
            _cliente = cliente;
        }

        public async Task<ClienteDto> CreateAsync(ClienteDto dto)
        {
            var cliente = dto.Adapt<ClienteModel>();
            await _cliente.CreateAsync(cliente);
            return dto;
        }

        public async Task<List<ClienteDto>> GetAllAsync()
        {
            var clientes = await _cliente.GetAllAsync();
            return clientes.Adapt<List<ClienteDto>>();
        }

        public async Task<ClienteDto> GetByIdAsync(int id)
        {
            var cliente = await _cliente.GetByIdAsync(id);
            return cliente.Adapt<ClienteDto>();
        }

        public async Task<ClienteDto> UpdateAsync(int id, ClienteDto dto)
        {
            var cliente = dto.Adapt<ClienteModel>();
            await _cliente.UpdateAsync(id, cliente);
            return dto;
        }

        public async Task DeleteAsync(int id)
        {
            await _cliente.DeleteAsync(id);
        }
    }
}