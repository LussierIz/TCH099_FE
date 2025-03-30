/**
 * Cette classe gère l'affichage et les interactions de la barre latérale (sidebar).
 * Elle permet de basculer l'état de la barre latérale entre rétractée et étendue, 
 * et mémorise l'état dans le localStorage pour une utilisation ultérieure.
 * @author Jiayi Xu et Izak Lussier
 * @version 1.1
 * @date 2025-03-17
 */
class SidebarManager {
    /**
     * Constructeur de la classe SidebarManager.
     * Initialise les éléments nécessaires pour manipuler la sidebar et le contenu principal.
     */
    constructor() {
        // Sélection des éléments HTML à manipuler
        this.sidebar = document.querySelector('.sidebar');
        this.toggleBtn = document.querySelector('.sidebar-toggle');
        this.mainContent = document.querySelector('.main-container');
        this.detachedSidebar = document.createElement('div');
        this.isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        this.isLocked = false;

        this.hoverTimeout = null;
    }

    /**
     * Initialisation de la sidebar.
     * Vérifie si la sidebar était précédemment rétractée (en utilisant localStorage)
     * et applique cet état au chargement de la page.
     * Ajoute des classes CSS nécessaires pour activer les transitions.
     */
    init() {

        //Initialise la sidebar détachée
        this.detachedSidebar.className = 'detached-sidebar';
        this.detachedSidebar.innerHTML = this.sidebar.innerHTML;
        document.body.appendChild(this.detachedSidebar);

        this.updateState();
        this.addEventListeners();

        // Load saved state
        if (localStorage.getItem('sidebarLocked') === 'true') {
            this.lockSidebar();
        }
        // Vérification si la sidebar est réduite dans le localStorage
        if (localStorage.getItem('sidebarCollapsed') === 'true') {
            this.sidebar.classList.add('collapsed');
        }

        // Ajoute les classes pour les transitions après un petit délai
        setTimeout(() => {
            this.sidebar.classList.add('transition-enabled');
            this.mainContent.classList.add('transition-enabled');
        }, 10);

        this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    addEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.handleToggle());
        
        this.toggleBtn.addEventListener('mouseenter', () => this.showDetached());
        this.toggleBtn.addEventListener('mouseleave', () => this.hideDetached());
        this.detachedSidebar.addEventListener('mouseenter', () => this.clearHideTimeout());
        this.detachedSidebar.addEventListener('mouseleave', () => this.hideDetached());
    }

    handleToggle() {
        if (!this.isLocked && !this.isCollapsed) {
            // État 1 -> État 3: Affiche la version réduite
            this.isCollapsed = true;
        } else if (this.isCollapsed && !this.isLocked) {
            // État 3 -> État 4: Affiche la version complète
            this.isCollapsed = false;
            this.isLocked = true;
        } else if (this.isLocked) {
            // État 4 -> État 1: Ferme tout
            this.isLocked = false;
            this.isCollapsed = false;
        }

        this.updateState();
        this.saveState();
    }

    updateState() {
        this.sidebar.classList.remove('active', 'collapsed');
        this.detachedSidebar.classList.remove('visible');

        if (this.isLocked) {
            this.sidebar.classList.add('active');
        } else if (this.isCollapsed) {
            this.sidebar.classList.add('collapsed');
        }

        this.mainContent.style.marginLeft = 
            this.isLocked ? '250px' : 
            this.isCollapsed ? '60px' : 
            '0';
    }

    saveState() {
        localStorage.setItem('sidebarLocked', this.isLocked);
        localStorage.setItem('sidebarCollapsed', this.isCollapsed);
    }

    showDetached() {
        if (this.isCollapsed && !this.isLocked) {
            this.clearHideTimeout();
            this.detachedSidebar.classList.add('visible');
        }
    }

    hideDetached() {
        if (!this.isLocked) {
            this.hoverTimeout = setTimeout(() => {
                this.detachedSidebar.classList.remove('visible');
            }, 300);
        }
    }

    clearHideTimeout() {
        clearTimeout(this.hoverTimeout);
    }

    toggleSidebar() {
        this.isLocked = !this.isLocked;
        if (this.isLocked) {
            this.lockSidebar();
        } else {
            this.unlockSidebar();
        }
        localStorage.setItem('sidebarLocked', this.isLocked);
    }

    lockSidebar() {
        this.sidebar.classList.add('active');
        this.detachedSidebar.classList.remove('visible');
        this.isLocked = true;
    }

    unlockSidebar() {
        this.sidebar.classList.remove('active');
        this.isLocked = false;
    }

    showDetached() {
        if (!this.isLocked) {
            this.clearHideTimeout();
            this.detachedSidebar.classList.add('visible');
        }
    }

    hideDetached() {
        if (!this.isLocked) {
            this.hoverTimeout = setTimeout(() => {
                this.detachedSidebar.classList.remove('visible');
            }, 300);
        }
    }

    clearHideTimeout() {
        clearTimeout(this.hoverTimeout);
    }

    /**
     * Permet de basculer l'état de la sidebar entre rétractée et étendue.
     * Sauvegarde l'état de la sidebar dans le localStorage pour conserver l'état entre les sessions.
     */
    toggle() {
        this.sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', this.sidebar.classList.contains('collapsed'));
    }
}