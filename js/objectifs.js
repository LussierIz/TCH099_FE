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
    if (!user || !user.user_id || !user.token) {
        alert("Vous devez être connecté.");
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
                alert("Votre session a expiré. Veuillez vous reconnecter.");
            } else {
                alert("Erreur d'authentification : " + errorData.error);
            }
            window.location.href = "/html/login.html";
            throw new Error("Unauthorized"); 
        }

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        return response.json()
    })
    .then(data => {
        if (data.success) {
            alert(data.success);
            // Actualiser la liste des objectifs
            loadObjectifs();
            // Réinitialiser le formulaire
            document.getElementById("objForm").reset();
        } else if (data.error) {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la création de l'objectif :", error);
        alert("Une erreur s'est produite lors de la création de l'objectif.");
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

    fetch(`http://localhost:8000/api/get-objectif/${user.user_id}`, {
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
                alert("Votre session a expiré. Veuillez vous reconnecter.");
            } else {
                alert("Erreur d'authentification : " + errorData.error);
            }
            window.location.href = "/html/login.html";
            throw new Error("Unauthorized"); 
        }

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        return response.json()
    })
    .then(data => {
        const objectifsContainer = document.getElementById("liste-objectifs");
        objectifsContainer.innerHTML = "";
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
        alert("Une erreur s'est produite lors du chargement des objectifs.");
    })
    .finally(() => {
        $("#loading-bar").css("width", "100%")
        setTimeout(() => {
            $("#loading-bar").css("visibility", "hidden")
            $("#loading-bar").css("width", "0%")
        }, 200)
    })
}
// Ajouter un objectif à l'interface utilisateur
function addObjectiveToUI(obj) {
    const card = document.createElement("div");
    card.classList.add("objectif-card");
    card.setAttribute("data-id", obj.id_objectif);
    card.innerHTML = `
      <h3>${obj.titre}</h3>
      <p>${obj.description}</p>
      <span class="goal-deadline">${new Date(obj.date_fin).toLocaleDateString()}</span>
      <button class="btn-delete">Supprimer</button>
    `;

    // Gestion de la suppression
    card.querySelector(".btn-delete").addEventListener("click", function () {
        if (confirm("Voulez-vous vraiment supprimer cet objectif ?")) {
            deleteObjective(obj.id_objectif);
        }
    });

    document.getElementById("liste-objectifs").appendChild(card);
}

// Fonction pour supprimer un objectif
function deleteObjective(id) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.user_id || !user.token) {
        alert("Vous devez être connecté.");
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
                alert("Votre session a expiré. Veuillez vous reconnecter.");
            } else {
                alert("Erreur d'authentification : " + errorData.error);
            }
            window.location.href = "/html/login.html";
            throw new Error("Unauthorized"); 
        }

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        return response.json()
    })
    .then(data => {
        if (data.success) {
            alert(data.success);
            // Rafraîchir la liste des objectifs
            // apres suppression reussite
            loadObjectifs();
        } else if (data.error) {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la suppression de l'objectif :", error);
        alert("Une erreur s'est produite lors de la suppression de l'objectif.");
    })
    .finally(() => {
        $("#loading-bar").css("width", "100%")
        setTimeout(() => {
            $("#loading-bar").css("visibility", "hidden")
            $("#loading-bar").css("width", "0%")
        }, 200)
    })
}