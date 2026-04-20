using GestorVestuario.Application.DTO;  
using Mapster;
using GestorVestuario.Infrastructure.Interfaces;
using GestorVestuario.Infrastructure.Model;
using GestorVestuario.Application.Contracts;

namespace GestorVestuario.Application.Services
{
    public class VestuarioService: IVestuarioService
    {
        private readonly IVestuarioRepository _vestuario;

        public VestuarioService(IVestuarioRepository vestuario)
        {
            _vestuario = vestuario;
        }

        public async Task<VestuarioDto> CreateAsync(VestuarioDto dto)
        {
            var entity = dto.Adapt<VestuarioModel>();
            await _vestuario.CreateAsync(entity);
            return dto;
        }

        public async Task<List<VestuarioDto>> GetAllAsync()
        {
            var data = await _vestuario.GetAllAsync();
            return data.Adapt<List<VestuarioDto>>();
        }

        public async Task<VestuarioDto> GetByIdAsync(int id)
        {
            var entity = await _vestuario.GetByIdAsync(id);
            return entity.Adapt<VestuarioDto>();
        }

        public async Task<VestuarioDto> UpdateAsync(int id, VestuarioDto dto)
        {
            var entity = dto.Adapt<VestuarioModel>();
            await _vestuario.UpdateAsync(id, entity);
            return dto;
        }

        public async Task DeleteAsync(int id)
        {
            await _vestuario.DeleteAsync(id);
        }
    }
}