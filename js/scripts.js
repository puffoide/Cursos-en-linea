document.addEventListener('DOMContentLoaded', function() {
    const navbarLinks = document.getElementById('navbarLinks');

    // Verificar si hay un usuario en sesión
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (usuarioLogueado) {
        // Mostrar enlaces de usuario logueado
        navbarLinks.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="index.html">Inicio</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="mis-cursos.html">Mis Cursos</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="perfil.html">Perfil</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="cerrarSesion()">Cerrar Sesión</a>
            </li>
        `;
    } else {
        // Mostrar enlaces de usuario no logueado
        navbarLinks.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html">Iniciar Sesión</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="registro.html">Registrarse</a>
            </li>
        `;
    }
});

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioLogueado'); 
    window.location.href = 'index.html'; 
}
