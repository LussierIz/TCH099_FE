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
    }

    /**
     * Initialisation de la sidebar.
     * Vérifie si la sidebar était précédemment rétractée (en utilisant localStorage)
     * et applique cet état au chargement de la page.
     * Ajoute des classes CSS nécessaires pour activer les transitions.
     */
    init() {
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

    /**
     * Permet de basculer l'état de la sidebar entre rétractée et étendue.
     * Sauvegarde l'état de la sidebar dans le localStorage pour conserver l'état entre les sessions.
     */
    toggle() {
        this.sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', this.sidebar.classList.contains('collapsed'));
    }
}