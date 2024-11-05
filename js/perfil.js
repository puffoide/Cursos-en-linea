document.addEventListener('DOMContentLoaded', function () {
    const profileForm = document.getElementById('profileForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');

    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (usuarioLogueado) {
        nameInput.value = usuarioLogueado.name;
        emailInput.value = usuarioLogueado.email;
    }

    function habilitarCampos() {
        nameInput.disabled = false;
        emailInput.disabled = false;
        passwordInput.disabled = false;
        confirmPasswordInput.disabled = false;
        saveButton.disabled = false;
        editButton.textContent = 'Cancelar';
        editButton.classList.replace('btn-primary', 'btn-secondary');
        editButton.onclick = restablecerCampos;
    }

    function restablecerCampos() {
        nameInput.value = usuarioLogueado.name;
        emailInput.value = usuarioLogueado.email;
        passwordInput.value = '';
        confirmPasswordInput.value = '';
        nameInput.disabled = true;
        emailInput.disabled = true;
        passwordInput.disabled = true;
        confirmPasswordInput.disabled = true;
        saveButton.disabled = true;
        editButton.textContent = 'Editar';
        editButton.classList.replace('btn-secondary', 'btn-primary');
        editButton.onclick = habilitarCampos;
    }

    editButton.onclick = habilitarCampos;

    // Validaciones

    function validarContrasena(password) {
        return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) &&
            /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);
    }


    function validarEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    profileForm.addEventListener('submit', function (event) {
        event.preventDefault();


        const newName = nameInput.value.trim();
        const newEmail = emailInput.value.trim();
        const newPassword = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!newName) {
            mostrarAlerta('Por favor, introduce tu nombre completo.', 'danger');
            return;
        }

        if (!validarEmail(newEmail)) {
            mostrarAlerta('Por favor, introduce un email válido.', 'danger');
            return;
        }

        if (newPassword || confirmPassword) {
            if (!validarContrasena(newPassword)) {
                mostrarAlerta('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.', 'danger');
                return;
            }

            if (newPassword !== confirmPassword) {
                mostrarAlerta('Las contraseñas no coinciden.', 'danger');
                return;
            }

            usuarioLogueado.password = newPassword;
        }

        // Actualizar el nombre y el correo del usuario
        usuarioLogueado.name = newName;
        usuarioLogueado.email = newEmail;

        // Actualizar el usuario en la lista de usuarios
        const usuarioIndex = usuarios.findIndex(user => user.username === usuarioLogueado.username);
        if (usuarioIndex !== -1) {
            usuarios[usuarioIndex] = usuarioLogueado;
        }

        // Guardar en localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));

        // Mostrar alerta de éxito y restablecer los campos
        mostrarAlerta('Perfil actualizado exitosamente.', 'success');
        restablecerCampos();
    });
});
