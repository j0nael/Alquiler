using GestorVestuario.Application.DTO;
using GestorVestuario.Infrastructure;
using GestorVestuario.Infrastructure.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestorVestuario.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VestuarioController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VestuarioController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.Vestuarios.Include(v => v.Categoria).ToListAsync();

            var list = data.Select(v => new VestuarioDto
            {
                Id = v.Id,
                Nombre = v.Nombre,
                Talla = v.Talla,
                CategoriaId = v.CategoriaId,
                Disponible = v.Disponible,
                Precio = v.Precio,
                Foto = v.Foto

            }).ToList();

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Create(VestuarioDto dto)
        {
            var entity = new VestuarioModel
            {
                Nombre = dto.Nombre,
                Talla = dto.Talla,
                CategoriaId = dto.CategoriaId,
                Disponible = dto.Disponible,
                Precio = dto.Precio,
                Foto = dto.Foto
            };

            _context.Vestuarios.Add(entity);
            await _context.SaveChangesAsync();

            return Ok(dto);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, VestuarioDto dto)
        {
            var entity = await _context.Vestuarios.FindAsync(id);
            if (entity == null)
                return NotFound();

            entity.Nombre = dto.Nombre;
            entity.Talla = dto.Talla;
            entity.CategoriaId = dto.CategoriaId;
            entity.Disponible = dto.Disponible;
            entity.Precio = dto.Precio;
            entity.Foto = dto.Foto;

            await _context.SaveChangesAsync();

            return Ok(entity);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.Vestuarios.FindAsync(id);
            if (entity == null)
                return NotFound();
            _context.Vestuarios.Remove(entity);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
    }