using FluentValidation;
using GestorVestuario.Application.DTO;
using GestorVestuario.Infrastructure;

namespace GestorVestuario.Application.Validation
{
    public class ValidationAlquiler : AbstractValidator<AlquilerDto>
    {
        private readonly AppDbContext _context;

        public ValidationAlquiler(AppDbContext context)
        {
            _context = context;

            
            RuleFor(a => a.FechaInicio)
                .NotEmpty().WithMessage("La fecha de inicio es obligatoria.")
                .GreaterThanOrEqualTo(DateTime.Today)
                .WithMessage("La fecha de inicio no puede ser pasada.");

           
            RuleFor(a => a.FechaFin)
                .NotEmpty().WithMessage("La fecha de fin es obligatoria.")
                .GreaterThan(a => a.FechaInicio)
                .WithMessage("La fecha de fin debe ser mayor que la fecha de inicio.");

            
       

            
            RuleFor(a => a.ClienteId)
                .GreaterThan(0).WithMessage("Debe seleccionar un cliente válido.")
                .Must(id => _context.Clientes.Any(c => c.Id == id))
                .WithMessage("El cliente no existe.");

            RuleFor(a => a.VestuarioId)
                .GreaterThan(0).WithMessage("Debe seleccionar un vestuario válido.")
                .Must(id => _context.Vestuarios.Any(v => v.Id == id))
                .WithMessage("El vestuario no existe.");

           
            RuleFor(a => a.Devuelto)
                .NotNull().WithMessage("Debe indicar si fue devuelto.");
        }
    }
}