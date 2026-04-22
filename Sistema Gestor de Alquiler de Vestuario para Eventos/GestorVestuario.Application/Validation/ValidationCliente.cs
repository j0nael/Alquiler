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

            // 🔹 Nombre
            RuleFor(c => c.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(150).WithMessage("Máximo 150 caracteres.");

            // 🔹 Cédula (validaciones básicas)
            RuleFor(c => c.Cedula)
                .NotEmpty().WithMessage("La cédula es obligatoria.")
                .Length(11).WithMessage("Debe tener 11 caracteres.");

            // 🔥 VALIDACIÓN INTELIGENTE (CREATE vs UPDATE)
            RuleFor(c => c.Cedula)
    .Must((dto, cedula) =>
    {
        if (dto.Id == 0)
        {
            return !_context.Clientes
                .Any(x => x.Cedula == cedula);
        }

        return !_context.Clientes
            .Any(x => x.Cedula == cedula && x.Id != dto.Id);
    })
    .WithMessage("La cédula ya existe.");
        }
    }
}