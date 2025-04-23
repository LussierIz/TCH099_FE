/**
 * Script pour la gestion des objectifs dans une interface utilisateur.
 * Ce script permet à l'utilisateur de créer, visualiser et supprimer des objectifs,
 * tout en attribuant une difficulté à chaque objectif via un système de notation par étoiles.
 *
 * Fonctionnalités principales :
 * - Permet à l'utilisateur de soumettre un formulaire pour ajouter un nouvel objectif.
 * - Affiche dynamiquement les objectifs ajoutés dans l'interface, y compris le titre, la description,
 *   la date d'échéance et une barre de progression.
 * - Gère un système de notation par étoiles pour attribuer une difficulté à chaque objectif.
 * - Permet de supprimer un objectif via un bouton de suppression.
 *
 * @author Jiayi Xu
 * @version 1.1
 * @date 2025-03-14
 */
// Fonction pour créer un nouvel objectif
function createObjective() {
    const user = JSON.parse(localStorage.getItem("user"));
    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")
    
    if (!user || !user.user_id || !user.token) {
        showMessage("Vous devez être connecté.", true);
        return;
    }

    // Récupérer les valeurs du formulaire
    const newObjective = {
        id_utilisateur: user.user_id,
        titre: document.getElementById("obj-titre").value,
        description: document.getElementById("obj-desc").value,
        date_debut: new Date().toISOString().split("T")[0], // date du jour au format YYYY-MM-DD
        date_fin: document.getElementById("obj-echeance").value,
        statut: "En cours"
    };

    fetch("http://localhost:8000/api/create-objectif/create", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + user.token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newObjective)
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
            showMessage("Objectif créer !");
            // Actualiser la liste des objectifs
            loadObjectifs();
            // Réinitialiser le formulaire
            document.getElementById("objForm").reset();
        } else if (data.error) {
            showMessage(data.error, true);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la création de l'objectif :", error);
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

// Fonction pour charger les objectifs de l'utilisateur
function loadObjectifs() {
    const user = JSON.parse(localStorage.getItem("user"));
    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    if (!user || !user.user_id || !user.token) {
        console.error("Informations utilisateur manquantes");
        return;
    }

    fetch(`http://localhost:8000/api/get-objectifs/${user.user_id}`, {
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
        const objectifsContainer = document.getElementById("liste-objectifs");
        objectifsContainer.innerHTML = "";

        console.log(data)
        if (data.success && data.objectifs.length > 0) {
            data.objectifs.forEach(obj => {
                addObjectiveToUI(obj);
            });
        } else {
            objectifsContainer.innerHTML = "<p>Aucun objectif trouvé.</p>";
        }
    })
    .catch(error => {
        console.error("Erreur lors du chargement des objectifs :", error);
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

function addObjectiveToUI(obj) {
    const card = document.createElement("div");
    card.classList.add("objectif-card");
    card.setAttribute("data-id", obj.id_objectif);

    const deadline = new Date(obj.date_fin);
    const currentDate = new Date();

    let html = `
        <h3>${obj.titre}</h3>
        <p>${obj.description}</p>
        <span class="goal-deadline">${deadline.toLocaleDateString()}</span>
    `;

    if (obj.statut !== "complété" && deadline < currentDate) {
        html += `<span class="overdue-notice">⏰ En retard !</span><br>`
    }

    html += '<button class="btn-delete">Supprimer</button>'

    if (obj.statut !== "complété") {
        html += `
            <button onclick="showCompleteModal(${obj.id_objectif})">
                Compléter
            </button>
        `
    } else {
        html += `<span class="objectif-complete">✅ Objectif complété</span>`
    }

    card.innerHTML = html;

    card.querySelector(".btn-delete").addEventListener("click", function () {
        showDeleteModal(obj.id_objectif);
    });

    document.getElementById("liste-objectifs").appendChild(card);
}

// Fonction pour supprimer un objectif
function deleteObjective(id) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.user_id || !user.token) {
        showMessage("Vous devez être connecté.", true);
        return;
    }

    fetch(`http://localhost:8000/api/delete-objectif/${id}`, {
        method: "DELETE",
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
        if (data.success) {
            showMessage("Objectif supprimer !");
            // Rafraîchir la liste des objectifs
            // apres suppression reussite
            loadObjectifs();
        } else if (data.error) {
            showMessage(data.error, true);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la suppression de l'objectif :", error);
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


function completerObjectif(id_objectif) {
    const user = JSON.parse(localStorage.getItem("user"))
    fetch(`http://localhost:8000/api/complet-objectif/${id_objectif}`, {
        method: 'POST',
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
        if (data.success) {
            localStorage.setItem("flashMessage", JSON.stringify({
                message: "🎉 Objectif complété !",
                type: "success"
              }))
        } else if (data.error && data.error.includes("tâches")) {
            localStorage.setItem("flashMessage", JSON.stringify({
                message: "⚠️ Vous devez d'abord compléter toutes les tâches liées à cet objectif.",
                type: "error"
              }))
        } else {
            localStorage.setItem("flashMessage", JSON.stringify({
                message: '❌ Erreur : ' + data.error,
                type: "error"
              }))
        }
        location.reload()
    })
    .catch(error => {
        console.error("Erreur lors de la suppression de l'objectif :", error);
        if (error === "Unauthorized" || error === "Invalide") {
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

function showCompleteModal(id_objectif) {
    const modal = document.getElementById('confirmationModal');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');

    modal.style.display = 'flex';

    confirmButton.onclick = function() {
        completerObjectif(id_objectif);
        modal.style.display = 'none';
    };

    cancelButton.onclick = function() {
        modal.style.display = 'none';
    };
}

function showDeleteModal(id_objectif) {
    const modal = document.getElementById('confirmationModal');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');

    modal.style.display = 'flex';

    confirmButton.onclick = function() {
        deleteObjective(id_objectif);
        modal.style.display = 'none';
    };

    cancelButton.onclick = function() {
        modal.style.display = 'none';
    };
}