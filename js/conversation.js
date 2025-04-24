const getConvo = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")


    fetch (`http://localhost:8000/api/convo/${user.user_id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json"
        }
    })
    .then(async response => {
        if (response.status === 401) {
          const errorData = await response.json();
          if (errorData.error === "Token expiré!") {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Votre session a expiré. Veuillez vous reconnecter.",
              type: "error"
            }));
          } else {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Erreur d'authentification : " + errorData.error,
              type: "error"
            }));
          }
            window.location.href = "/html/login.html";
            return await Promise.reject("Unauthorized");
          }
        
          if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
          }
          return response.json()
      })
    .then(data => {
        if (data.error){throw new Error("Erreur reçue du serveur: " + data.error)}

        console.log(data)

        const chatList = $('.chat-list');
        chatList.empty();

        if (!data.conversations || data.conversations.length === 0) {
            chatList.append('<li>Aucune conversation disponible</li>')
            return
        }

        data.conversations.flat().forEach(convo => {
        const listItem = $('<li></li>')
            const button = $('<button></button>')
                .addClass('chat-item')
                .attr('data-id', convo.id_chat)

            const chatName = $('<span></span>')
                .addClass('chat-name')
                .text(convo.chat_name || "Unnamed Conversation")

            const chatDate = $('<span></span>')
                .addClass('chat-date')
                .text(formatDate(convo.date))

            button.append(chatName, chatDate)
            listItem.append(button)
            chatList.append(listItem)
        });

            addEventConvo()
    })
    .catch(error => {
        console.error("Erreur lors de l'obtention des conversations :", error);

        if (error === "Unauthorized") {
            return;
        }

        showMessage("Une erreur est survenue, veuillez réessayer.", true);
    })
    .finally(() => {
        $("#loading-bar").css("width", "100%")
        setTimeout(() => {
            $("#loading-bar").css("visibility", "hidden")
            $("#loading-bar").css("width", "0%")
        }, 200)
    })
}

const newConvo = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const id_invite = $('#id-invite').val()
    const chat_name = $('#nom-convo').val()
    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    if (!user || !user.user_id) {
        showMessage("Utilisateur non connecté !", true)
        return
    }

    if (!id_invite || !chat_name) {
        showMessage("Veuillez remplir tous les champs !", true)
        return
    }

    const dataLogin = {
        chat_name: chat_name,
        id_utilisateur: user.user_id,
        id_invite: id_invite,
    };

    const newChatButton = $('#ajouter-Convo')
    newChatButton.prop('disabled', true).text('Ajout en cours...')

    fetch("http://localhost:8000/api/convo/new", {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataLogin)
    })
    .then(async response => {
        if (response.status === 401) {
          const errorData = await response.json();
          if (errorData.error === "Token expiré!") {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Votre session a expiré. Veuillez vous reconnecter.",
              type: "error"
            }));
          } else {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Erreur d'authentification : " + errorData.error,
              type: "error"
            }));
          }
            window.location.href = "/html/login.html";
            return await Promise.reject("Unauthorized");
          }

          if (response.status === 403) {
            localStorage.setItem("flashMessage", JSON.stringify({
                message: "Vous devez être amis avant tout",
                type: "error"
              }))
          }
        
          if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
          }
          return response.json()
      })
    .then(data => {
        localStorage.setItem("flashMessage", JSON.stringify({
            message: "Création de la conversation réussi !",
            type: "success"
          }))
        location.reload()
    })
    .catch(error => {
        console.error("Erreur lors de la création :", error);
        location.reload()
    })
    .finally(() => {
        newChatButton.prop('disabled', false).text('Ajouter')
        $("#loading-bar").css("width", "100%")
        setTimeout(() => {
            $("#loading-bar").css("visibility", "hidden")
            $("#loading-bar").css("width", "0%")
        }, 200)
    })
}

const rechercherConversations = (terme) => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || !terme.trim()) {
        getConvo()
        return
    }

    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    fetch(`http://localhost:8000/api/convo/search/${user.user_id}?q=${encodeURIComponent(terme)}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json"
        }
    })
    .then(async response => {
        if (response.status === 401) {
          const errorData = await response.json();
          if (errorData.error === "Token expiré!") {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Votre session a expiré. Veuillez vous reconnecter.",
              type: "error"
            }));
          } else {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Erreur d'authentification : " + errorData.error,
              type: "error"
            }));
          }
            window.location.href = "/html/login.html";
            return await Promise.reject("Unauthorized");
          }
        
          if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
          }
          return response.json()
      })
    .then(data => {
        const chatList = $('.chat-list')
        chatList.empty()

        if (!data.conversations || data.conversations.length === 0) {
            chatList.append('<li>Aucune conversation trouvée</li>')
            return
        }

        data.conversations.flat().forEach(convo => {
            const listItem = $('<li></li>');
            const button = $('<button></button>')
                .addClass('chat-item')
                .attr('data-id', convo.id_chat)

            const chatName = $('<span></span>')
                .addClass('chat-name')
                .text(convo.chat_name || "Unnamed Conversation")

            const chatDate = $('<span></span>')
                .addClass('chat-date')
                .text(formatDate(convo.date))

            button.append(chatName, chatDate)
            listItem.append(button)
            chatList.append(listItem)
        })

        addEventConvo()
    })
    .catch(error => {
        console.error("Erreur de recherche :", error);
    })
    .finally(() => {
        $("#loading-bar").css("width", "100%");
        setTimeout(() => {
            $("#loading-bar").css("visibility", "hidden");
            $("#loading-bar").css("width", "0%");
        }, 200)
    })
}

