function addDevoirToUI(dev) {
    const card = document.createElement("div");
    card.classList.add("devoir-card");
    card.setAttribute("data-id", dev.id_devoir);

    card.innerHTML = `
    <button class="devoir-toggle">▼</button>
    <div class="devoir-content">
        <h3>${dev.titre}</h3>
        <p>${dev.description}</p>
        <span class="goal-deadline">${new Date(dev.date_limite).toLocaleDateString('fr-FR')}</span>
        <div class="devoir-actions">
            <button class="btn-delete">Supprimer</button>
            <button class="btn-share" data-id="${dev.id_devoir}">Envoyer</button> <!-- Ajout de data-id -->
        </div>
    </div>
`;

    // Création de l'overlay
    const overlay = document.createElement("div");
    overlay.classList.add("devoir-overlay");
    
    // Gestion du toggle
    const toggleBtn = card.querySelector(".devoir-toggle");
    toggleBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        card.classList.toggle("expanded");
        
        if (card.classList.contains("expanded")) {
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden'; // Bloque le scroll
        } else {
            overlay.remove();
            document.body.style.overflow = ''; // Réactive le scroll
        }
    });

    // Fermer quand on clique sur l'overlay
    overlay.addEventListener("click", function() {
        card.classList.remove("expanded");
        overlay.remove();
        document.body.style.overflow = '';
    });
    
    // Gestion de la suppression (UN SEUL écouteur d'événement)
    card.querySelector(".btn-delete").addEventListener("click", function(e) {
        e.stopPropagation(); 
        e.preventDefault();
        if (confirm("Voulez-vous vraiment supprimer ce devoir ?")) {
            deleteDevoir(dev.id_devoir);
        }
    });

    card.querySelector(".btn-share").addEventListener("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        shareDevoir(dev.id_devoir);
    });

    document.getElementById("devoirs-list").appendChild(card);
}
   
let isFormSubmitting = false;

function createDevoir() {
    if (isFormSubmitting) return;
    isFormSubmitting = true;
    
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    
    const user = JSON.parse(localStorage.getItem("user"));
    $("#loading-bar").css("visibility", "visible").css("width", "50%");

    const newDevoir = {
        id_utilisateur: user.user_id,
        titre: document.getElementById("titre").value,
        description: document.getElementById("description").value,
        date_limite: document.getElementById("date_limite").value,
        id_destinataire: document.getElementById("id_destinataire").value,
        statut: "à faire"
    };

    fetch("http://localhost:8000/api/create-devoir/create", {
        method: "POST",
        headers: {
           "Authorization": "Bearer " + user.token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newDevoir)
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
        if (data.success) {
            addDevoirToUI({
                id_devoir: data.id_devoir,
                ...newDevoir
            });
            document.getElementById("devoir-form").reset();
        }
    })
    .catch(error => {
        console.error("Erreur:", error);
        showMessage(error.message, true);
    })
    .finally(() => {
        isFormSubmitting = false;
        submitBtn.disabled = false;
        $("#loading-bar").animate({width: "100%"}, 200, () => {
            $("#loading-bar").css("visibility", "hidden").css("width", "0%");
        });
    });
}

function loadDevoir(){
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.user_id || !user?.token) {
        console.error("Informations utilisateur manquantes");
        return;
    }
    
    $("#loading-bar").css("visibility", "visible").css("width", "50%");

    fetch(`http://localhost:8000/api/get-devoirs/${user.user_id}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + user.token,
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
        const devoirsContainer = document.getElementById("devoirs-list");
        devoirsContainer.innerHTML = ""; 

        if (data.success && data.devoirs?.length > 0) {
            data.devoirs.forEach(dev => {
                addDevoirToUI(dev);
            });
        } else {
            devoirsContainer.innerHTML = "<p class='no-devoirs'>Aucun devoir trouvé.</p>";
        }
    })
    .catch(error => {
        console.error("Erreur:", error);
        document.getElementById("devoirs-list").innerHTML = `
            <p class="error-msg">Erreur de chargement: ${error.message}</p>
        `;
    })
    .finally(() => {
        $("#loading-bar").animate({width: "100%"}, 200, () => {
            $("#loading-bar").css("visibility", "hidden").css("width", "0%");
        });
    });
}

// Initialisation optimisée
function initDevoirs() {
    // Charge d'abord les devoirs
    loadDevoir();
    
    // Puis configure le formulaire
    const form = document.getElementById("devoir-form");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            createDevoir();
        });
    }
}

function deleteDevoir(id) {
    const user = JSON.parse(localStorage.getItem("user"));

    const card = document.querySelector(`.devoir-card[data-id="${id}"]`);
    if (!card) {
        console.error("Carte introuvable");
        return;
    }

    // Supprime tous les overlays existants
    document.querySelectorAll('.devoir-overlay').forEach(ov => ov.remove());

    // Désactive le bouton pendant la requête
    const deleteBtn = card.querySelector('.btn-delete');
    deleteBtn.disabled = true;

    fetch(`http://localhost:8000/api/delete-devoir/${id}`, {
        method: "DELETE",
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
        card.remove(); 
        console.log("Suppression réussie", data);
    })
    .catch(error => {
        console.error("Erreur:", error);
        deleteBtn.disabled = false;
        showMessage(`Échec de la suppression : ${error.message}`, true);
    })
    .finally(() => {
        $("#loading-bar").stop().css({width: "0%", visibility: "hidden"});
    });
}
function fetchDevoirsEnvoyes(tuteurId) {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`http://localhost:8000/api/get-devoirs-envoyes/${tuteurId}`, {
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
            const devoirsSection = document.getElementById('liste-devoirs');
            devoirsSection.innerHTML = ''; 
            if (data.success && data.devoirs.length > 0) {
                data.devoirs.forEach(devoir => {
                    const devoirItem = document.createElement('div');
                    devoirItem.classList.add('devoir-item');
                    devoirItem.innerHTML = `
                        <h3>${devoir.titre}</h3>
                        <p>${devoir.description}</p>
                        <p>Date limite: ${new Date(devoir.date_limite).toLocaleDateString()}</p>
                    `;
                    devoirsSection.appendChild(devoirItem);
                });
            } else {
                devoirsSection.innerHTML = '<p>Aucun devoir trouvé.</p>';
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des devoirs:', error);
            document.getElementById('liste-devoirs').innerHTML = '<p>Erreur lors du chargement des devoirs.</p>';
        });
}

function shareDevoir(idDevoir) {
    const user = JSON.parse(localStorage.getItem("user"));

    const btn = document.querySelector(`.btn-share[data-id="${idDevoir}"]`);
    btn.disabled = true;
    btn.textContent = "Envoi en cours...";

    fetch(`http://localhost:8000/api/share-devoir/${idDevoir}`, {
        method: "POST",
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
        alert("Devoir envoyé avec succès !");
    })
    .catch(error => {
        console.error("Erreur:", error);
        alert(`Échec de l'envoi : ${error.message}`);
    })
    .finally(() => {
        btn.disabled = false;
        btn.textContent = "Envoyer";
    });
}