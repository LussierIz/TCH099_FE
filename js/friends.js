/**
 * Pour gerer la fonction Friends
 *
 * @author Jiayi Xu
 * @version 1.1
 * @date 2025-04-02
 */
//envoyer une demande d'ami
function sendFriendRequest() {
  const user = JSON.parse(localStorage.getItem("user"));
  const receiverId = document.getElementById("friend-id").value.trim();

  $("#loading-bar").css("visibility", "visible")
  $("#loading-bar").css("width", "50%")

  if (!receiverId) {
    showMessage("Entrez un ID ami valide", true)
    return
  }

  const data = {
    senderId: user.user_id,
    receiverId: receiverId
  };

  fetch("http://localhost:8000/api/friend-request/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${user.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
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
    .then(responseData => {
      if (responseData.success) {
        showMessage(responseData.success);
      } else if (responseData.error) {
        showMessage(responseData.error, true);
      }
    })
    .catch(error => {
      console.error("Erreur lors de lenvoi de la demande dami:", error);
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

//requetes d'amis
function getFriendRequests() {
  const user = JSON.parse(localStorage.getItem("user"));
  $("#loading-bar").css("visibility", "visible")
  $("#loading-bar").css("width", "50%")

  if (!user || !user.user_id || !user.token) {
    console.error("Informations manquantes sur l'utilisateur");
    return;
  }

  fetch(`http://localhost:8000/api/friend-requests/${user.user_id}`, {
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
      const popup = document.querySelector(".widget-item.friend-requests .widget-popup");
      const requestBtn = document.querySelector(".widget-item.friend-requests .widget-btn");
      popup.innerHTML = ""; // enleve le contenu d'avant

      if (data.success && data.requests && data.requests.length > 0) {
        data.requests.forEach(request => {
          const requestDiv = document.createElement("div");
          requestBtn.classList.add('has-requests');
          requestDiv.classList.add("friend-request-item");
          requestDiv.innerHTML = `
            <p>Demande d'ami de l'utilisateur ${request.id_utilisateur1}</p>
            <button onclick="updateFriendRequest(${request.id_amitie}, 'accept')">Accepter</button>
            <button onclick="updateFriendRequest(${request.id_amitie}, 'decline')">Refuser</button>
          `;
          popup.appendChild(requestDiv);
        });
      } else {
        requestBtn.classList.remove('has-requests');
        popup.innerHTML = `<p>Aucune demande d'ami</p>`;
      }
    })
    .catch(error => {
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

function updateFriendRequest(requestId, action) {
  const user = JSON.parse(localStorage.getItem("user"));
  $("#loading-bar").css("visibility", "visible")
  $("#loading-bar").css("width", "50%")

  fetch(`http://localhost:8000/api/friend-request/${requestId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${user.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ action: action })
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
        showMessage(data.success);
      } else if (data.error) {
        showMessage(data.error, true);
      }

      // Apres avoir renouvelé la requete, rafrachis la liste de requetes d'amis
      getFriendRequests();
      if (action == "accept") {
        getFriendList();
      }
    })
    .catch(error => {
      console.error("Erreur lors de la mise à jour de la demande d'ami:", error);
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

function getFriendList() {
  const user = JSON.parse(localStorage.getItem("user"));
  $("#loading-bar").css("visibility", "visible")
  $("#loading-bar").css("width", "50%")

  if (!user || !user.user_id || !user.token) {
    console.error("Informations manquantes sur l'utilisateur");
    return;
  }
  fetch(`http://localhost:8000/api/friend-list/${user.user_id}`, {
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
      const friendsContainer = document.querySelector(".friends-grid");
      friendsContainer.innerHTML = "";

      if (data.success && data.friends && data.friends.length > 0) {
        data.friends.forEach(friend => {
          const card = document.createElement("div");
          card.classList.add("friend-card");
          card.innerHTML = `
          <i data-lucide="user-pen" class="friend-avatar"></i>
          <h3>${friend.prenom} ${friend.nom}</h3>
          <p>${friend.email}</p>
        `;
          friendsContainer.appendChild(card);
        });
        lucide.createIcons();
      } else {
        friendsContainer.innerHTML = "<p>Aucun ami trouvé.</p>";
      }
    })
    .catch(error => {
      console.error("Erreur lors de la récupération de la liste d'amis:", error);
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

function loadFriendLeaderboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.user_id || !user.token) {
    console.error("Informations manquantes sur l'utilisateur");
    return;
  }

  fetch(`http://localhost:8000/api/friends/weekly-hours/${user.user_id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${user.token}`
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
  .then(json => {
    if (!json.success) {
      console.error("Leaderboard error:", json.error);
      return;
    }
    const container = document.getElementById("leaderboard-items");
    container.innerHTML = "";  
    json.friends.forEach(f => {
      const row = document.createElement("div");
      row.className = "leader-item" + (f.self ? " highlight" : "");
      row.textContent = `${f.prenom} ${f.nom} • ${f.hours} heures`;
      container.appendChild(row);
    });
  })
  .catch(err => console.error("Could not load leaderboard:", err));
}