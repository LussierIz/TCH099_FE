const connect = () => {
    // Récupérer les données du formulaire
    const email = $('#email-connect').val()
    const password = $('#password-connect').val()

    // Vérifier si les champs sont remplis
    if (!email || !password) {
        alert('Veuillez remplir tous les champs.')
        return
    }

    // Préparer les données à envoyer dans la requête POST
    const dataConnect = {
        courriel: email,
        mot_passe: password
    }

    // Désactiver le bouton de connexion pendant l'envoi de la requête
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
        // Vérifier si la connexion a réussi
        if (data.success) {
            console.log(data)
            alert("Connexion réussie !")

            localStorage.setItem("user", JSON.stringify({
                logged_in: true,
                username: data.username, // Stocker le nom d'utilisateur
                type: data.type // Stocker le type (étudiant, tuteur, admin)
            }))

            // Rediriger vers la page principale après 150ms
            setTimeout(() => {  window.location.href = "/html/accueil.html" }, 100)
        } else {
            // Si la connexion échoue
            alert(data.error || "Erreur lors de la connexion.")
        }
    })
    .catch(error => {
        console.error("Erreur lors de la connexion :", error)
        alert("Une erreur est survenue, veuillez réessayer.")
    })
    .finally(() => {
        // Réactiver le bouton après la requête (même en cas d'erreur)
        loginButton.prop('disabled', false)
        loginButton.text('Se connecter')
    })
}

const register = () => {
    const email = $('#email-register').val()
    const password = $('#password-register').val()
    const username = $('#username-register').val()
    const firstName = $('#prenom-register').val()
    const lastName = $('#nom-register').val()
    const type = $('#type').val()

    // Vérifier si les champs sont remplis
    if (!email || !password || !username || !firstName || !lastName || !type) {
        alert('Veuillez remplir tous les champs.')
        return
    }

    // Créer un objet avec les données à envoyer
    const dataRegister = {
        courriel: email,
        mot_passe: password,
        username: username,
        prenom: firstName,
        nom: lastName,
        type: type
    }
 
    // Désactiver le bouton de connexion pendant l'envoi de la requête
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
        if (data.success) {
            alert("Enregistrement réussi !")

            localStorage.setItem("user", JSON.stringify({
                logged_in: true,
                username: data.username, // Stocker le nom d'utilisateur
                type: data.type // Stocker le type (étudiant, tuteur, admin)
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
        // Réactiver le bouton après la requête (même en cas d'erreur)
        registerButton.prop('disabled', false)
        registerButton.text('Se connecter')
    })
}

const checkLoginStatus = () => {
    return JSON.parse(localStorage.getItem("user"))?.logged_in || false
}