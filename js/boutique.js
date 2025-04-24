/**
 * Pour gerer la boutique
 *
 * @author Jiayi Xu
 * @version 1.1
 * @date 2025-04-21
 */

function loadBoutiqueItems() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.user_id || !user.token) {
        showMessage("Utilisateur non connecté. Veuillez vous reconnecter.", true);
        return;
    }

    fetch(`http://localhost:8000/api/shop/${user.user_id}`, {
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
    .then(json => {
        const container = document.getElementById("boutique-items");
        container.innerHTML = "";

        if (json.success && Array.isArray(json.items)) {
            if (json.items.length === 0) {
                container.innerHTML = "<p>Aucun article disponible.</p>";
                return;
            }

            json.items.forEach(item => {
                const card = document.createElement("div");
                card.className = "card-shop";
                card.innerHTML = `
                  <i data-lucide="${item.image}" class="shop-icon"></i>
                  <p class="shop-title">${item.titre}</p>
                  <p class="shop-desc">${item.description}</p>
                  <button class="buy-btn" ${item.owned ? "disabled" : ""}>
                    ${item.owned ? "Possédé" : item.prix + " Coins"}
                  </button>
                `;

                if (!item.owned) {
                    card.querySelector(".buy-btn").addEventListener("click", () => {
                        buyItem(user.user_id, item.id_produit);
                    });
                }

                container.appendChild(card);
            });
            lucide.createIcons();
        } else {
            container.innerHTML = "<p>Erreur de chargement des articles.</p>";
            showMessage("La boutique est vide ou une erreur est survenue.", true);
        }
    })
    .catch(err => {
        console.error("Erreur boutique :", err);
        showMessage("Impossible de charger la boutique. Veuillez réessayer plus tard.", true);
        document.getElementById("boutique-items").innerHTML = "<p>Erreur de chargement.</p>";
    });
}

function buyItem(userId, prodId) {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;

    fetch(`http://localhost:8000/api/shop/buy/${userId}/${prodId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
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
        if (json.success) {
            showMessage(json.success + " Nouveau solde : " + json.banque.quantite_coins);
            const banque = JSON.parse(localStorage.getItem("banque")) || {};
            banque.coins = json.newBalance;
            updateBalancesDisplay(banque);
            productEffects(prodId);
            loadBoutiqueItems();
            generateUsername();
        } else {
            showMessage("Erreur : " + json.error, true);
        }
    })
    .catch(err => {
        console.error("Erreur achat :", err);
        if (err !== "Unauthorized") {
            showMessage("L'achat a échoué ; réessaie plus tard.", true);
        }
    });
}

function loadBoughtItems() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.user_id || !user.token) {
        showMessage("Utilisateur non connecté. Veuillez vous reconnecter.", true);
        return;
    }

    fetch(`http://localhost:8000/api/shop/bought/${user.user_id}`, {
        headers: { "Authorization": `Bearer ${user.token}` }
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
            throw new Error(json.error);
        }
        json.bought.forEach(prodId => productEffects(prodId));
    })
    .catch(err => {
        console.error("Impossible de charger les achats :", err);
        if (err !== "Unauthorized") {
            showMessage("Impossible de récupérer vos achats précédents.", true);
        }
    });
}