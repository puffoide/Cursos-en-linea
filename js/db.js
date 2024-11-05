document.addEventListener('DOMContentLoaded', function () {
    // Simulación de base de datos en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Función para registrar usuarios
    function registrarUsuario(email, name, password, username) {
        console.log('Intentando registrar usuario:', { email, name, username });

        // Verificar si el usuario ya existe por email o username
        const usuarioExistente = usuarios.find(user => user.email === email || user.username === username);
        if (usuarioExistente) {
            mostrarAlerta('El usuario ya existe.', 'danger');
            console.log('El usuario ya existe.');
            return false;
        }

        // Crear y guardar el nuevo usuario
        const nuevoUsuario = { email, name, password, username };
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        console.log('Usuario registrado exitosamente:', nuevoUsuario);
        return true;
    }

    // Función para iniciar sesión
    function iniciarSesion(emailOrUsername, password) {
        console.log('Intentando iniciar sesión:', { emailOrUsername, password });

        // Buscar el usuario por email o username y verificar la contraseña
        const usuario = usuarios.find(user =>
            (user.email === emailOrUsername || user.username === emailOrUsername) && user.password === password
        );

        if (usuario) {
            console.log('Inicio de sesión exitoso:', usuario);
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
            return true;
        } else {
            mostrarAlerta('Email/Usuario o contraseña incorrectos.', 'danger');
            console.log('Email/Usuario o contraseña incorrectos.');
            return false;
        }
    }

    // Función para mostrar alertas
    function mostrarAlerta(mensaje, tipo) {
        const alertContainer = document.getElementById('alertContainer');
        alertContainer.innerHTML = '';

        const alertaDiv = document.createElement('div');
        alertaDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
        alertaDiv.role = 'alert';
        alertaDiv.style.fontSize = '1.2rem';
        alertaDiv.style.padding = '1rem';

        alertaDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

        alertContainer.appendChild(alertaDiv);

        // Desaparecer alerta después de 6 segundos
        setTimeout(() => {
            alertaDiv.remove();
        }, 6000);
    }

    // Exportar funciones para que puedan ser usadas en otros scripts
    window.registrarUsuario = registrarUsuario;
    window.iniciarSesion = iniciarSesion;
    window.mostrarAlerta = mostrarAlerta;
});
