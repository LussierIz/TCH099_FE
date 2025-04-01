const getMessages = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const convoID = JSON.parse(localStorage.getItem("currentChatID"));

    console.log(convoID)

    if (!convoID) {
        console.error("Aucun chat sélectionné.");
        alert("Veuillez sélectionner une conversation.");
        return;
    }

    fetch (`http://localhost:8000/api/convo/messages/${convoID}`, {
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        return response.json()
    })
    .then(data => {
        if (data.error){throw new Error("Erreur reçue du serveur: " + data.error)}

        console.log(data)

        $('.messages-container').empty()
        data.messages.forEach(function(message) {
            const messageElement = $('<p></p>')

            if (message.id_utilisateur === user.id) {
                messageElement.addClass("me")
            } else {
                messageElement.addClass("other")
            }

            messageElement.text(message.texte)
            $('.messages-container').append(messageElement)
        })
    })
    .catch(error => {
        console.error("Erreur lors de l'obtention des Messages :", error)
        alert("Une erreur est survenue, veuillez réessayer.")
    })
}

const newMessage = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const convoID = JSON.parse(localStorage.getItem("currentChatID"))
    const texteMessage = $('#message-text').val()

    if (!texteMessage.trim()) {
        alert("Veuillez entrer un message.")
        return
    }
    
    const dataMessage = {
        id_utilisateur: user.id,
        id_chat: convoID,
        texte:texteMessage
    }

    $(".send-btn").prop("disabled", true).text("Envoi en cours...")

    fetch("http://localhost:8000/api/convo/messages/new", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataMessage)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        return response.json()
    })
    .then(data => {
        console.log(data)
        location.reload()
    })
    .catch(error => {
        console.error("Erreur lors de la création :", error)
        alert("Une erreur est survenue, veuillez réessayer.")
    })
    .finally(() => {
        $(".send-btn").prop("disabled", false).text("Envoyer")
    })
}