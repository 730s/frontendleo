document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    try {
        btn.disabled = true;
        btn.innerText = "Carregando...";

        const resposta = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ nome: usuario, senha: senha })
        });

        const texto = await resposta.text();

        if (resposta.ok && texto.includes("sucesso")) {
            showToast("Login realizado com sucesso!", "success");
            setTimeout(() => {
                window.location.href = "http://127.0.0.1:5500/registro.html";
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
