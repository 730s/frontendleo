// Modal Logic
const modal = document.getElementById("registroModal");
const mainMenu = document.getElementById("mainMenu");
const listContainer = document.getElementById("listaOcorrencias");

function openModal() {
    modal.classList.add("active");
}

function closeModal() {
    modal.classList.remove("active");
    document.getElementById("formOcorrencia").reset();
}

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// List View Logic
function showList() {
    mainMenu.style.display = "none";
    listContainer.classList.add("active");
    fetchOcorrencias();
}

function hideList() {
    listContainer.classList.remove("active");
    mainMenu.style.display = "block"; // Restore flex display if it was flex, but block is safer for now, let's check css. 
    // The css says .main-container doesn't have display:flex, but .menu-container does.
    // So block is fine for main-container.
}

let allOcorrencias = [];

async function fetchOcorrencias() {
    const container = document.getElementById("listaContent");
    container.innerHTML = '<p>Carregando...</p>';

    try {
        const response = await fetch(`${CONFIG.API_URL}/ocorrencia/minhas`, {
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        allOcorrencias = await response.json();
        renderOcorrencias(allOcorrencias);

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="color: red;">Erro ao carregar ocorrências.</p>';
        showToast("Erro ao carregar ocorrências", "error");
    }
}

function renderOcorrencias(ocorrencias) {
    const container = document.getElementById("listaContent");

    if (ocorrencias.length === 0) {
        container.innerHTML = '<p>Nenhuma ocorrência encontrada.</p>';
        return;
    }

    let html = '';
    ocorrencias.forEach(oc => {
        let statusClass = '';
        if (oc.status === 'EM ABERTO') statusClass = 'status-aberto';
        else if (oc.status === 'AJUSTADO') statusClass = 'status-ajustado';
        else if (oc.status === 'DESENVOLVIMENTO') statusClass = 'status-desenvolvimento';

        html += `
            <div class="ocorrencia-item">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong>${oc.unidade}</strong>
                    <span class="status-badge ${statusClass}">${oc.status}</span>
                </div>
                <div style="color: #666; font-size: 0.9rem;">
                    <p>CNPJ: ${oc.cnpj}</p>
                    <p>Erro: ${oc.erro}</p>
                    <p>Data: ${oc.data}</p>
                    <p>Prioridade: ${oc.prioridade}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function filterOcorrencias(status) {
    // Update active button state
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.innerText.toUpperCase() === status || (status === 'TODAS' && btn.innerText === 'Todas')) {
            btn.classList.add('active');
        } else if (status === 'EM ABERTO' && btn.innerText === 'Em Aberto') {
            btn.classList.add('active');
        } else if (status === 'AJUSTADO' && btn.innerText === 'Ajustado') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (status === 'TODAS') {
        renderOcorrencias(allOcorrencias);
    } else if (status === 'EM ABERTO') {
        const filtered = allOcorrencias.filter(oc => oc.status === 'EM ABERTO' || oc.status === 'DESENVOLVIMENTO');
        renderOcorrencias(filtered);
    } else {
        const filtered = allOcorrencias.filter(oc => oc.status === status);
        renderOcorrencias(filtered);
    }
}

// CNPJ Mask
const cnpjInput = document.getElementById("cnpj");

cnpjInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 14) value = value.slice(0, 14);
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
    e.target.value = value;
});

// Form Submission
document.getElementById("formOcorrencia").addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    const payload = {
        cnpj: document.getElementById("cnpj").value.replace(/\D/g, ""),
        emailAcesso: document.getElementById("emailAcesso").value,
        unidadeDeNegocio: document.getElementById("unidade").value,
        erro: document.getElementById("erro").value,
        status: document.getElementById("status").value,
        prioridade: document.getElementById("prioridade").value
    };

    try {
        btn.disabled = true;
        btn.innerText = "Carregando...";

        const resposta = await fetch(`${CONFIG.API_URL}/ocorrencia`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        const texto = await resposta.text();

        if (resposta.ok) {
            showToast("Ocorrência registrada com sucesso!", "success");
            e.target.reset();
            closeModal();
        } else {
            showToast(texto, "error");
        }

    } catch (error) {
        showToast("Erro ao registrar ocorrência.", "error");
        console.error(error);
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
});
