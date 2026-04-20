using FluentValidation;
using FluentValidation.AspNetCore;
using GestorVestuario.Application.Contracts;
using GestorVestuario.Application.Services;
using GestorVestuario.Application.Servicios;
using GestorVestuario.Application.Validation;
using GestorVestuario.Infrastructure.Interfaces;
using GestorVestuario.Infrastructure.REPOSITORIOS;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// 📦 DATABASE (SQL SERVER)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 📦 CONTROLLERS
builder.Services.AddControllers();

// 📦 SWAGGER
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 📦 FLUENT VALIDATION

builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddValidatorsFromAssemblyContaining<ValidationCliente>();
builder.Services.AddValidatorsFromAssemblyContaining<ValidationCategoria>();
builder.Services.AddValidatorsFromAssemblyContaining<ValidationVestuario>();
builder.Services.AddValidatorsFromAssemblyContaining<ValidationAlquiler>();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

// 📦 DEPENDENCY INJECTION - SERVICES
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<IVestuarioService, VestuarioService>();
builder.Services.AddScoped<ICategoriaService, CategoriaService>();
builder.Services.AddScoped<IAlquilerService, AlquilerService>();

// 📦 DEPENDENCY INJECTION - REPOSITORIES
builder.Services.AddScoped<IClienteRepository, CustomerRepositorie>();
builder.Services.AddScoped<IVestuarioRepository, VestuarioRepositorie>();
builder.Services.AddScoped<ICategoriaRepository, CategotiaRepositorie>();
builder.Services.AddScoped<IAlquilerRepository, AlquilerRepositorie>();

var app = builder.Build();

// 📦 SWAGGER UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

// 🔐 HTTPS
app.UseHttpsRedirection();

// 📦 ROUTING
app.MapControllers();

app.Run();