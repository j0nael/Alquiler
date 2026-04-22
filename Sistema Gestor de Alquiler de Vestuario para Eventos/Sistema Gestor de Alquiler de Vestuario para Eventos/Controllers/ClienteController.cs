using GestorVestuario.Application.DTO;
using GestorVestuario.Infrastructure;
using GestorVestuario.Infrastructure.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FluentValidation;

namespace GestorVestuario.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClienteController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.Clientes.ToListAsync();

            var list = data.Select(c => new ClienteDto
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Cedula = c.Cedula
            }).ToList();

            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var c = await _context.Clientes.FindAsync(id);

            if (c == null)
                return NotFound("Cliente no encontrado");

            return Ok(new ClienteDto
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Cedula = c.Cedula
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create(ClienteDto dto)
        {
           
            var entity = new ClienteModel
            {
                Nombre = dto.Nombre,
                Cedula = dto.Cedula
            };

            _context.Clientes.Add(entity);
            await _context.SaveChangesAsync();

            return Ok(dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ClienteDto dto)
        {
            dto.Id = id; 
            var entity = await _context.Clientes.FindAsync(id);

            if (entity == null)
                return NotFound("Cliente no encontrado");

            entity.Nombre = dto.Nombre;
            entity.Cedula = dto.Cedula;

            
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.Clientes
                .Include(x => x.Alquileres)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return NotFound("Cliente no encontrado");

            if (entity.Alquileres != null && entity.Alquileres.Any())
                return BadRequest("No se puede eliminar, tiene alquileres");

            _context.Clientes.Remove(entity);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}