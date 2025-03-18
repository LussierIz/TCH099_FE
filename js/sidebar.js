class SidebarManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.toggleBtn = document.querySelector('.sidebar-toggle');
        this.mainContent = document.querySelector('.main-container');
    }

    init() {
        if (localStorage.getItem('sidebarCollapsed') === 'true') {
            this.sidebar.classList.add('collapsed');
        }

        setTimeout(() => {
            this.sidebar.classList.add('transition-enabled')
            this.mainContent.classList.add('transition-enabled')
        }, 10);

        this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', this.sidebar.classList.contains('collapsed'));
    }
}