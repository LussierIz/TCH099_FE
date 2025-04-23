const connect = () => {
    const email = $('#email-connect').val()
    const password = $('#password-connect').val()

    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    if (!email || !password) {
        showMessage('Veuillez remplir tous les champs.', true)
        return
    }

    const dataConnect = {
        courriel: email,
        mot_passe: password
    }

    const loginButton = $('#btn-login')
    loginButton.prop('disabled', true)
    loginButton.text('Connexion en cours...')

    fetch("http://localhost:8000/api/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataConnect)
    })
    .then(async response => {
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || "Erreur lors de la connexion.")
        }
        return data
    })
    .then(data => {
        if (data.token) {
            console.log(data)
            localStorage.setItem("flashMessage", JSON.stringify({
                message:"Connexion réussie !",
                type: "success"
              }));

        localStorage.setItem("user", JSON.stringify({
            token: data.token,
            user_id: data.id,
            statut: data.statut
        }))

            if (data.statut === "tuteur") {
                window.location.href = "/html/Devoirs.html"; 
            } else if (data.statut === "etudiant") {
                window.location.href = "/html/accueil.html";
            } else {
                showMessage("Statut inconnu. Veuillez contacter l'administrateur.", true);
                window.location.href = "/html/login.html";
            }
        }
    })
    .catch(error => {
        console.error("Erreur lors de la connexion :", error)
        showMessage(error.message, true)
    })
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

const register = () => {
    const email = $('#email-register').val()
    const password = $('#password-register').val()
    const firstName = $('#prenom-register').val()
    const lastName = $('#nom-register').val()
    const type = $('#type').val()

    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    if (!email || !password || !firstName || !lastName || !type) {
        showMessage('Veuillez remplir tous les champs.', true)
        return
    }

    const dataRegister = {
        email: email,
        mot_de_passe: password,
        prenom: firstName,
        nom: lastName,
        statut: type
    }
 
    const registerButton = $('#btn-register')
    registerButton.prop('disabled', true)
    registerButton.text('Enregistrement en cours...')

    fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataRegister)
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            console.log(data)
            localStorage.setItem("flashMessage", JSON.stringify({
                message:"Enregistrement réussie !",
                type: "success"
              }));
        localStorage.setItem("user", JSON.stringify({
            token: data.token,
            user_id: data.id,
            statut: data.statut
        }))
        
        setTimeout(() => { window.location.href = "/html/accueil.html" }, 100)
        } else {
            showMessage(data.error || "Erreur lors de l'enregistrement.", true)
        }
    })
    .catch(error => {
        console.error("Erreur lors de l'enregistrement :", error)
        showMessage("Une erreur est survenue. Veuillez réessayer.", true)
    })
    .finally(() => {
        registerButton.prop('disabled', false)
        registerButton.text('Se connecter')

        $("#loading-bar").css("width", "100%")
        setTimeout(() => {
            $("#loading-bar").css("visibility", "hidden")
            $("#loading-bar").css("width", "0%")
        }, 200)
    })
}

const deconnexion = () => {
    localStorage.removeItem("user")
    localStorage.setItem("flashMessage", JSON.stringify({
        message:"Déconnexion réussie !",
        type: "success"
      }));
    window.location.href = "/html/login.html"
}

const checkLoginStatus = () => {
    return JSON.parse(localStorage.getItem("user"))?.user_id || false
}

function showLoading(percent = 50) {
    $("#loading-bar").css({ visibility: "visible", width: `${percent}%` });
}

function hideLoading() {
    $("#loading-bar").css("width", "100%");
    setTimeout(() => {
        $("#loading-bar").css({ visibility: "hidden", width: "0%" });
    }, 200);
}
