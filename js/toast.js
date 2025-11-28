function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');

    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Icon
    const icon = document.createElement('div');
    icon.className = 'toast-icon';
    icon.innerHTML = type === 'success' ? '✔' : '✖';

    // Content
    const content = document.createElement('div');
    content.className = 'toast-content';

    const title = document.createElement('div');
    title.className = 'toast-title';
    title.innerText = type === 'success' ? 'Sucesso' : 'Erro';

    const msg = document.createElement('div');
    msg.className = 'toast-message';
    msg.innerText = message;

    content.appendChild(title);
    content.appendChild(msg);

    // Close Button
    const closeBtn = document.createElement('div');
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => toast.remove();

    // Assemble
    toast.appendChild(icon);
    toast.appendChild(content);
    toast.appendChild(closeBtn);

    // Add to container
    container.appendChild(toast);

    // Remove after animation (4s wait)
    setTimeout(() => {
        if (toast.parentElement) toast.remove();
    }, 4000);
}
