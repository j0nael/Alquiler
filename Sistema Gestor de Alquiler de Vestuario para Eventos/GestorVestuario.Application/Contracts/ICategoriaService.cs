using GestorVestuario.Application.DTO;

namespace GestorVestuario.Application.Contracts
{
    public interface ICategoriaService
    {
        Task<CategoriaDTO> CreateAsync(CategoriaDTO dto);
        Task DeleteAsync(int id);
        Task<List<CategoriaDTO>> GetAllAsync();
        Task<CategoriaDTO> GetByIdAsync(int id);
        Task<CategoriaDTO> UpdateAsync(int id, CategoriaDTO dto);
    }
}