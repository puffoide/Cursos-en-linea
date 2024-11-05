// Muestra una categoría de cursos
function showCategory(categoryId) {
    // Ocultar todas las categorías
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.classList.add('hidden');
    });

    // Mostrar solo la categoría seleccionada
    const selectedCategory = document.getElementById(categoryId);
    selectedCategory.classList.remove('hidden');
}

function deshabilitarBotones() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (!usuarioLogueado) return;

    const username = usuarioLogueado.username;
    const inscripciones = JSON.parse(localStorage.getItem('inscripcionesPorUsuario')) || {};
    const cursosInscritos = inscripciones[username] || [];

    cursosInscritos.forEach(curso => {
        const boton = document.querySelector(`button[data-curso="${curso.nombre}"]`);
        if (boton) {
            boton.disabled = true;
            boton.textContent = 'Inscrito';
            boton.classList.add('btn-secondary');
        }
    });
}


function inscribirCurso(nombreCurso, descripcionCurso) {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (!usuarioLogueado) {
        window.location.href = 'login.html';
    } else {
        const username = usuarioLogueado.username;
        const inscripciones = JSON.parse(localStorage.getItem('inscripcionesPorUsuario')) || {};

        const cursosInscritos = inscripciones[username] || [];

        if (cursosInscritos.some(curso => curso.nombre === nombreCurso)) {
            mostrarAlerta('Ya estás inscrito en este curso.', 'warning');
            return;
        }

        cursosInscritos.push({ nombre: nombreCurso, descripcion: descripcionCurso });
        inscripciones[username] = cursosInscritos;
        localStorage.setItem('inscripcionesPorUsuario', JSON.stringify(inscripciones));

        deshabilitarBotones();
        mostrarAlerta('Te has inscrito exitosamente en el curso.', 'success');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    deshabilitarBotones();
});

