const connect = () => {
    const email = $('#email-connect').val()
    const password = $('#password-connect').val()

    if (!email || !password) {
        alert('Veuillez remplir tous les champs.')
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
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        return response.json()
    })
    .then(data => {
        if (data.token) {
            console.log(data)
            alert("Connexion réussie !")

        localStorage.setItem("user", JSON.stringify({
            token: data.token,
            user_id: data.id
        }))

        setTimeout(() => {  window.location.href = "/html/accueil.html" }, 100)
        } else {
            alert(data.error || "Erreur lors de la connexion.")
        }
    })
    .catch(error => {
        console.error("Erreur lors de la connexion :", error)
        alert("Une erreur est survenue, veuillez réessayer.")
    })
    .finally(() => {
        loginButton.prop('disabled', false)
        loginButton.text('Se connecter')
    })
}

const register = () => {
    const email = $('#email-register').val()
    const password = $('#password-register').val()
    const firstName = $('#prenom-register').val()
    const lastName = $('#nom-register').val()
    const type = $('#type').val()

    if (!email || !password || !firstName || !lastName || !type) {
        alert('Veuillez remplir tous les champs.')
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
            alert("Enregistrement réussi !")

        localStorage.setItem("user", JSON.stringify({
            token: data.token,
            user_id: data.id
        }))
        
        setTimeout(() => { window.location.href = "/html/accueil.html" }, 100)
        } else {
            alert(data.error || "Erreur lors de l'enregistrement.")
        }
    })
    .catch(error => {
        console.error("Erreur lors de l'enregistrement :", error)
        alert("Une erreur est survenue. Veuillez réessayer.")
    })
    .finally(() => {
        registerButton.prop('disabled', false)
        registerButton.text('Se connecter')
    })
}

const checkLoginStatus = () => {
    return JSON.parse(localStorage.getItem("user"))?.user_id || false
}