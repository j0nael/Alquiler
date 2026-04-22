using GestorVestuario.Application.DTO;
using GestorVestuario.Infrastructure.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FluentValidation.AspNetCore;
using FluentValidation;

namespace GestorVestuario.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlquilerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AlquilerController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var a = await _context.Alquileres
                .Include(x => x.Cliente)
                .Include(x => x.Vestuario)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (a == null)
                return NotFound();

            return Ok(a);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.Alquileres
                .Include(a => a.Cliente)
                .Include(a => a.Vestuario)
                .ToListAsync();

            var result = data.Select(a => new
            {
                a.Id,
                a.ClienteId,
                a.VestuarioId,                
                a.Devuelto,
                a.FechaInicio,
                a.FechaFin
            });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create( AlquilerDto dto)
        {
            var vestuario = await _context.Vestuarios.FindAsync(dto.VestuarioId);

            if (vestuario == null)
                return BadRequest("El vestuario no existe");

            if (!vestuario.Disponible)
                return BadRequest("El vestuario ya está alquilado");

            var entity = new AlquilerModel
            {
                ClienteId = dto.ClienteId,
                VestuarioId = dto.VestuarioId,
                FechaInicio = dto.FechaInicio,
                FechaFin = dto.FechaFin,
                Devuelto = false,
                
            };

            
            vestuario.Disponible = false;

            _context.Alquileres.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, AlquilerDto dto)
        {
            var entity = await _context.Alquileres.FindAsync(id);
            if (entity == null)
                return NotFound();

            entity.ClienteId = dto.ClienteId;
            entity.VestuarioId = dto.VestuarioId;
            entity.FechaInicio = dto.FechaInicio;
            entity.FechaFin = dto.FechaFin;
            entity.Devuelto = dto.Devuelto;
          

            await _context.SaveChangesAsync();

            return Ok(entity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var alquiler = await _context.Alquileres
    .Include(a => a.Vestuario)
    .FirstOrDefaultAsync(a => a.Id == id);

            if (alquiler == null)
                return NotFound();

         
            alquiler.Vestuario.Disponible = true;

            _context.Alquileres.Remove(alquiler);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
    }