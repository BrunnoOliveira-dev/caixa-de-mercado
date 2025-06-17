function redirecionar_pagina_caixa() {
    window.location.href = "/caixa";
}

// Segurança básica: só permite acesso se houver userType válido
const allowedTypes = ['GERENTE', 'CAIXA', 'ESTOQUISTA'];
const userType = localStorage.getItem('userType');

if (!allowedTypes.includes(userType)) {
    window.location.href = '/login'; // Redireciona para login se não autenticado
}

const buttonsByRole = {
    GERENTE: [
        { href: '/caixa', class: 'btn btn-primary', icon: 'bi-cash-register', label: 'Caixa' },
        { href: '/estoque', class: 'btn btn-secondary', icon: 'bi-box-seam', label: 'Estoque' },
        { href: '#', class: 'btn btn-dark', icon: '', label: 'Relatórios' },
        { href: '#', class: 'btn btn-success', icon: '', label: 'Configurações' }
    ],
    CAIXA: [
        { href: '/caixa', class: 'btn btn-primary', icon: 'bi-cash-register', label: 'Caixa' },
        { href: '#', class: 'btn btn-success', icon: '', label: 'Configurações' }
    ],
    ESTOQUISTA: [
        { href: '/estoque', class: 'btn btn-secondary', icon: 'bi-box-seam', label: 'Estoque' },
        { href: '#', class: 'btn btn-success', icon: '', label: 'Configurações' }
    ]
};

const btnContainer = document.getElementById('home-buttons');
btnContainer.innerHTML = '';

(buttonsByRole[userType] || []).forEach(btn => {
    const a = document.createElement('a');
    a.href = btn.href;
    a.className = btn.class;
    a.innerHTML = btn.icon ? `<i class="bi ${btn.icon}"></i> ${btn.label}` : btn.label;
    btnContainer.appendChild(a);
});