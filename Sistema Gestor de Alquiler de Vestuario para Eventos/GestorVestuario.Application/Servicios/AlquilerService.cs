using System;
using Mapster;
using GestorVestuario.Application.DTO;
using GestorVestuario.Infrastructure.Interfaces;
using GestorVestuario.Infrastructure.Model;
using GestorVestuario.Application.Contracts;
namespace GestorVestuario.Application.Services
{
    public class AlquilerService: IAlquilerService
    {
        private readonly IAlquilerRepository _alquiler;
        private readonly IVestuarioRepository _vestuario;

        public AlquilerService(IAlquilerRepository alquiler, IVestuarioRepository vestuario)
        {
            _alquiler = alquiler;
            _vestuario = vestuario;
        }

        public async Task<AlquilerDto> CreateAsync(AlquilerDto dto)
        {
            var vestuario = await _vestuario.GetByIdAsync(dto.VestuarioId);

            if (!vestuario.Disponible)
                throw new Exception("El vestuario no está disponible");

            vestuario.Disponible = false;
            await _vestuario.UpdateAsync(vestuario.Id, vestuario);

            var entity = dto.Adapt<AlquilerModel>();
            await _alquiler.CreateAsync(entity);

            return dto;
        }

        public async Task<List<AlquilerDto>> GetAllAsync()
        {
            var data = await _alquiler.GetAllAsync();
            return data.Adapt<List<AlquilerDto>>();
        }

        public async Task<AlquilerDto> GetByIdAsync(int id)
        {
            var entity = await _alquiler.GetByIdAsync(id);
            return entity.Adapt<AlquilerDto>();
        }

        public async Task<AlquilerDto> UpdateAsync(int id, AlquilerDto dto)
        {
            var existing = await _alquiler.GetByIdAsync(id);
            if (existing == null)
                throw new Exception("Alquiler no encontrado");
            var vestuario = await _vestuario.GetByIdAsync(dto.VestuarioId);
            if (!vestuario.Disponible && vestuario.Id != existing.VestuarioId)
                throw new Exception("El vestuario no está disponible");
            if (existing.VestuarioId != dto.VestuarioId)
            {
                var oldVestuario = await _vestuario.GetByIdAsync(existing.VestuarioId);
                oldVestuario.Disponible = true;
                await _vestuario.UpdateAsync(oldVestuario.Id, oldVestuario);
                vestuario.Disponible = false;
                await _vestuario.UpdateAsync(vestuario.Id, vestuario);
            }
            var entity = dto.Adapt<AlquilerModel>();
            await _alquiler.UpdateAsync(id, entity);
            return dto;
        }
        public async Task DeleteAsync(int id)
        {
            await _alquiler.DeleteAsync(id);
        }
    }
}