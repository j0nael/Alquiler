using GestorVestuario.Application.DTO;

namespace GestorVestuario.Application.Contracts
{
    public interface IAlquilerService
    {
        Task<AlquilerDto> CreateAsync(AlquilerDto dto);
        Task DeleteAsync(int id);
        Task<List<AlquilerDto>> GetAllAsync();
        Task<AlquilerDto> GetByIdAsync(int id);
    }
}