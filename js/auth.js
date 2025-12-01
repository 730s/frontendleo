document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    try {
        btn.disabled = true;
        btn.innerText = "Carregando...";

        const resposta = await fetch(`${CONFIG.API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ nome: usuario, senha: senha })
        });

        const texto = await resposta.text();

        if (resposta.ok && texto.includes("sucesso")) {
            showToast("Login realizado com sucesso!", "success");
            setTimeout(() => {
                window.location.href = "menu.html";
            }, 1000); // Wait a bit for the toast
        } else {
            showToast(texto, "error");
        }
    } catch (error) {
        showToast("Erro ao conectar com o servidor.", "error");
        console.error(error);
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
});
