const api = "https://localhost:5001/api";

function mostrarSeccion(id) {
    document.querySelectorAll(".seccion").forEach(s => s.classList.add("oculto"));
    document.getElementById(id).classList.remove("oculto");
}

function mostrarForm(id) {
    document.getElementById(id).classList.remove("oculto");

    if (id === "formVestuario") {
        cargarCategorias(); // 🔥 aquí cargas el select
    }
}
/* ================= CLIENTES ================= */
async function listarClientes() {
    const res = await fetch(`${api}/Cliente`);
    const data = await res.json();

    const lista = document.getElementById("listaClientes");
    lista.innerHTML = "";

    data.forEach(c => {
        lista.innerHTML += `
        <li>
            ${c.nombre} - ${c.cedula}
            <button onclick="editarCliente(${c.id}, '${c.nombre}','${c.cedula}')">Editar</button>
            <button onclick="eliminarCliente(${c.id})">Eliminar</button>
        </li>`;
    });
}

function editarCliente(id, nombre, cedula) {
    mostrarForm("formCliente");
    clienteId.value = id;
    nombre.value = nombre;
    cedula.value = cedula;
}

async function guardarCliente() {
    const id = clienteId.value;
    const data = { nombre: nombre.value, cedula: cedula.value };

    let res = id
        ? await fetch(`${api}/Cliente/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        : await fetch(`${api}/Cliente`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

    if (!res.ok) { mostrarErrores(await res.json()); return; }

    limpiar();
    listarClientes();
}

async function eliminarCliente(id) {
    await fetch(`${api}/Cliente/${id}`, { method: "DELETE" });
    listarClientes();
}

/* ================= CATEGORIA ================= */
async function listarCategorias() {
    const res = await fetch(`${api}/Categoria`);
    const data = await res.json();

    listaCategorias.innerHTML = "";
    data.forEach(c => {
        listaCategorias.innerHTML += `
        <li>
            ${c.nombre}
            <button onclick="editarCategoria(${c.id},'${c.nombre}')">Editar</button>
            <button onclick="eliminarCategoria(${c.id})">Eliminar</button>
        </li>`;
    });
}

function editarCategoria(id, nombre) {
    mostrarForm("formCategoria");
    categoriaId.value = id;
    nombreCategoria.value = nombre;
}

async function guardarCategoria() {
    const id = categoriaId.value;
    const data = { nombre: nombreCategoria.value };

    let res = id
        ? await fetch(`${api}/Categoria/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        : await fetch(`${api}/Categoria`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

    if (!res.ok) { mostrarErrores(await res.json()); return; }

    limpiar();
    listarCategorias();
}

async function eliminarCategoria(id) {
    await fetch(`${api}/Categoria/${id}`, { method: "DELETE" });
    listarCategorias();
}

/* ================= VESTUARIO ================= */
async function listarVestuarios() {
    const res = await fetch(`${api}/Vestuario`);
    const data = await res.json();

    listaVestuarios.innerHTML = "";
    data.forEach(v => {
        listaVestuarios.innerHTML += `
        <li>
            ${v.nombre} - ${v.talla}
            <button onclick="editarVestuario(${v.id},'${v.nombre}','${v.talla}',${v.precio},${v.categoriaId})">Editar</button>
            <button onclick="eliminarVestuario(${v.id})">Eliminar</button>
        </li>`;
    });
}

async function cargarCategorias() {
    try {
        const res = await fetch(`${api}/Categoria`);
        const data = await res.json();

        const select = document.getElementById("categoriaSelect");
        select.innerHTML = "";

        // opción por defecto
        select.innerHTML += `<option value="">Seleccione una categoría</option>`;

        data.forEach(c => {
            select.innerHTML += `
                <option value="${c.id}">
                    ${c.nombre}
                </option>`;
        });

    } catch (error) {
        console.error("Error cargando categorías:", error);
        alert("Error al cargar categorías");
    }
}

function editarVestuario(id, nombre, talla, precio, categoriaId) {
    mostrarForm("formVestuario");
    vestuarioId.value = id;
    nombreVestuario.value = nombre;
    talla.value = talla;
    precio.value = precio;
    categoriaSelect.value = categoriaId;
}

async function guardarVestuario() {
    const id = vestuarioId.value;
    const data = {
        nombre: nombreVestuario.value,
        talla: talla.value,
        precio: parseFloat(precio.value),
        categoriaId: parseInt(categoriaSelect.value)
    };

    let res = id
        ? await fetch(`${api}/Vestuario/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        : await fetch(`${api}/Vestuario`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

    if (!res.ok) { mostrarErrores(await res.json()); return; }

    limpiar();
    listarVestuarios();
}

async function eliminarVestuario(id) {
    await fetch(`${api}/Vestuario/${id}`, { method: "DELETE" });
    listarVestuarios();
}

/* ================= ALQUILER ================= */
async function listarAlquileres() {
    const res = await fetch(`${api}/Alquiler`);
    const data = await res.json();

    console.log("DATA REAL:", data);

    listaAlquileres.innerHTML = "";

    data.forEach(a => {
        listaAlquileres.innerHTML += `
        <li>
            👤 ${a.cliente ?? "SIN CLIENTE"} 
            👕 ${a.vestuario ?? "SIN VESTUARIO"} 
            📌 ${a.estado ?? "SIN ESTADO"}

            <button onclick="editarAlquiler(${a.id})">Editar</button>
            <button onclick="eliminarAlquiler(${a.id})">Eliminar</button>
        </li>`;
    });
} async function cargarSelects() {
    const clientes = await fetch(`${api}/Cliente`).then(r => r.json());
    const vestuarios = await fetch(`${api}/Vestuario`).then(r => r.json());

    clienteSelect.innerHTML = "";
    vestuarioSelect.innerHTML = "";

    clientes.forEach(c => {
        clienteSelect.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
    });

    vestuarios.forEach(v => {
        vestuarioSelect.innerHTML += `<option value="${v.id}">${v.nombre}</option>`;
    });
}

async function guardarAlquiler() {
    const id = alquilerId.value;

    const data = {
        fechaInicio: fechaInicio.value,
        fechaFin: fechaFin.value,
        penalidad: parseFloat(penalidad.value),
        clienteId: parseInt(clienteSelect.value),
        vestuarioId: parseInt(vestuarioSelect.value),
        devuelto: false
    };

    let res = id
        ? await fetch(`${api}/Alquiler/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        : await fetch(`${api}/Alquiler`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

    if (!res.ok) {
        const error = await res.text();
        console.log(error);
        alert(error);
        return;
    }

    limpiar();
    listarAlquileres();
}

async function editarAlquiler(id) {
    const res = await fetch(`${api}/Alquiler/${id}`);

    if (!res.ok) {
        alert("Ese alquiler no existe o fue eliminado");
        return;
    }

    const a = await res.json();

    mostrarForm("formAlquiler");

    fechaInicio.value = a.fechaInicio.split("T")[0];
    fechaFin.value = a.fechaFin.split("T")[0];
    penalidad.value = a.penalidad;
    clienteSelect.value = a.clienteId;
    vestuarioSelect.value = a.vestuarioId;

    alquilerId.value = a.id;
}

async function eliminarAlquiler(id) {
    await fetch(`${api}/Alquiler/${id}`, { method: "DELETE" });
    listarAlquileres();
}

/* ================= GENERALES ================= */
function limpiar() {
    document.querySelectorAll("input").forEach(i => i.value = "");
}

function mostrarErrores(data) {
    if (data.errors) {
        alert(JSON.stringify(data.errors));
    }
}