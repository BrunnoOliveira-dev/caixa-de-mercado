document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const status = document.getElementById("login-status");

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const email = form.email.value.trim();
        const password = form.password.value.trim();

        fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: email, 
                senha: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Email ou senha inválidos');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                // Salva o token JWT retornado pelo backend
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', data.tipo);
                localStorage.setItem('id', data.id);
                status.textContent = "Login realizado com sucesso!";
                status.className = "login-status alert-success";
                status.classList.remove("d-none");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1200);
            } else {
                throw new Error(data.message || 'Email ou senha inválidos');
            }
        })
        .catch(err => {
            status.textContent = err.message;
            status.className = "login-status alert-danger";
            status.classList.remove("d-none");
            form.email.value = "";
            form.password.value = "";
        });

    });
});
