using GestorVestuario.Application.DTO;


namespace GestorVestuario.Application.Contracts
{
    public interface IVestuarioService
    {
        Task<VestuarioDto> CreateAsync(VestuarioDto dto);
        Task DeleteAsync(int id);
        Task<List<VestuarioDto>> GetAllAsync();
        Task<VestuarioDto> GetByIdAsync(int id);
        Task<VestuarioDto> UpdateAsync(int id, VestuarioDto dto);
    }
}