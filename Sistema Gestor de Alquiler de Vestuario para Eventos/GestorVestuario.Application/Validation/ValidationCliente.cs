using FluentValidation;
using GestorVestuario.Application.DTO;
using GestorVestuario.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace GestorVestuario.Application.Validation
{
    public class ValidationCliente : AbstractValidator<ClienteDto>
    {
        private readonly AppDbContext _context;

        public ValidationCliente(AppDbContext context)
        {
            _context = context;

            RuleFor(c => c.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(150).WithMessage("Máximo 150 caracteres.");

            RuleFor(c => c.Cedula)
                .NotEmpty().WithMessage("La cédula es obligatoria.")
                .Length(11).WithMessage("Debe tener 11 caracteres.");

            RuleFor(c => c.Cedula)
    .Must(cedula =>
    {
        return !_context.Clientes.Any(x => x.Cedula == cedula);
    })
    .WithMessage("La cédula ya existe.");
        }
    }
}