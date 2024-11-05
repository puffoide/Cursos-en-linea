document.addEventListener('DOMContentLoaded', function () {
    const cursosContainer = document.getElementById('cursosContainer');
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (!usuarioLogueado) {
        window.location.href = 'login.html';
        return;
    }

    const username = usuarioLogueado.username;
    const inscripciones = JSON.parse(localStorage.getItem('inscripcionesPorUsuario')) || {};
    const cursosInscritos = inscripciones[username] || [];

    function mostrarCursos() {
        cursosContainer.innerHTML = '';
        cursosInscritos.forEach((curso, index) => {
            const cursoCard = document.createElement('div');
            cursoCard.classList.add('col-md-4', 'mb-4');

            cursoCard.innerHTML = `
                <div class="course-card">
                    <h4 class="course-title">${curso.nombre}</h4>
                    <p class="course-description">${curso.descripcion}</p>
                    <button class="btn btn-enroll w-100 mb-2">Asistir</button>
                    <button class="btn btn-danger w-100" onclick="eliminarCurso(${index})">Eliminar</button>
                </div>
            `;
            cursosContainer.appendChild(cursoCard);
        });
    }

    // Función para eliminar un curso
    window.eliminarCurso = function (index) {
        cursosInscritos.splice(index, 1);
        inscripciones[username] = cursosInscritos;
        localStorage.setItem('inscripcionesPorUsuario', JSON.stringify(inscripciones));
        mostrarCursos(); // Actualizar la lista de cursos
    };

    mostrarCursos();
});
