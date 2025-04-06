/**
 * Pour gerer la fonction Friends
 *
 * @author Jiayi Xu
 * @version 1.1
 * @date 2025-04-02
 */

//html ajouter amis
document.addEventListener("DOMContentLoaded", function () {
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
});

//html requetes d'amis
document.addEventListener("DOMContentLoaded", function () {
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
});

document.addEventListener("DOMContentLoaded", function() {
  getFriendList();
});


//envoyer une demande d'ami
function sendFriendRequest() {
  const user = JSON.parse(localStorage.getItem("user"));
  const receiverId = document.getElementById("friend-id").value.trim();

  if (!receiverId) {
    alert("Entrez un ID ami valide");
    return;
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
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then(responseData => {
      if (responseData.success) {
        alert(responseData.success);
      } else if (responseData.error) {
        alert(responseData.error);
      }
    })
    .catch(error => {
      console.error("Erreur lors de lenvoi de la demande dami:", error);
      alert("Une erreur sest produite. Veuillez reessayer!");
    });

}

//requetes d'amis
function getFriendRequests() {
  const user = JSON.parse(localStorage.getItem("user"));
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
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const popup = document.querySelector(".widget-item.friend-requests .widget-popup");
      popup.innerHTML = ""; // enleve le contenu d'avant

      if (data.success && data.requests && data.requests.length > 0) {
        data.requests.forEach(request => {
          const requestDiv = document.createElement("div");
          requestDiv.classList.add("friend-request-item");
          requestDiv.innerHTML = `
            <p>Demande d'ami de l'utilisateur ${request.id_utilisateur1}</p>
            <button onclick="updateFriendRequest(${request.id_amitie}, 'accept')">Accepter</button>
            <button onclick="updateFriendRequest(${request.id_amitie}, 'decline')">Refuser</button>
          `;
          popup.appendChild(requestDiv);
        });
      } else {
        popup.innerHTML = `<p>Aucune demande d'ami</p>`;
      }
    })
    .catch(error => {
      console.error("Erreur lors de la récupération de demandes d'ami:", error);
    });
}

function updateFriendRequest(requestId, action) {
  const user = JSON.parse(localStorage.getItem("user"));
  fetch(`http://localhost:8000/api/friend-request/${requestId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${user.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ action: action })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      alert(data.success || data.error);
      // Apres avoir renouvelé la requete, rafrachis la liste de requetes d'amis
      getFriendRequests();
      if (action == "accept") {
        getFriendList();
      }
    })
    .catch(error => {
      console.error("Erreur lors de la mise à jour de la demande d'ami:", error);
      alert("Une erreur s'est produite. Veuillez réessayer!");
    });
}

function getFriendList() {
  const user = JSON.parse(localStorage.getItem("user"));
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
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const friendsContainer = document.querySelector(".friends-grid");
    friendsContainer.innerHTML = "";

    if (data.success && data.friends && data.friends.length > 0) {
      data.friends.forEach(friend => {
        const card = document.createElement("div");
        card.classList.add("friend-card");
        card.innerHTML = `
          <div class="friend-avatar"></div>
          <h3>${friend.prenom} ${friend.nom}</h3>
          <p>${friend.email}</p>
        `;
        friendsContainer.appendChild(card);
      });
    } else {
      friendsContainer.innerHTML = "<p>Aucun ami trouvé.</p>";
    }
  })
  .catch(error => {
    console.error("Erreur lors de la récupération de la liste d'amis:", error);
  });

}


