
const API_BASE = 'https://localhost:5001/api';

let useLocal = false;


const EP = {
    clientes: `${API_BASE}/cliente`,
    categorias: `${API_BASE}/categoria`,
    vestuarios: `${API_BASE}/vestuario`,
    alquileres: `${API_BASE}/alquiler`
};


function toast(msg, type = 'ok') {
    const el = document.createElement('div');
    el.className = `toast-msg${type === 'error' ? ' error' : ''}`;
    el.innerHTML = `<i class="fas fa-${type === 'ok' ? 'check-circle' : 'exclamation-circle'} me-2"></i>${msg}`;
    document.getElementById('toast-container').appendChild(el);
    setTimeout(() => el.remove(), 3200);
}


function showAdmin() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
    loadDashboard();
}

function showLanding() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('landingPage').style.display = 'block';
    window.scrollTo(0, 0);
    loadCatalog();
}

function showSection(name, el) {
    document.querySelectorAll('.crud-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`sec-${name}`).classList.add('active');
    document.querySelectorAll('.admin-sidebar .nav-link').forEach(l => l.classList.remove('active'));
    if (el) el.classList.add('active');
    document.getElementById('adminTitle').textContent = {
        dashboard: 'Dashboard', clientes: 'Clientes', categorias: 'Categorías',
        vestuarios: 'Vestuario', alquileres: 'Alquileres'
    }[name];
    const loaders = { clientes: loadClientes, categorias: loadCategorias, vestuarios: loadVestuarios, alquileres: loadAlquileres };
    if (loaders[name]) loaders[name]();
}


async function getData(e) {
    try {
        const r = await fetch(EP[e]);
        console.log("URL:", EP[e]);

        if (!r.ok) {
            console.error("ERROR:", r.status);
            return [];
        }

        const data = await r.json();
        console.log("DATA:", data);
        return data;

    } catch (err) {
        console.error("FETCH ERROR:", err);
        return [];
    }
}

async function postData(e, body) {
    if (useLocal) {
        const item = { id: nextId[e]++, ...body };
        DB[e].push(item);
        return item;
    }
    const r = await fetch(EP[e], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}

async function putData(e, id, body) {
    if (useLocal) {
        const i = DB[e].findIndex(x => x.id === id);
        if (i > -1) DB[e][i] = { ...DB[e][i], ...body, id };
        return DB[e][i];
    }

    const r = await fetch(`${EP[e]}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!r.ok) throw new Error(await r.text());

    // 🔥 SOLUCIÓN: NO intentar leer JSON si es 204
    if (r.status !== 204) {
        return await r.json();
    }

    return; // ✔️ todo bien
}

async function deleteData(e, id) {
    if (useLocal) { DB[e] = DB[e].filter(x => x.id !== id); return; }
    const r = await fetch(`${EP[e]}/${id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error();
}


async function loadDashboard() {
    try {
        const [cl, ca, ve, al] = await Promise.all([
            getData('clientes'), getData('categorias'),
            getData('vestuarios'), getData('alquileres')
        ]);
        document.getElementById('stat-clientes').textContent = cl.length;
        document.getElementById('stat-categorias').textContent = ca.length;
        document.getElementById('stat-vestuarios').textContent = ve.length;
        document.getElementById('stat-alquileres').textContent = al.length;
    } catch (e) { console.warn('Dashboard error', e); }
}


function filterTable(tid, q) {
    q = q.toLowerCase();
    document.querySelectorAll(`#${tid} tbody tr`).forEach(r =>
        r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none'
    );
}


let catalogVestuarios = [];
let catalogCategorias = [];
let activeFilter = '*';

async function loadCatalog() {
    const loading = document.getElementById('catalogLoading');
    const empty = document.getElementById('catalogEmpty');
    const grid = document.getElementById('catalogGrid');

    loading.style.display = 'block';
    empty.style.display = 'none';
    grid.style.display = 'none';

    try {
        [catalogVestuarios, catalogCategorias] = await Promise.all([
            getData('vestuarios'),
            getData('categorias')
        ]);
    } catch (e) {
        loading.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    loading.style.display = 'none';

    if (!catalogVestuarios.length) {
        empty.style.display = 'block';
        return;
    }

    buildCatalogFilters();

    renderCatalogGrid(catalogVestuarios);
}
function renderCatalogGrid(vestuarios) {
    const grid = document.getElementById('catalogGrid');

    grid.innerHTML = vestuarios.map(v => {
        const cat = catalogCategorias.find(c => c.id === v.categoriaId);
        const catNom = cat ? cat.nombre : '';
        const catSlug = cat ? slugify(cat.nombre) : 'sin-categoria';

        const imgHtml = v.foto
            ? `<img src="${v.foto}" class="w-100" style="height:320px;object-fit:cover;">`
            : `<div class="catalog-no-img"><i class="fas fa-tshirt"></i></div>`;

        return `
        <div class="col-md-6 col-lg-4 col-xl-3 p-2 catalog-item cat-${catSlug}">
            <div class="collection-img">
                ${imgHtml}
                ${catNom ? `<span class="cat-badge">${catNom}</span>` : ''}
            </div>

            <div class="text-center mt-3">
                <p>${v.nombre}</p>

                <span style="color:var(--primary)">
                    RD$ ${Number(v.precio).toLocaleString()}
                </span>

                <div class="mt-2">
                    ${v.disponible
                ? `<span class="badge bg-success">Disponible</span>`
                : `<span class="badge bg-danger">No disponible</span>`}
                </div>

                <button class="btn-reservar mt-2"
                    ${!v.disponible ? 'disabled' : ''}
                    onclick='openReservaDesdeCard(${JSON.stringify(v)})'>
                    Reservar
                </button>
            </div>
        </div>`;
    }).join('');

    grid.style.display = 'flex';
}
function filterCatalog(filter, btn) {
    activeFilter = filter;

    document.querySelectorAll('#catalogFilters button')
        .forEach(b => b.classList.remove('active-filter-btn'));

    btn.classList.add('active-filter-btn');

    const items = document.querySelectorAll('#catalogGrid .catalog-item');

    items.forEach(item => {
        if (filter === '*') {
            item.style.display = '';
        } else {
            const cls = filter.replace('.', '');
            item.style.display = item.classList.contains(cls) ? '' : 'none';
        }
    });
}

function buildCatalogFilters() {
    const container = document.getElementById('catalogFilters');

    const usedCatIds = [...new Set(catalogVestuarios.map(v => v.categoriaId))];
    const usedCats = catalogCategorias.filter(c => usedCatIds.includes(c.id));

    container.innerHTML = `<button type="button" class="btn m-2 text-dark active-filter-btn" data-filter="*" onclick="filterCatalog('*',this)">Todos</button>`;

    usedCats.forEach(c => {
        const slug = slugify(c.nombre);
        container.innerHTML += `<button type="button" class="btn m-2 text-dark" data-filter=".cat-${slug}" onclick="filterCatalog('.cat-${slug}',this)">${c.nombre}</button>`;
    });
}

function filterCatalog(filter, btn) {
    activeFilter = filter;
    document.querySelectorAll('#catalogFilters button').forEach(b => b.classList.remove('active-filter-btn'));
    btn.classList.add('active-filter-btn');

    const items = document.querySelectorAll('#catalogGrid .catalog-item');
    items.forEach(item => {
        if (filter === '*') {
            item.style.display = '';
        } else {
            const cls = filter.replace('.', '');
            item.style.display = item.classList.contains(cls) ? '' : 'none';
        }
    });
}



function renderPopular() {
    const grid = document.getElementById('popularGrid');
    if (!catalogVestuarios.length) { grid.innerHTML = ''; return; }


    const disponibles = catalogVestuarios.filter(v => v.disponible);
    const top3baratos = [...disponibles].sort((a, b) => a.precio - b.precio).slice(0, 3);
    const top3caros = [...disponibles].sort((a, b) => b.precio - a.precio).slice(0, 3);
    const top3todos = [...catalogVestuarios].slice(0, 3);

    const colHtml = (titulo, items) => `
        <div class="col-md-6 col-lg-4 row g-3">
            <h3 class="fs-5" style="font-family:'Cormorant Garamond',serif;font-weight:400;">${titulo}</h3>
            ${items.map(v => `
            <div class="d-flex align-items-start popular-item">
                ${v.foto
            ? `<img src="${v.foto}" class="img-fluid pe-3" alt="${v.nombre}" style="width:80px;height:80px;object-fit:cover;">`
            : `<div class="popular-no-img me-3"><i class="fas fa-tshirt"></i></div>`}
                <div>
                    <p class="mb-0">${v.nombre}</p>
                    <span>RD$ ${Number(v.precio).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>`).join('')}
        </div>`;

    grid.innerHTML =
        colHtml('Mejor Valorados', top3caros) +
        colHtml('Más Populares', top3baratos) +
        colHtml('Disponibles', top3todos);
}

function slugify(str) {
    return str.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}


function openReservaDesdeCard(v) {

    openModalReserva(v);
}

async function openModalReserva(prendaPreseleccionada = null) {

    document.getElementById('rId').value = '';
    document.getElementById('rDevuelto').checked = false;
    document.getElementById('rFechaInicio').value = new Date().toISOString().split('T')[0];
    document.getElementById('rFechaFin').value = '';
    document.getElementById('mReservaTitle').textContent = 'Nueva Reserva';
    document.getElementById('reservaPrendaInfo').style.display = 'none';


    await fillSelect('rClienteId', 'clientes', c => ({ val: c.id, text: `${c.nombre} — ${c.cedula}` }));

    const vests = await getData('vestuarios');
    const sel = document.getElementById('rVestuarioId');
    sel.innerHTML = '<option value="">Seleccionar prenda...</option>' +
        vests
            .filter(v => v.disponible || (prendaPreseleccionada && v.id === prendaPreseleccionada.id))
            .map(v => `<option value="${v.id}" ${prendaPreseleccionada && v.id === prendaPreseleccionada.id ? 'selected' : ''}>${v.nombre} (${v.talla}) — RD$ ${Number(v.precio).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</option>`)
            .join('');

    if (prendaPreseleccionada) {
        showPrendaInfo(prendaPreseleccionada);
    }

    new bootstrap.Modal(document.getElementById('mReserva')).show();
}

function onReservaPrendaChange() {
    const id = parseInt(document.getElementById('rVestuarioId').value);
    const prenda = catalogVestuarios.find(v => v.id === id);
    if (prenda) showPrendaInfo(prenda);
    else document.getElementById('reservaPrendaInfo').style.display = 'none';
}

function showPrendaInfo(v) {
    const box = document.getElementById('reservaPrendaInfo');
    const img = document.getElementById('reservaPrendaImg');
    const nom = document.getElementById('reservaPrendaNombre');
    const det = document.getElementById('reservaPrendaDetalle');
    const cat = catalogCategorias.find(c => c.id === v.categoriaId);

    if (v.foto) { img.src = v.foto; img.style.display = 'block'; }
    else img.style.display = 'none';

    nom.textContent = v.nombre;
    det.textContent = `${cat ? cat.nombre : ''} · Talla ${v.talla} · RD$ ${Number(v.precio).toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;
    box.style.display = 'flex';
}

async function saveReserva() {
    const id = document.getElementById('rId').value;
    const clienteId = parseInt(document.getElementById('rClienteId').value);
    const vestuarioId = parseInt(document.getElementById('rVestuarioId').value);
    const fechaInicio = document.getElementById('rFechaInicio').value;
    const fechaFin = document.getElementById('rFechaFin').value;
    const devuelto = document.getElementById('rDevuelto').checked;
    if (isNaN(clienteId) || isNaN(vestuarioId) || !fechaInicio || !fechaFin) {
        toast('Completa todos los campos', 'error'); return;
    }
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
        toast('La fecha fin debe ser posterior al inicio', 'error'); return;
    }

    try {
        const body = { ClienteId: clienteId, VestuarioId: vestuarioId, FechaInicio: fechaInicio, FechaFin: fechaFin, Devuelto: devuelto };
        if (id) {
        
             await putData('alquileres', id, body);
        } else {

    
            await postData('alquileres', body);


          
        }

        bootstrap.Modal.getInstance(document.getElementById('mReserva')).hide();
        toast(id ? 'Reserva actualizada ✓' : 'Reserva confirmada ✓');
        loadCatalog();
    } catch (e) {
        toast(e.message || 'Error al guardar', 'error');
    }
}


async function loadClientes() {
    const b = document.getElementById('bClientes');
    b.innerHTML = `<tr class="loading-row"><td colspan="4"><i class="fas fa-spinner fa-spin me-2"></i>Cargando...</td></tr>`;
    const data = await getData('clientes').catch(() => null);
    if (!data || !data.length) {
        b.innerHTML = `<tr><td colspan="4"><div class="empty-state"><i class="fas fa-users"></i><p>Sin clientes registrados</p></div></td></tr>`;
        return;
    }
    b.innerHTML = data.map(c => `<tr>
        <td>${c.id}</td><td>${c.nombre}</td><td>${c.cedula}</td>
        <td>
            <button class="btn-edit" onclick='editCliente(${JSON.stringify(c)})'><i class="fas fa-edit me-1"></i>Editar</button>
            <button class="btn-del"  onclick="confirmDelete('clientes',${c.id},'cliente')"><i class="fas fa-trash me-1"></i>Eliminar</button>
        </td>
    </tr>`).join('');
}

function openModal(type) {
    if (type === 'cliente') {
        document.getElementById('cId').value = '';
        document.getElementById('cNombre').value = '';
        document.getElementById('cCedula').value = '';
        document.getElementById('mClienteTitle').textContent = 'Nuevo Cliente';
        new bootstrap.Modal(document.getElementById('mCliente')).show();
    }
    if (type === 'categoria') {
        document.getElementById('catId').value = '';
        document.getElementById('catNombre').value = '';
        document.getElementById('mCategoriaTitle').textContent = 'Nueva Categoría';
        new bootstrap.Modal(document.getElementById('mCategoria')).show();
    }
    if (type === 'vestuario') {
        document.getElementById('vId').value = '';
        document.getElementById('vNombre').value = '';
        document.getElementById('vTalla').value = '';
        document.getElementById('vPrecio').value = '';
        document.getElementById('vDisponible').checked = true;
        document.getElementById('mVestuarioTitle').textContent = 'Nueva Prenda';
        clearFoto();
        fillSelect('vCategoriaId', 'categorias', c => ({ val: c.id, text: c.nombre }));
        new bootstrap.Modal(document.getElementById('mVestuario')).show();
    }
}

async function fillSelect(selId, entity, mapFn, currentVal = '') {
    const sel = document.getElementById(selId);
    const data = await getData(entity);
    sel.innerHTML = '<option value="">Seleccionar...</option>' +
        data.map(d => {
            const m = mapFn(d);
            return `<option value="${m.val}"${m.disabled ? ' disabled' : ''}${currentVal == m.val ? ' selected' : ''}>${m.text}</option>`;
        }).join('');
}

function editCliente(c) {
    document.getElementById('cId').value = c.id;
    document.getElementById('cNombre').value = c.nombre;
    document.getElementById('cCedula').value = c.cedula;
    document.getElementById('mClienteTitle').textContent = 'Editar Cliente';
    new bootstrap.Modal(document.getElementById('mCliente')).show();
}


async function saveCliente() {
    const id = document.getElementById('cId').value;
    const nombre = document.getElementById('cNombre').value.trim();
    const cedula = document.getElementById('cCedula').value.trim();
    if (!nombre || !cedula) { toast('Completa todos los campos', 'error'); return; }
    try {
        id ? await putData('clientes', id, { id,nombre, cedula })
            : await postData('clientes',{ nombre, cedula });
        bootstrap.Modal.getInstance(document.getElementById('mCliente')).hide();
        toast(id ? 'Cliente actualizado ✓' : 'Cliente registrado ✓');
        loadClientes(); loadDashboard();
    } catch (err) {
        toast(err.message || 'Error al guardar', 'error');
    }
}


async function loadCategorias() {
    const b = document.getElementById('bCategorias');
    b.innerHTML = `<tr class="loading-row"><td colspan="4"><i class="fas fa-spinner fa-spin me-2"></i>Cargando...</td></tr>`;
    const [cats, vests] = await Promise.all([getData('categorias'), getData('vestuarios')]).catch(() => [null, []]);
    if (!cats || !cats.length) {
        b.innerHTML = `<tr><td colspan="4"><div class="empty-state"><i class="fas fa-tags"></i><p>Sin categorías registradas</p></div></td></tr>`;
        return;
    }
    b.innerHTML = cats.map(c => {
        const cnt = vests ? vests.filter(v => v.categoriaId === c.id).length : 0;
        return `<tr>
            <td>${c.id}</td><td>${c.nombre}</td>
            <td><span style="background:rgba(176,141,87,.15);color:var(--primary);font-family:'Jost',sans-serif;font-size:.65rem;letter-spacing:1px;padding:3px 10px;">${cnt} prenda${cnt !== 1 ? 's' : ''}</span></td>
            <td>
                <button class="btn-edit" onclick='editCategoria(${JSON.stringify(c)})'><i class="fas fa-edit me-1"></i>Editar</button>
                <button class="btn-del"  onclick="confirmDelete('categorias',${c.id},'categoría')"><i class="fas fa-trash me-1"></i>Eliminar</button>
            </td>
        </tr>`;
    }).join('');
}

function editCategoria(c) {
    document.getElementById('catId').value = c.id;
    document.getElementById('catNombre').value = c.nombre;
    document.getElementById('mCategoriaTitle').textContent = 'Editar Categoría';
    new bootstrap.Modal(document.getElementById('mCategoria')).show();
}

async function saveCategoria() {
    const id = document.getElementById('catId').value;
    const nombre = document.getElementById('catNombre').value.trim();
    if (!nombre) { toast('Ingresa un nombre', 'error'); return; }
    try {
        id ? await putData('categorias', +id, { nombre })
            : await postData('categorias', { nombre });
        bootstrap.Modal.getInstance(document.getElementById('mCategoria')).hide();
        toast(id ? 'Categoría actualizada ✓' : 'Categoría creada ✓');
        loadCategorias(); loadDashboard();
    } catch { toast('Error al guardar', 'error'); }
}


async function loadVestuarios() {
    const b = document.getElementById('bVestuarios');
    b.innerHTML = `<tr class="loading-row"><td colspan="8"><i class="fas fa-spinner fa-spin me-2"></i>Cargando...</td></tr>`;
    const [vests, cats] = await Promise.all([getData('vestuarios'), getData('categorias')]).catch(() => [null, []]);
    if (!vests || !vests.length) {
        b.innerHTML = `<tr><td colspan="8"><div class="empty-state"><i class="fas fa-tshirt"></i><p>Sin prendas registradas</p></div></td></tr>`;
        return;
    }
    b.innerHTML = vests.map(v => {
        const cat = cats ? cats.find(c => c.id === v.categoriaId) : null;
        const imgHtml = v.foto
            ? `<img src="${v.foto}" class="table-thumb" alt="${v.nombre}">`
            : `<div class="table-no-img"><i class="fas fa-tshirt"></i></div>`;
        return `<tr>
            <td>${v.id}</td>
            <td>${imgHtml}</td>
            <td>${v.nombre}</td>
            <td><span class="talla-badge">${v.talla}</span></td>
            <td>RD$ ${Number(v.precio).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</td>
            <td>${cat ? cat.nombre : '—'}</td>
            <td>${v.disponible
                ? '<span class="badge bg-success badge-disponible">Disponible</span>'
                : '<span class="badge bg-danger badge-disponible">No disponible</span>'}</td>
            <td>
                <button class="btn-edit" onclick='editVestuario(${JSON.stringify(v).replace(/'/g, "\\'")})'><i class="fas fa-edit me-1"></i>Editar</button>
                <button class="btn-del"  onclick="confirmDelete('vestuarios',${v.id},'prenda')"><i class="fas fa-trash me-1"></i>Eliminar</button>
            </td>
        </tr>`;
    }).join('');
}
function handleFotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast('La imagen no puede superar 5MB', 'error'); return; }

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64 = e.target.result;
        document.getElementById('vFotoBase64').value = base64;
        document.getElementById('fotoPreview').src = base64;
        document.getElementById('fotoPreview').style.display = 'block';
        document.getElementById('fotoPlaceholder').style.display = 'none';
        document.getElementById('fotoClearBtn').style.display = 'inline-block';
        document.getElementById('fotoUploadArea').classList.add('has-image');
    };
    reader.readAsDataURL(file);
}

function clearFoto() {
    document.getElementById('vFotoBase64').value = '';
    document.getElementById('vFotoInput').value = '';
    document.getElementById('fotoPreview').src = '';
    document.getElementById('fotoPreview').style.display = 'none';
    document.getElementById('fotoPlaceholder').style.display = 'flex';
    document.getElementById('fotoClearBtn').style.display = 'none';
    document.getElementById('fotoUploadArea').classList.remove('has-image');
}

function editVestuario(v) {
    document.getElementById('vId').value = v.id;
    document.getElementById('vNombre').value = v.nombre;
    document.getElementById('vTalla').value = v.talla;
    document.getElementById('vPrecio').value = v.precio;
    document.getElementById('vDisponible').checked = v.disponible;
    document.getElementById('mVestuarioTitle').textContent = 'Editar Prenda';


    clearFoto();
    if (v.foto) {
        document.getElementById('vFotoBase64').value = v.foto;
        document.getElementById('fotoPreview').src = v.foto;
        document.getElementById('fotoPreview').style.display = 'block';
        document.getElementById('fotoPlaceholder').style.display = 'none';
        document.getElementById('fotoClearBtn').style.display = 'inline-block';
        document.getElementById('fotoUploadArea').classList.add('has-image');
    }

    fillSelect('vCategoriaId', 'categorias', c => ({ val: c.id, text: c.nombre }), v.categoriaId);
    new bootstrap.Modal(document.getElementById('mVestuario')).show();
}

async function saveVestuario() {
    const id = document.getElementById('vId').value;
    const nombre = document.getElementById('vNombre').value.trim();
    const talla = document.getElementById('vTalla').value;
    const precio = parseFloat(document.getElementById('vPrecio').value);
    const categoriaId = parseInt(document.getElementById('vCategoriaId').value);
    const disponible = document.getElementById('vDisponible').checked;
    const foto = document.getElementById('vFotoBase64').value || null;

    if (!nombre || !talla || isNaN(precio) || isNaN(categoriaId)) {
        toast('Completa todos los campos requeridos', 'error'); return;
    }

    try {
        const body = { nombre, talla, precio, categoriaId, disponible, foto };
        id ? await putData('vestuarios', +id, body)
            : await postData('vestuarios', body);
        bootstrap.Modal.getInstance(document.getElementById('mVestuario')).hide();
        toast(id ? 'Prenda actualizada ✓' : 'Prenda registrada ✓');
        loadVestuarios();
        loadDashboard();
        loadCatalog();
    } catch { toast('Error al guardar', 'error'); }
}

async function loadAlquileres() {
    const b = document.getElementById('bAlquileres');
    b.innerHTML = `<tr class="loading-row"><td colspan="8"><i class="fas fa-spinner fa-spin me-2"></i>Cargando...</td></tr>`;
    const [alqs, clts, vsts] = await Promise.all([
        getData('alquileres'), getData('clientes'), getData('vestuarios')
    ]).catch(() => [null, [], []]);

    if (!alqs || !alqs.length) {
        b.innerHTML = `<tr><td colspan="8"><div class="empty-state"><i class="fas fa-calendar-check"></i><p>Sin reservas registradas</p></div></td></tr>`;
        return;
    }

    const fmt = d => d ? new Date(d).toLocaleDateString('es-DO') : '—';

    b.innerHTML = alqs.map(a => {
        const cl = clts ? clts.find(c => c.id === a.clienteId) : null;
        const vs = vsts ? vsts.find(v => v.id === a.vestuarioId) : null;

        let estadoBadge;
        if (a.devuelto) {
            estadoBadge = '<span class="badge bg-success badge-devuelto">Devuelto</span>';
        } else {
            const hoy = new Date();
            const fin = new Date(a.fechaFin);
            estadoBadge = fin < hoy
                ? '<span class="badge bg-danger badge-devuelto">Vencido</span>'
                : '<span class="badge bg-warning text-dark badge-devuelto">Activo</span>';
        }

        return `<tr>
            <td>${a.id}</td>
            <td>${cl ? cl.nombre : `ID ${a.clienteId}`}</td>
            <td>${vs ? vs.nombre : `ID ${a.vestuarioId}`}</td>
            <td>${fmt(a.fechaInicio)}</td>
            <td>${fmt(a.fechaFin)}</td>
            <td>${estadoBadge}</td>
            <td>
                <button class="btn-edit"           onclick='editReservaAdmin(${JSON.stringify(a)})'><i class="fas fa-edit me-1"></i>Editar</button>
                <button class="btn-cancel-reserva" onclick="cancelarReserva(${a.id})"><i class="fas fa-ban me-1"></i>Cancelar</button>
            </td>
        </tr>`;
    }).join('');
}

async function editReservaAdmin(a) {

    document.getElementById('rId').value = a.id;
    document.getElementById('rDevuelto').checked = a.devuelto;
    document.getElementById('rFechaInicio').value = a.fechaInicio ? a.fechaInicio.split('T')[0] : '';
    document.getElementById('rFechaFin').value = a.fechaFin ? a.fechaFin.split('T')[0] : '';
    document.getElementById('mReservaTitle').textContent = 'Editar Reserva';
    document.getElementById('reservaPrendaInfo').style.display = 'none';

    await fillSelect('rClienteId', 'clientes', c => ({ val: c.id, text: `${c.nombre} — ${c.cedula}` }), a.clienteId);


    const vests = await getData('vestuarios');
    const sel = document.getElementById('rVestuarioId');
    sel.innerHTML = '<option value="">Seleccionar prenda...</option>' +
        vests.map(v => `<option value="${v.id}" ${v.id === a.vestuarioId ? 'selected' : ''}>${v.nombre} (${v.talla}) — RD$ ${Number(v.precio).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</option>`).join('');


    const prendaActual = vests.find(v => v.id === a.vestuarioId);
    if (prendaActual) {

        if (!catalogCategorias.length) catalogCategorias = await getData('categorias');
        showPrendaInfo(prendaActual);
    }

    new bootstrap.Modal(document.getElementById('mReserva')).show();
}

function cancelarReserva(id) {
    document.getElementById('mDeleteMsg').textContent = '¿Cancelar esta reserva? El vestuario quedará disponible nuevamente.';
    document.getElementById('btnDelete').onclick = async () => {
        try {

            const alquileres = await getData('alquileres');
            const alquiler = alquileres.find(a => a.id === id);

            await deleteData('alquileres', id);


            
            bootstrap.Modal.getInstance(document.getElementById('mDelete')).hide();
            toast('Reserva cancelada');
            loadAlquileres();
            loadDashboard();
            loadCatalog();
        } catch { toast('Error al cancelar', 'error'); }
    };
    new bootstrap.Modal(document.getElementById('mDelete')).show();
}


function confirmDelete(entity, id, label) {
    document.getElementById('mDeleteMsg').textContent = `¿Eliminar este ${label}? Esta acción no se puede deshacer.`;
    document.getElementById('btnDelete').onclick = async () => {
        try {
            await deleteData(entity, id);
            bootstrap.Modal.getInstance(document.getElementById('mDelete')).hide();
            toast(`${label.charAt(0).toUpperCase() + label.slice(1)} eliminado`);
            const r = { clientes: loadClientes, categorias: loadCategorias, vestuarios: loadVestuarios, alquileres: loadAlquileres };
            if (r[entity]) r[entity]();
            loadDashboard();
            if (entity === 'vestuarios') loadCatalog();
        } catch { toast('Error al eliminar', 'error'); }
    };
    new bootstrap.Modal(document.getElementById('mDelete')).show();
}


document.addEventListener('DOMContentLoaded', () => {
    loadCatalog();


    window.addEventListener('scroll', () => {
        const n = document.querySelector('#landingPage .navbar');
        if (!n) return;
        n.style.padding = window.scrollY > 50 ? '.6rem 0' : '1.2rem 0';
        n.style.boxShadow = window.scrollY > 50 ? '0 2px 20px rgba(0,0,0,.1)' : '0 1px 0 rgba(0,0,0,.08)';
    });
});
