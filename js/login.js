document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const usernameOrEmail = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const loginSuccess = iniciarSesion(usernameOrEmail, password);

        if (loginSuccess) {
            mostrarAlerta('Inicio de sesión exitoso. Redirigiendo...', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            mostrarAlerta('Usuario o contraseña incorrectos.', 'danger');
        }
    });
});
