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

document.getElementById("formOcorrencia").addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    const payload = {
        cnpj: document.getElementById("cnpj").value.replace(/\D/g, ""), // Envia apenas números
        emailAcesso: document.getElementById("emailAcesso").value,
        unidadeDeNegocio: document.getElementById("unidade").value,
        erro: document.getElementById("erro").value,
        status: document.getElementById("status").value,
        prioridade: document.getElementById("prioridade").value
    };

    try {
        btn.disabled = true;
        btn.innerText = "Carregando...";

        const resposta = await fetch("https://ocorrencia-tecnoponto.onrender.com/ocorrencia", {
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
