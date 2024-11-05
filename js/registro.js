document.addEventListener('DOMContentLoaded', function() {
    const formRegister = document.getElementById('registerForm');
    
    formRegister.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const username = document.querySelector('#username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        console.log('Formulario de registro: ', { name, email, username, password, confirmPassword });

        const isValid = formRegister.checkValidity();
        formRegister.classList.add('was-validated');

        // Validaciones de contraseña
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            mostrarAlerta('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.', 'danger');
            return;
        }

        if (password !== confirmPassword) {
            mostrarAlerta('Las contraseñas no coinciden.', 'danger');
            return;
        }

        if (!isValid) {
            mostrarAlerta('Por favor completa todos los campos correctamente.', 'danger');
            return;
        }

        // Registro del usuario
        const registroExitoso = window.registrarUsuario(email, name, password, username);
        if (registroExitoso) {
            mostrarAlerta('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
            formRegister.reset();
            formRegister.classList.remove('was-validated');
            setTimeout(() => {
                window.location.href = 'login.html';

            }, 6000);
        }

    });
});
