// Máscara de CNPJ
const cnpjInput = document.getElementById("cnpj");

cnpjInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito

    if (value.length > 14) value = value.slice(0, 14);

    // Aplica a máscara: 00.000.000/0000-00
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");

    e.target.value = value;
});

// Carregar erros do backend
async function carregarErros() {
    const erroSelect = document.getElementById("erro");
    try {
        const response = await fetch(`${CONFIG.API_URL}/ocorrencia/erros`);
        if (response.ok) {
            const erros = await response.json();
            erros.forEach(erro => {
                const option = document.createElement("option");
                option.value = erro;
                option.innerText = erro;
                erroSelect.appendChild(option);
            });

            // Adicionar opção "OUTRO"
            const outroOption = document.createElement("option");
            outroOption.value = "OUTRO";
            outroOption.innerText = "OUTRO";
            erroSelect.appendChild(outroOption);
        } else {
            console.error("Erro ao carregar lista de erros.");
            showToast("Erro ao carregar lista de erros.", "error");
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

// Inicializar carregamento de erros
carregarErros();

// Lidar com seleção de "OUTRO"
const erroSelect = document.getElementById("erro");
const erroPersonalizadoInput = document.getElementById("erroPersonalizado");

erroSelect.addEventListener("change", (e) => {
    if (e.target.value === "OUTRO") {
        erroPersonalizadoInput.style.display = "block";
        erroPersonalizadoInput.disabled = false;
        erroPersonalizadoInput.focus();
    } else {
        erroPersonalizadoInput.style.display = "none";
        erroPersonalizadoInput.disabled = true;
        erroPersonalizadoInput.value = "";
    }
});

document.getElementById("formOcorrencia").addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    let erroValue = document.getElementById("erro").value;
    if (erroValue === "OUTRO") {
        erroValue = document.getElementById("erroPersonalizado").value.trim().toUpperCase();
        if (!erroValue) {
            showToast("Por favor, digite o erro.", "error");
            return;
        }
    }

    const payload = {
        cnpj: document.getElementById("cnpj").value.replace(/\D/g, ""), // Envia apenas números
        emailAcesso: document.getElementById("emailAcesso").value,
        unidadeDeNegocio: document.getElementById("unidade").value,
        erro: erroValue,
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
            e.target.reset(); // Limpa o formulário se der certo
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
