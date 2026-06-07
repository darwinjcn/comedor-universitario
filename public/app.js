/**
 * 🖥️ Frontend — Comedor Universitario
 * Sistema de gestión integral. Responsive para móvil y desktop.
 */

const ENDPOINTS = {
    estudiantes: '/estudiantes',
    platos: '/platos',
    personal: '/personal',
    menus: '/menu',
    compras: '/compras'
};

const form = document.getElementById('student-form');
const studentList = document.getElementById('student-list');
const studentIdInput = document.getElementById('student-id');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const studentCountText = document.getElementById('student-count');
const noDataContainer = document.getElementById('no-data');

let isEditing = false;

document.addEventListener('DOMContentLoaded', () => {
    loadAllStats();
    fetchStudents();
    fetchPlatos();
    fetchPersonal();
    fetchMenus();
    fetchCompras();
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-emerald-600', 'text-emerald-700', 'bg-emerald-50');
        btn.classList.add('border-transparent', 'text-slate-500');
    });
    const activeBtn = document.getElementById(`tab-${tabName}`);
    activeBtn.classList.remove('border-transparent', 'text-slate-500');
    activeBtn.classList.add('border-emerald-600', 'text-emerald-700', 'bg-emerald-50');
}

function extractData(response) {
    if (Array.isArray(response)) return response;
    if (response && Array.isArray(response.data)) return response.data;
    return [];
}

async function loadAllStats() {
    try {
        const [est, plat, pers, men, comp] = await Promise.all([
            fetch(ENDPOINTS.estudiantes).then(r => r.ok ? r.json() : []),
            fetch(ENDPOINTS.platos).then(r => r.ok ? r.json() : []),
            fetch(ENDPOINTS.personal).then(r => r.ok ? r.json() : []),
            fetch(ENDPOINTS.menus).then(r => r.ok ? r.json() : []),
            fetch(ENDPOINTS.compras).then(r => r.ok ? r.json() : [])
        ]);
        document.getElementById('stat-estudiantes').textContent = extractData(est).length || '-';
        document.getElementById('stat-platos').textContent = extractData(plat).length || '-';
        document.getElementById('stat-personal').textContent = extractData(pers).length || '-';
        document.getElementById('stat-menus').textContent = extractData(men).length || '-';
        document.getElementById('stat-compras').textContent = extractData(comp).length || '-';
    } catch (err) {
        console.error('Error stats:', err);
    }
}

// ─── ESTUDIANTES ───
async function fetchStudents() {
    try {
        const res = await fetch(ENDPOINTS.estudiantes);
        if (!res.ok) throw new Error('Error');
        renderStudents(extractData(await res.json()));
    } catch (err) {
        showToast('❌ Error al cargar estudiantes', 'error');
    }
}

