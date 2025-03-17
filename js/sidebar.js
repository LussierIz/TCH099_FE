class SidebarManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.toggleBtn = document.querySelector('.sidebar-toggle');
    }

    init() {
        this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', this.sidebar.classList.contains('collapsed'));
    }
}