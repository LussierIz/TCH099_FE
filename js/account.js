function generateUsername() {
    const user = JSON.parse(localStorage.getItem('user'));
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

            response.json()
        })
        .then(data => {
            if (data.success) {
                localStorage.setItem('prenom', data.user.prenom);
                document.getElementById('username').textContent = data.user.prenom;
            } else {
                console.error(data.error);
            }
        })
        .catch(err => console.error('Failed to fetch user data:', err))
        .finally(() => {
            loginButton.prop('disabled', false)
            loginButton.text('Se connecter')
    
            $("#loading-bar").css("width", "100%")
            setTimeout(() => {
                $("#loading-bar").css("visibility", "hidden")
                $("#loading-bar").css("width", "0%")
            }, 200)
        })
}

function populateUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
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

        response.json()
    })
    .then(data => {
        if (data.success && data.user) {
            document.getElementById('userNom').textContent = data.user.nom;
            document.getElementById('userPrenom').textContent = data.user.prenom;
            document.getElementById('userID').textContent = data.user.id_utilisateur;
            document.getElementById('userEmail2').textContent = data.user.email;
            document.getElementById('userStatut').textContent = data.user.statut;
            document.getElementById('userInsc').textContent = data.user.date_inscription;

            document.getElementById('userFullName').textContent = data.user.prenom + " " + data.user.nom;
            document.getElementById('userEmail').textContent = data.user.email;

        } else {
            console.error(data.error);
        }
    })
    .catch(err => console.error('Echec de la recuperation des donnees dutilisateur:', err))
    .finally(() => {
        loginButton.prop('disabled', false)
        loginButton.text('Se connecter')

        $("#loading-bar").css("width", "100%")
        setTimeout(() => {
            $("#loading-bar").css("visibility", "hidden")
            $("#loading-bar").css("width", "0%")
        }, 200)
    })
}