using GestorVestuario.Application.Contracts;
using GestorVestuario.Infrastructure.Model;
using GestorVestuario.Application.DTO;
using Mapster;
using GestorVestuario.Infrastructure.Interfaces;

namespace GestorVestuario.Application.Services
{
    public class CategoriaService: ICategoriaService
    {
        private readonly ICategoriaRepository _categoria;

        public CategoriaService(ICategoriaRepository categoria)
        {
            _categoria = categoria;
        }

        public async Task<CategoriaDTO> CreateAsync(CategoriaDTO dto)
        {
            var entity = dto.Adapt<CategoriaModel>();
            await _categoria.CreateAsync(entity);
            return dto;
        }

        public async Task<List<CategoriaDTO>> GetAllAsync()
        {
            var data = await _categoria.GetAllAsync();
            return data.Adapt<List<CategoriaDTO>>();
        }

        public async Task<CategoriaDTO> GetByIdAsync(int id)
        {
            var entity = await _categoria.GetByIdAsync(id);
            return entity.Adapt<CategoriaDTO>();
        }

        public async Task<CategoriaDTO> UpdateAsync(int id, CategoriaDTO dto)
        {
            var entity = dto.Adapt<CategoriaModel>();
            await _categoria.UpdateAsync(id, entity);
            return dto;
        }

        public async Task DeleteAsync(int id)
        {
            await _categoria.DeleteAsync(id);
        }
    }
}