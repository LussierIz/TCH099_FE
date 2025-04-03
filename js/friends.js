/**
 * Pour gerer la fonction Friends
 *
 * @author Jiayi Xu
 * @version 1.1
 * @date 2025-04-02
 */

document.addEventListener("DOMContentLoaded", function() {
    const addFriendBtn = document.getElementById('addFriendBtn');
    if (addFriendBtn) {
      addFriendBtn.addEventListener('click', function(e) {
        e.stopPropagation(); 
        const widgetItem = this.closest('.widget-item');
        widgetItem.classList.toggle('open');
      });
    }
    
    document.addEventListener('click', function(e) {
      document.querySelectorAll('.widget-item.open').forEach(function(item) {
        if (!item.contains(e.target)) {
          item.classList.remove('open');
        }
      });
    });
  });

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

};