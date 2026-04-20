using GestorVestuario.Application.DTO;
using GestorVestuario.Infrastructure;
using GestorVestuario.Infrastructure.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestorVestuario.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriaController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.Categorias.ToListAsync();

            var list = data.Select(c => new CategoriaDTO
            {
                Id = c.Id,
                Nombre = c.Nombre
            }).ToList();

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CategoriaDTO dto)
        {
            var entity = new CategoriaModel
            {
                Nombre = dto.Nombre
            };

            _context.Categorias.Add(entity);
            await _context.SaveChangesAsync();

            return Ok(dto);
        }
        [HttpPut]
        public async Task<IActionResult> Update(int id, CategoriaDTO dto)
        {
            var entity = await _context.Categorias.FindAsync(id);
            if (entity == null)
                return NotFound("Categoría no encontrada");
            entity.Nombre = dto.Nombre;
            await _context.SaveChangesAsync();
            return Ok(dto);
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.Categorias.FindAsync(id);
            if (entity == null)
                return NotFound("Categoría no encontrada");
            _context.Categorias.Remove(entity);
            await _context.SaveChangesAsync();
            return Ok("Categoría eliminada");
        }
}
    }