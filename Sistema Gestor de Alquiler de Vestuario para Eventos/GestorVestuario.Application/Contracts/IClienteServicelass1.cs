using GestorVestuario.Application.DTO;

namespace GestorVestuario.Application.Contracts
{
    public interface IClienteService
    {
        Task<ClienteDto> CreateAsync(ClienteDto dto);
        Task DeleteAsync(int id);
        Task<List<ClienteDto>> GetAllAsync();
        Task<ClienteDto> GetByIdAsync(int id);
        Task<ClienteDto> UpdateAsync(int id, ClienteDto dto);
    }
}