const addEventConvo = () => {
    $(".chat-item").off("click").on("click", function() {
        const convoID = $(this).data('id')
        localStorage.setItem('currentChatID', convoID)
        window.location.href = "/html/messages.html"
    })
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    if (isNaN(date)) {
        return "Date not available"
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('fr-FR', options)
}

document.addEventListener('DOMContentLoaded', function() {
    const btnVoirDevoirs = document.getElementById('btn-voir-devoirs');
    const btnMasquerDevoirs = document.getElementById('btn-masquer-devoirs');
    const listeDevoirs = document.getElementById('liste-devoirs');

    if (btnVoirDevoirs) {
        btnVoirDevoirs.addEventListener('click', function() {
            loadDevoirsRecus();
            btnVoirDevoirs.style.display = 'none';
            btnMasquerDevoirs.style.display = 'inline-block';
        });
    }

    if (btnMasquerDevoirs) {
        btnMasquerDevoirs.addEventListener('click', function() {
            listeDevoirs.innerHTML = '';
            btnMasquerDevoirs.style.display = 'none';
            btnVoirDevoirs.style.display = 'inline-block';
        });
    }
});

// Modifiez la fonction loadDevoirsRecus pour gérer le bouton masquer
function loadDevoirsRecus() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.user_id) {
        console.error("Utilisateur non connecté");
        return;
    }

    const section = document.getElementById('liste-devoirs');
    section.innerHTML = '<p>Chargement des devoirs...</p>';

    fetch(`http://localhost:8000/api/get-devoirs-recus/${user.user_id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json"
        }
    })
    .then(async response => {
        if (response.status === 401) {
          const errorData = await response.json();
          if (errorData.error === "Token expiré!") {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Votre session a expiré. Veuillez vous reconnecter.",
              type: "error"
            }));
          } else {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Erreur d'authentification : " + errorData.error,
              type: "error"
            }));
          }
            window.location.href = "/html/login.html";
            return await Promise.reject("Unauthorized");
          }
        
          if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
          }
          return response.json()
      })
    .then(data => {
        section.innerHTML = '';

        if (data.success && data.devoirs?.length > 0) {
            data.devoirs.forEach(devoir => {
                addDevoirRecuToUI(devoir, section);
            });
        } else {
            section.innerHTML = '<p class="no-devoirs">Aucun devoir reçu.</p>';
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        section.innerHTML = `<p class="error-msg">Erreur lors du chargement: ${error.message}</p>`;
    });
}

function loadDevoirsRecus() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.user_id) {
        console.error("Utilisateur non connecté");
        return;
    }

    // Afficher un indicateur de chargement
    const section = document.getElementById('liste-devoirs');
    section.innerHTML = '<p>Chargement des devoirs...</p>';

    fetch(`http://localhost:8000/api/get-devoirs-recus/${user.user_id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json"
        }
    })
    .then(async response => {
        if (response.status === 401) {
          const errorData = await response.json();
          if (errorData.error === "Token expiré!") {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Votre session a expiré. Veuillez vous reconnecter.",
              type: "error"
            }));
          } else {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Erreur d'authentification : " + errorData.error,
              type: "error"
            }));
          }
            window.location.href = "/html/login.html";
            return await Promise.reject("Unauthorized");
          }
        
          if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
          }
          return response.json()
      })
    .then(data => {
        section.innerHTML = '';

        if (data.success && data.devoirs?.length > 0) {
            data.devoirs.forEach(devoir => {
                addDevoirRecuToUI(devoir, section);
            });
        } else {
            section.innerHTML = '<p class="no-devoirs">Aucun devoir reçu.</p>';
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        section.innerHTML = `<p class="error-msg">Erreur lors du chargement: ${error.message}</p>`;
    });
}

