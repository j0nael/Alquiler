using FluentValidation;
using GestorVestuario.Infrastructure;
using GestorVestuario.Infrastructure.Model;
using GestorVestuario.Application.DTO;

namespace GestorVestuario.Application.Validation
{
    public class ValidationVestuario : AbstractValidator<VestuarioDto>
    {
        private readonly AppDbContext _context;

        public ValidationVestuario(AppDbContext context)
        {
            _context = context;

            RuleFor(v => v.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(200);

            RuleFor(v => v.Talla)
                .NotEmpty().WithMessage("La talla es obligatoria.");

            RuleFor(v => v.Precio)
                .GreaterThan(0).WithMessage("El precio debe ser mayor a 0.");

            RuleFor(v => v.CategoriaId)
      .GreaterThan(0).WithMessage("Debe seleccionar una categoría válida.")
      .Must(id => _context.Categorias.Any(c => c.Id == id))
      .WithMessage("La categoría no existe.");


        }
    }
}