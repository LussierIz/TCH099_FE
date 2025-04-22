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
        console.error("Utilisateur non connecté");
        return;
    }

    fetch(`http://localhost:8000/api/shop/${user.user_id}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + user.token,
            "Content-Type": "application/json"
        }
    })
        .then(resp => {
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            return resp.json();
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
              <img src="${item.image}" alt="${item.titre}">
              <p class="shop-title">${item.titre}</p>
              <p class="shop-desc">${item.description}</p>
              <button class="buy-btn" ${item.owned ? "disabled" : ""}>
                ${item.owned ? "Possédé" : item.prix + " Coins"}
              </button>
            `;

                    // Si on peut acheter, on lie l’événement
                    if (!item.owned) {
                        card.querySelector(".buy-btn").addEventListener("click", () => {
                            buyItem(user.user_id, item.id_produit);
                        });
                    }
                    container.appendChild(card);
                });
            } else {
                container.innerHTML = "<p>Erreur de chargement.</p>";
            }
        })
        .catch(err => {
            console.error("Erreur boutique :", err);
            document.getElementById("boutique-items")
                .innerHTML = "<p>Impossible de charger la boutique.</p>";
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
        .then(r => r.json())
        .then(json => {
            if (json.success) {
                alert(json.success + "\nNouveau solde : " + json.banque.quantite_coins);
                // Mets à jour le localStorage et la top‐bar sans recharger la page :
                const banque = JSON.parse(localStorage.getItem("banque")) || {};
                banque.coins = json.newBalance;
                updateBalancesDisplay(banque);

                // Applique l’effet du produit acheté
                productEffects(prodId);
                loadBoutiqueItems();
            } else {
                alert("Erreur : " + json.error);
            }
        })
        .catch(err => {
            console.error("Erreur achat :", err);
            alert("L'achat a échoué ; réessaie plus tard.");
        });
}

function loadBoughtItems() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.user_id || !user.token) return;

    fetch(`http://localhost:8000/api/shop/bought/${user.user_id}`, {
        headers: { "Authorization": `Bearer ${user.token}` }
    })
        .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        })
        .then(json => {
            if (!json.success) throw new Error(json.error);
            json.bought.forEach(prodId => productEffects(prodId));
        })
        .catch(err => console.error("Impossible de charger les achats :", err));
}