using FluentValidation;
using GestorVestuario.Infrastructure.Model;
using GestorVestuario.Application.DTO;

namespace GestorVestuario.Application.Validation
{
    public class ValidationCategoria : AbstractValidator<CategoriaDTO>
    {
        private readonly AppDbContext _context;

        public ValidationCategoria(AppDbContext context)
        {
            _context = context;

            RuleFor(c => c.Nombre)
      .NotEmpty().WithMessage("El nombre es obligatorio.")
      .MaximumLength(100).WithMessage("Máximo 100 caracteres.")
      .Must(nombre => !_context.Categorias.Any(x => x.Nombre == nombre))
      .WithMessage("La categoría ya existe.");
        }
    }
}