function renderStudents(students) {
    studentList.innerHTML = '';
    if (!students || students.length === 0) {
        noDataContainer.classList.remove('hidden');
        studentCountText.textContent = '0 registros';
        return;
    }
    noDataContainer.classList.add('hidden');
    studentCountText.textContent = `${students.length} ${students.length === 1 ? 'registro' : 'registros'}`;

    students.forEach((s, i) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition-colors fade-in';
        tr.style.animationDelay = `${i * 0.05}s`;
        tr.innerHTML = `
            <td data-label="Cédula" class="px-4 py-3 text-slate-600 font-mono text-xs">${escapeHtml(s.cedula || '')}</td>
            <td data-label="Nombre" class="px-4 py-3 font-medium text-slate-900">${escapeHtml(s.nombre || '')}</td>
            <td data-label="Carrera" class="px-4 py-3 text-slate-600">${escapeHtml(s.carrera || '')}</td>
            <td data-label="Semestre" class="px-4 py-3 text-center">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">${s.semestre || '-'}</span>
            </td>
            <td data-label="Saldo" class="px-4 py-3 text-right font-semibold text-emerald-600">$${(s.saldo || 0).toFixed(2)}</td>
            <td data-label="Acciones" class="px-4 py-3 text-right actions-cell">
                <button onclick="editStudent('${s._id}', '${escapeHtml(s.cedula)}', '${escapeHtml(s.nombre)}', '${escapeHtml(s.carrera)}', ${s.semestre}, ${s.saldo})" 
                    class="touch-btn text-blue-600 hover:text-blue-800 mr-2 transition-colors" title="Editar">
                    <i class="fas fa-edit text-base"></i>
                </button>
                <button onclick="deleteStudent('${s._id}', '${escapeHtml(s.nombre)}')" 
                    class="touch-btn text-rose-500 hover:text-rose-700 transition-colors" title="Eliminar">
                    <i class="fas fa-trash-alt text-base"></i>
                </button>
            </td>
        `;
        studentList.appendChild(tr);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        cedula: document.getElementById('cedula').value.trim(),
        nombre: document.getElementById('nombre').value.trim(),
        carrera: document.getElementById('carrera').value.trim(),
        semestre: parseInt(document.getElementById('semestre').value),
        saldo: parseFloat(document.getElementById('saldo').value)
    };
    try {
        let res;
        if (isEditing) {
            res = await fetch(`${ENDPOINTS.estudiantes}/${studentIdInput.value}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
            });
        } else {
            res = await fetch(ENDPOINTS.estudiantes, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
            });
        }
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || err.error || 'Error');
        }
        showToast(isEditing ? '✅ Actualizado' : '✅ Registrado', 'success');
        resetForm(); fetchStudents(); loadAllStats();
    } catch (err) {
        showToast(`❌ ${err.message}`, 'error');
    }
});

function editStudent(id, cedula, nombre, carrera, semestre, saldo) {
    isEditing = true;
    studentIdInput.value = id;
    document.getElementById('cedula').value = cedula;
    document.getElementById('nombre').value = nombre;
    document.getElementById('carrera').value = carrera;
    document.getElementById('semestre').value = semestre;
    document.getElementById('saldo').value = saldo;
    formTitle.textContent = 'Editar Estudiante';
    submitBtn.innerHTML = '<i class="fas fa-sync-alt mr-1"></i> Actualizar';
    submitBtn.classList.remove('bg-emerald-600');
    submitBtn.classList.add('bg-blue-600');
    cancelBtn.classList.remove('hidden');
    document.getElementById('cedula').focus();
}

async function deleteStudent(id, nombre) {
    if (!confirm(`¿Eliminar a ${nombre}?`)) return;
    try {
        const res = await fetch(`${ENDPOINTS.estudiantes}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error');
        showToast('🗑️ Eliminado', 'success');
        fetchStudents(); loadAllStats();
    } catch (err) {
        showToast('❌ Error al eliminar', 'error');
    }
}

function resetForm() {
    isEditing = false;
    form.reset();
    studentIdInput.value = '';
    formTitle.textContent = 'Agregar Estudiante';
    submitBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Guardar';
    submitBtn.classList.remove('bg-blue-600');
    submitBtn.classList.add('bg-emerald-600');
    cancelBtn.classList.add('hidden');
}

// ─── PLATOS ───
async function fetchPlatos() {
    try {
        const res = await fetch(ENDPOINTS.platos);
        renderPlatos(extractData(await res.json()));
    } catch (err) { console.error('Error platos:', err); }
}

function renderPlatos(platos) {
    const container = document.getElementById('platos-grid');
    if (!platos || platos.length === 0) {
        container.innerHTML = '<p class="text-slate-400 col-span-full text-center py-8">No hay platos</p>';
        return;
    }
    const catColors = { 'Desayuno': 'bg-yellow-100 text-yellow-700', 'Almuerzo': 'bg-orange-100 text-orange-700', 'Cena': 'bg-indigo-100 text-indigo-700' };
    container.innerHTML = platos.map(p => `
        <div class="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-2">
                <h4 class="font-semibold text-slate-900 text-sm sm:text-base">${escapeHtml(p.nombre)}</h4>
                <span class="px-2 py-1 rounded text-xs font-medium ${catColors[p.categoria] || 'bg-slate-100 text-slate-600'}">${p.categoria || ''}</span>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 mb-3 line-clamp-2">${escapeHtml(p.descripcion || '')}</p>
            <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-emerald-600">$${(p.precio || 0).toFixed(2)}</span>
                <span class="text-xs px-2 py-1 rounded-full ${p.disponible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}">${p.disponible ? 'Disponible' : 'Agotado'}</span>
            </div>
        </div>
    `).join('');
}

// ─── PERSONAL ───
async function fetchPersonal() {
    try {
        const res = await fetch(ENDPOINTS.personal);
        renderPersonal(extractData(await res.json()));
    } catch (err) { console.error('Error personal:', err); }
}

function renderPersonal(personal) {
    const tbody = document.getElementById('personal-list');
    if (!personal || personal.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-400">No hay personal</td></tr>';
        return;
    }
    const turnoColors = { 'Mañana': 'bg-yellow-100 text-yellow-700', 'Tarde': 'bg-orange-100 text-orange-700', 'Noche': 'bg-indigo-100 text-indigo-700' };
    tbody.innerHTML = personal.map(p => `
        <tr class="hover:bg-slate-50">
            <td data-label="Cédula" class="px-4 py-3 text-slate-600 font-mono text-xs">${escapeHtml(p.cedula)}</td>
            <td data-label="Nombre" class="px-4 py-3 font-medium text-slate-900">${escapeHtml(p.nombre)}</td>
            <td data-label="Cargo" class="px-4 py-3 text-slate-600">${escapeHtml(p.cargo)}</td>
            <td data-label="Turno" class="px-4 py-3">
                <span class="px-2 py-1 rounded text-xs font-medium ${turnoColors[p.turno] || 'bg-slate-100 text-slate-600'}">${p.turno}</span>
            </td>
            <td data-label="Teléfono" class="px-4 py-3 text-slate-600 text-xs">${escapeHtml(p.telefono)}</td>
        </tr>
    `).join('');
}

// ─── MENÚS ───
async function fetchMenus() {
    try {
        const res = await fetch(ENDPOINTS.menus);
        renderMenus(extractData(await res.json()));
    } catch (err) { console.error('Error menus:', err); }
}

function renderMenus(menus) {
    const container = document.getElementById('menus-list');
    if (!menus || menus.length === 0) {
        container.innerHTML = '<p class="text-slate-400 text-center py-8">No hay menús</p>';
        return;
    }
    const diaColors = { 'Lunes': 'bg-red-100 text-red-700', 'Martes': 'bg-orange-100 text-orange-700', 'Miércoles': 'bg-yellow-100 text-yellow-700', 'Jueves': 'bg-green-100 text-green-700', 'Viernes': 'bg-blue-100 text-blue-700' };
    container.innerHTML = menus.map(m => {
        const fecha = m.fecha ? new Date(m.fecha).toLocaleDateString('es-VE') : '-';
        return `
            <div class="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-sm transition-shadow">
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <i class="fas fa-utensils text-sm sm:text-base"></i>
                </div>
                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                        <h4 class="font-medium text-slate-900 text-sm sm:text-base">${escapeHtml(m.diaSemana)}</h4>
                        <span class="px-2 py-0.5 rounded text-xs font-medium ${diaColors[m.diaSemana] || 'bg-slate-100 text-slate-600'}">${fecha}</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5 truncate">${escapeHtml(m.platoPrincipal)} · ${escapeHtml(m.ensalada)} · ${escapeHtml(m.postre)}</p>
                </div>
            </div>
        `;
    }).join('');
}

// ─── COMPRAS ───
async function fetchCompras() {
    try {
        const res = await fetch(ENDPOINTS.compras);
        renderCompras(extractData(await res.json()));
    } catch (err) { console.error('Error compras:', err); }
}

function renderCompras(compras) {
    const tbody = document.getElementById('compras-list');
    if (!compras || compras.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">No hay compras</td></tr>';
        return;
    }
    const estadoColors = { 'pagado': 'bg-emerald-100 text-emerald-700', 'pendiente': 'bg-yellow-100 text-yellow-700', 'cancelado': 'bg-rose-100 text-rose-700' };
    tbody.innerHTML = compras.map(c => {
        const fecha = c.fecha ? new Date(c.fecha).toLocaleDateString('es-VE') : '-';
        const estName = c.estudianteId?.nombre || (typeof c.estudianteId === 'string' ? '...' : 'N/A');
        const platName = c.platoId?.nombre || (typeof c.platoId === 'string' ? '...' : 'N/A');
        return `
            <tr class="hover:bg-slate-50">
                <td data-label="Estudiante" class="px-4 py-3 font-medium text-slate-900">${escapeHtml(estName)}</td>
                <td data-label="Plato" class="px-4 py-3 text-slate-600 text-xs">${escapeHtml(platName)}</td>
                <td data-label="Monto" class="px-4 py-3 font-semibold text-slate-900">$${(c.monto || 0).toFixed(2)}</td>
                <td data-label="Fecha" class="px-4 py-3 text-slate-500 text-xs">${fecha}</td>
                <td data-label="Hora" class="px-4 py-3 text-slate-600 text-xs">${c.hora || '-'}</td>
                <td data-label="Estado" class="px-4 py-3">
                    <span class="px-2 py-1 rounded text-xs font-medium ${estadoColors[c.estado] || 'bg-slate-100 text-slate-600'}">${c.estado || 'N/A'}</span>
                </td>
            </tr>
        `;
    }).join('');
}

// ─── UTILIDADES ───
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const colors = { success: 'bg-emerald-600', error: 'bg-rose-600', info: 'bg-slate-700' };
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-[90vw] toast-enter`;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><span class="text-sm font-medium">${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-enter-active');
    });
    setTimeout(() => {
        toast.classList.remove('toast-enter-active');
        toast.classList.add('toast-exit-active');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}