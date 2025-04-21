function generateUsername() {
    const user = JSON.parse(localStorage.getItem('user'));
    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    fetch(`http://localhost:8000/api/get-user/${user.user_id}`, {
        method: 'GET',
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
                return await Promise.reject("Unauthorized");
            }
    
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`)
            }
            return response.json()
        })
        .then(data => {
            if (data.success) {
                console.log(data)
                let xpForLevel = (data.banque.quantite_xp % 60)
                let levelUser =  (data.banque.quantite_xp - xpForLevel) / 60

                let banque = {
                    coins: data.banque.quantite_coins,
                    xp: data.banque.quantite_xp,
                    xpLevel: xpForLevel,
                    xpLeft: (60 - xpForLevel),
                    level: levelUser
                }

                localStorage.setItem('prenom', data.user.prenom);
                localStorage.setItem('banque', JSON.stringify(banque))
                document.getElementById('username').textContent = data.user.prenom;
                const coinsElement = $(`<i class="fas fa-coins"></i><span>${data.banque.quantite_coins}</span>`)
                const xpElement = $(`<i class="fas fa-star"></i><span>LV ${levelUser}</span>`)

                $('#coins').empty().append(coinsElement)
                $('#xp').empty().append(xpElement)
            } else {
                console.error(data.error);
            }
        })
        .catch(error => {
            console.error('Failed to fetch user data:', error)
            if (error === "Unauthorized") {
                return;
            }
    
            alert("Une erreur est survenue, veuillez réessayer.");
        })
        .finally(() => {
            $("#loading-bar").css("width", "100%")
            setTimeout(() => {
                $("#loading-bar").css("visibility", "hidden")
                $("#loading-bar").css("width", "0%")
            }, 200)
        })
}

function populateUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'))
    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")
    if (!user || !user.user_id || !user.token) {
        console.error("User information is missing");
        return;
    }
    fetch(`http://localhost:8000/api/get-user/${user.user_id}`, {
        method: 'GET',
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
            return await Promise.reject("Unauthorized");
        }

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        return response.json()
    })
    .then(data => {
        if (data.success && data.user) {
            let xpForLevel = (data.banque.quantite_xp % 60)
            let levelUser = (data.banque.quantite_xp - xpForLevel) / 60
            
            document.getElementById('userNom').textContent = data.user.nom;
            document.getElementById('userPrenom').textContent = data.user.prenom;
            document.getElementById('userID').textContent = data.user.id_utilisateur;
            document.getElementById('userEmail2').textContent = data.user.email;
            document.getElementById('userStatut').textContent = data.user.statut;
            document.getElementById('userInsc').textContent = data.user.date_inscription;
            document.getElementById('userFullName').textContent = data.user.prenom + " " + data.user.nom;
            document.getElementById('userEmail').textContent = data.user.email;
            document.getElementById('userLevel').textContent = levelUser;
            document.getElementById('userXP').textContent = (xpForLevel + " / 60");
            document.getElementById('userCoins').textContent = data.banque.quantite_coins;

        } else {
            console.error(data.error);
        }
    })
    .catch(error => {
        console.error('Failed to fetch user data:', error)
        if (error === "Unauthorized") {
            return;
        }

        alert("Une erreur est survenue, veuillez réessayer.");
    })
    .finally(() => {
        $("#loading-bar").css("width", "100%")
        setTimeout(() => {
            $("#loading-bar").css("visibility", "hidden")
            $("#loading-bar").css("width", "0%")
        }, 200)
    })
}

function updateBalancesDisplay({coins, xpTotal}) {
    const coinSpan = document.querySelector(".coins-xp .coins span");
    if (coinSpan) coinSpan.textContent = coins;
  
    const xpSpan = document.querySelector(".coins-xp .xp span");
    if (xpSpan) {
      // par exemple "LV 5" reste inchangé ici, mais si tu voulais mettre xpTotal :
      // xpSpan.textContent = `XP ${xpTotal}`
    }
  
    // si la page profil est présente
    const userCoinsEl = document.getElementById("userCoins");
    if (userCoinsEl) userCoinsEl.textContent = coins;
  
    // const userXPEl = document.getElementById("userXP");
    // if (userXPEl) {
    //   const xpForLevel = xpTotal % 60;
    //   userXPEl.textContent = `${xpForLevel} / 60`;
    // }
  
    // const userLevelEl = document.getElementById("userLevel");
    // if (userLevelEl) {
    //   const level = Math.floor(xpTotal / 60);
    //   userLevelEl.textContent = level;
    // }
  }