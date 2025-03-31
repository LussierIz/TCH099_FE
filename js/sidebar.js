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
        this.states = ['expanded', 'collapsed', 'hidden'];
        this.currentState = localStorage.getItem('sidebarState') || 'expanded';
    }

    /**
     * Initialisation de la sidebar.
     * Vérifie si la sidebar était précédemment rétractée (en utilisant localStorage)
     * et applique cet état au chargement de la page.
     * Ajoute des classes CSS nécessaires pour activer les transitions.
     */
    init() {

        this.applyState(this.currentState);

        // Vérification si la sidebar est réduite dans le localStorage
        // if (localStorage.getItem('sidebarCollapsed') === 'true') {
        //     this.sidebar.classList.add('collapsed');
        // }

        // Ajoute les classes pour les transitions après un petit délai
        setTimeout(() => {
            this.sidebar.classList.add('transition-enabled');
            this.mainContent.classList.add('transition-enabled');
        }, 10);

        this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    /**
     * Permet de basculer l'état de la sidebar entre rétractée et étendue.
     * Sauvegarde l'état de la sidebar dans le localStorage pour conserver l'état entre les sessions.
     */
    toggle() {
        const currentIndex = this.states.indexOf(this.currentState);
        this.currentState = this.states[(currentIndex + 1) % this.states.length];

        this.applyState(this.currentState);
        localStorage.setItem('sidebarState', this.currentState);
    }

    applyState(state) {
        this.sidebar.classList.remove('collapsed', 'hidden');
        this.mainContent.style.marginLeft = '240px';

        switch(state) {
            case 'collapsed':
                this.sidebar.classList.add('collapsed');
                this.mainContent.style.marginLeft = '90px';
                break;
            case 'hidden':
                this.sidebar.classList.add('hidden');
                this.mainContent.style.marginLeft = '0';
                break;
            // 'expanded' est l'etat par defaut
        }
    }
}