function addDevoirRecuToUI(devoir, container) {
    const card = document.createElement("div");
    card.classList.add("devoir-card");
    card.setAttribute("data-id", devoir.id_devoir);

    // On tronque la description si elle est trop longue
    const shortDescription = devoir.description.length > 150 
        ? devoir.description.substring(0, 150) + '...' 
        : devoir.description;

    card.innerHTML = `
        <div class="devoir-header">
            <h3>${devoir.titre}</h3>
            <button class="devoir-toggle">▼</button>
        </div>
        <div class="devoir-content">
            <p class="devoir-description">
                <span class="short-text">${shortDescription}</span>
                ${devoir.description.length > 150 ? `<span class="full-text" style="display:none">${devoir.description}</span>` : ''}
            </p>
            <div class="devoir-meta">
                <span class="goal-deadline">Pour le: ${new Date(devoir.date_limite).toLocaleDateString('fr-FR')}</span>
                <span class="goal-deadline">De: ${devoir.nom_tuteur || "Tuteur inconnu"}</span>
            </div>
            ${devoir.description.length > 150 ? '<button class="btn-voir-plus">Voir plus</button>' : ''}
        </div>
    `;
    if (devoir.description.length > 150) {
        const btnVoirPlus = card.querySelector('.btn-voir-plus');
        const shortText = card.querySelector('.short-text');
        const fullText = card.querySelector('.full-text');

        btnVoirPlus.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (shortText.style.display === 'none') {
                shortText.style.display = 'inline';
                fullText.style.display = 'none';
                btnVoirPlus.textContent = 'Voir plus';
            } else {
                shortText.style.display = 'none';
                fullText.style.display = 'inline';
                btnVoirPlus.textContent = 'Voir moins';
            }
        });
    }

    // Gestion du toggle pour la carte entière
    const toggleBtn = card.querySelector(".devoir-toggle");
    toggleBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        card.classList.toggle("expanded");
        
        // Gestion de l'overlay
        const overlay = document.querySelector('.devoir-overlay');
        if (card.classList.contains("expanded")) {
            const newOverlay = document.createElement("div");
            newOverlay.classList.add("devoir-overlay");
            document.body.appendChild(newOverlay);
            document.body.style.overflow = 'hidden';
            
            newOverlay.addEventListener("click", function() {
                card.classList.remove("expanded");
                newOverlay.remove();
                document.body.style.overflow = '';
            });
        } else if (overlay) {
            overlay.remove();
            document.body.style.overflow = '';
        }
    });

    container.appendChild(card);
}
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (user?.statut === 'tuteur') {
        const devoirSection = document.getElementById('devoirs-section');
        if (devoirSection) {
            devoirSection.style.display = 'none';
        }
    }

    const btnVoirDevoirs = document.getElementById('btn-voir-devoirs');
    
    btnVoirDevoirs.addEventListener('click', function() {
        loadDevoirsRecus(); 
    });
});