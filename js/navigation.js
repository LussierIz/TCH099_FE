/**
 * Script dynamique pour la gestion des pages web interactives.
 * Ce fichier prend en charge les interactions utilisateur, 
 * notamment la mise à jour dynamique du contenu,
 * la gestion des événements sur les boutons.
 *
 * Fonctionnalités principales :
 * - Initialisation des composants interactifs après le chargement du DOM.
 * - Gestion de la navigation entre les mois pour l'affichage d'un calendrier.
 * - Affichage et masquage dynamique du formulaire d'ajout de tâche.
 * - Gestion de la soumission du formulaire et ajout des tâches associées.
 *
 * @author Izak Lussier
 * @version 1.1
 * @date 2025-03-11
 */

/**
 * Cette fonction s'exécute dès que le DOM (Document Object Model) est complètement chargé.
 * Cela permet de s'assurer que tous les éléments HTML sont disponibles pour être manipulés,
 * avant d'exécuter toute logique JavaScript.
 */ 
$(document).ready(() => {
    // Permet d'obtenir les informations importantes de l'url
    const urlParams = new URLSearchParams(window.location.search)
    const currentPage = window.location.pathname.split('/').pop()

    if(currentPage !== "profile.html"){
        const sidebarManager = new SidebarManager()
        sidebarManager.init()
    }

    /**
     * Vérification de la page actuelle et exécution des procédures correspondantes.
     * Chaque condition vérifie sur quelle page se trouve l'utilisateur et applique 
     * les modifications nécessaires.
     */
    if (currentPage === "accueil.html"){
        $("#Accueil-page").addClass("active")
        generateUsername()
    }

    if (currentPage === "Bloc-note.html"){
        $("#bloc-note-page").addClass("active")        
    }

    if (currentPage === "Boutique.html"){
        $("#boutique-page").addClass("active")
        generateUsername()
    }

    if(currentPage === "statistiques.html"){
        getStats()
        generateUsername()
    }

    if (currentPage === "Etude.html"){
        $("#etude-page").addClass("active")
        getNombreSession()
        const displayElement = $('.timer-pomodoro')
        const pomodoro = new Pomodoro(displayElement)
        let typeSession = "pomodoro"
        let tempsCumule = 0
        let startTime
        let endTime

        $('#start-pomodoro').on('click', () => {
            pomodoro.start()
            if (typeSession === "pomodoro"){
                startTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
            }
        })

        $('#stop-pomodoro').on('click', () => {
            pomodoro.stop()
            tempsCumule = pomodoro.getTempsCumule()

            console.log(tempsCumule)

            if (typeSession === "pomodoro" && tempsCumule > 0) {
                endTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
                console.log(startTime)
                console.log(endTime)

                if (tempsCumule > 600){enregistrerSessionEtude(tempsCumule, startTime, endTime)}

                tempsCumule = 0
                pomodoro.reset(25 * 60)
            } else {
                console.log("C'était une pause, pas d'envoi")
            }
        })

        $('#initial-pomodoro').on('click', () => {
            typeSession = "pomodoro"
            pomodoro.reset(25 * 60)
        })

        $('#short-break').on('click', () => {
            typeSession = "short-break"
            pomodoro.reset(5 * 60)

        })
        
        $('#long-break').on('click', () => {
            typeSession = "long-break"
            pomodoro.reset(15 * 60)
        })
    }

    if (currentPage === "Friend.html"){
        $("#friend-page").addClass("active")

        const addFriendBtn = document.getElementById('addFriendBtn');
        if (addFriendBtn) {
          addFriendBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const widgetItem = this.closest('.widget-item');
            widgetItem.classList.toggle('open');
          });
        }
      
        document.addEventListener('click', function (e) {
          document.querySelectorAll('.widget-item.open').forEach(function (item) {
            if (!item.contains(e.target)) {
              item.classList.remove('open');
            }
          });
        });
      
        const friendRequestsBtn = document.querySelector(".widget-item.friend-requests .widget-btn");
        if (friendRequestsBtn) {
          friendRequestsBtn.addEventListener("click", function (e) {
            const widgetItem = this.closest('.widget-item');
            widgetItem.classList.toggle('open');
            if (widgetItem.classList.contains('open')) {
              getFriendRequests();
            }
          });
        }
      
        getFriendList();
        getFriendRequests();
    }

    if (currentPage === "login.html"){
        $("#login-page").addClass("active")

        $('#btn-login').click(function(event) {
            event.preventDefault()
            connect()
        })

        $('#btn-register').click(function(event){
            event.preventDefault()
            register()
        })
    }

    if (currentPage === "register.html"){
        $('#btn-register').click(function(event){
            event.preventDefault()
            register()
        })
    }

    if (currentPage === "objectifs.html"){
        $("#objectifs-page").addClass("active")
        loadObjectifs();

        const objForm = document.getElementById("objForm");
        if (objForm) {
            objForm.addEventListener("submit", function (e) {
                e.preventDefault();
                createObjective();
            });
        }
    }

    if (currentPage === "conversation.html"){
        $("#conversation-page").addClass("active")
        generateUsername()
        userID()
        getConvo()

        /**
         * Gestion du clic sur le bouton "Afficher/Masquer les tâches".
         * Permet d'afficher ou de cacher le formulaire d'ajout de tâche en basculant la classe CSS "show".
         */
        $("#new-chat").click(() => {
            $(".ajout-Convo").toggleClass("show")
            $(".chat-container").toggleClass("hidden")
        })
        
        /**
         * Gestion du clic sur le bouton "Fermer" du formulaire d'ajout de tâche.
         * Lorsqu'un utilisateur clique sur ce bouton, l'événement par défaut est annulé 
         * et le formulaire d'ajout de tâche est caché en supprimant la classe CSS "show".
         */
        $("#close").click((event) => {
            event.preventDefault()
            $(".ajout-Convo").removeClass("show")
            $(".chat-container").removeClass("hidden")
        })

        $(".ajout-form").submit((event) => {
            event.preventDefault()
            newConvo()
        })
    }

    if(currentPage ===  "messages.html"){
        getMessages()

        $(".send-btn").on("click", function() {
            newMessage()
        });
    
        $("#message-text").on("keypress", function(e) {
            if (e.which === 13) {
                newMessage()
            }
        });
    }
    
    if(currentPage === "calendrier.html"){
        $("#calendrier-page").addClass("active")
        getTache()

        let currentDate = new Date() // Récupère la date actuelle
        createCalendar(currentDate) // Crée le calendrier pour le mois actuel
        addTacheArray(tblTache) // Ajoute les tâches associées à ce mois       

        /**
         * Gestion du clic sur le bouton "Mois précédent".
         * Met à jour la date en reculant d'un mois, recrée le calendrier et met à jour les tâches.
         */
        $("#prevMonth").click(() => {
            currentDate.setMonth(currentDate.getMonth() - 1)
            createCalendar(currentDate)
            addTacheArray(tblTache)
        })

        /**
         * Gestion du clic sur le bouton "Mois suivant".
         * Lorsque l'utilisateur clique sur ce bouton, le mois actuellement affiché est avancé d'une unité.
         * Ensuite, le calendrier est mis à jour pour refléter le nouveau mois et les tâches associées
         * sont également mises à jour.
         */
        $("#nextMonth").click(() => {
            currentDate.setMonth(currentDate.getMonth() + 1)
            createCalendar(currentDate)
            addTacheArray(tblTache)
        })

        /**
         * Gestion du clic sur le bouton "Afficher/Masquer les tâches".
         * Permet d'afficher ou de cacher le formulaire d'ajout de tâche en basculant la classe CSS "show".
         */
        $("#montre-tache").click(() => {
            $(".ajout-Tache").toggleClass("show")
            $(".calendrier").toggleClass("hidden")
        })

        /**
         * Gestion du clic sur le bouton "Fermer" du formulaire d'ajout de tâche.
         * Lorsqu'un utilisateur clique sur ce bouton, l'événement par défaut est annulé 
         * et le formulaire d'ajout de tâche est caché en supprimant la classe CSS "show".
         */
        $("#close").click((event) => {
            event.preventDefault()
            $(".ajout-Tache").removeClass("show")
            $(".calendrier").removeClass("hidden")
        })

        /**
         * Gestion de la soumission du formulaire d'ajout de tâche.
         * Lorsque l'utilisateur soumet le formulaire, l'événement par défaut est annulé
         * et la fonction `ajoutForm()` est appelée pour ajouter une nouvelle tâche.
         */
        $(".ajout-form").submit((event) => {
            event.preventDefault()
            ajoutForm()
        })
    }

    if (currentPage === "profile.html"){
        populateUserInfo()
        $('#logoutBtn').on('click', () => {
            deconnexion()
        })    
    }

    /**
     * Gestion de la navigation entre les pages via la sidebar.
     * Lorsqu'un bouton est cliqué, l'utilisateur est redirigé vers la page correspondante.
     */
    $('.sidebar-bar').on('click', 'button', function () {
        switch (this.id) {
            case "Accueil-page":
                if (checkLoginStatus()) { window.location.href = "/html/accueil.html" } 
                else { window.location.href = "/html/login.html" }
                break
            case "bloc-note-page":
                if (checkLoginStatus()) { window.location.href = "/html/Bloc-note.html" } 
                else { window.location.href = "/html/login.html" }
                break
            case "boutique-page":
                if (checkLoginStatus()) { window.location.href = "/html/Boutique.html" } 
                else { window.location.href = "/html/login.html" }
                break
            case "etude-page":
                if (checkLoginStatus()) { window.location.href = "/html/Etude.html" } 
                else { window.location.href = "/html/login.html" }
                break
            case "calendrier-page":
                window.location.href = "/html/calendrier.html"
                break
            case "login-page":
                if (checkLoginStatus()) { window.location.href = "/html/login.html" } 
                else { window.location.href = "/html/login.html" }
                break
            case "friend-page":
                if (checkLoginStatus()) { window.location.href = "/html/Friend.html" } 
                else { window.location.href = "/html/login.html" }
                break
            case "objectifs-page":
                if (checkLoginStatus()) { window.location.href = "/html/objectifs.html" } 
                else { window.location.href = "/html/login.html" }
                break
            case "statistiques-page":
                if (checkLoginStatus()) { window.location.href = "/html/statistiques.html" } 
                else { window.location.href = "/html/login.html" }
                break
            case "conversation-page":
                if (checkLoginStatus()) { window.location.href = "/html/conversation.html" } 
                else { window.location.href = "/html/login.html" }
                break
        }
    });

    $("#username, .avatar").on("click", function () {
        if (checkLoginStatus()) {
            window.location.href = "/html/profile.html"; 
        } else {
            window.location.href = "/html/login.html"; 
        }
    });

    $(".back-btn").on("click", function () {
        console.log("Back button clicked");
        window.location.href = "/html/accueil.html"
    });
});