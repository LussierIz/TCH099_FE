const getConvo = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")


    fetch (`http://localhost:8000/api/convo/${user.user_id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${user.token}`,
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
            throw new Error("Unauthorized"); 
        }

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        return response.json()
    })
    .then(data => {
        if (data.error){throw new Error("Erreur reçue du serveur: " + data.error)}

        console.log(data)

        const chatList = $('.chat-list');
        chatList.empty();

        if (!data.conversations || data.conversations.length === 0) {
            chatList.append('<li>Aucune conversation disponible</li>')
            return
        }

        data.conversations.flat().forEach(convo => {
        const listItem = $('<li></li>')
            const button = $('<button></button>')
                .addClass('chat-item')
                .attr('data-id', convo.id_chat)

            const chatName = $('<span></span>')
                .addClass('chat-name')
                .text(convo.chat_name || "Unnamed Conversation")

            const chatDate = $('<span></span>')
                .addClass('chat-date')
                .text(formatDate(convo.date))

            button.append(chatName, chatDate)
            listItem.append(button)
            chatList.append(listItem)
        });

            addEventConvo()
    })
    .catch(error => {
        console.error("Erreur lors de l'obtention des conversations :", error);

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

const newConvo = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const id_invite = $('#id-invite').val()
    const chat_name = $('#nom-convo').val()
    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    if (!user || !user.user_id) {
        alert("Utilisateur non connecté !")
        return
    }

    if (!id_invite || !chat_name) {
        alert("Veuillez remplir tous les champs !")
        return
    }

    const dataLogin = {
        chat_name: chat_name,
        id_utilisateur: user.user_id,
        id_invite: id_invite,
    };

    const newChatButton = $('#ajouter-Convo')
    newChatButton.prop('disabled', true).text('Ajout en cours...')

    fetch("http://localhost:8000/api/convo/new", {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataLogin)
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
            throw new Error("Unauthorized"); 
        }

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        return response.json()
    })
    .then(data => {
        alert("Conversation créée avec succès !")
        location.reload()
    })
    .catch(error => {
        console.error("Erreur lors de la création :", error);
        alert("Une erreur est survenue, veuillez réessayer.");
    })
    .finally(() => {
        newChatButton.prop('disabled', false).text('Ajouter')
        $("#loading-bar").css("width", "100%")
        setTimeout(() => {
            $("#loading-bar").css("visibility", "hidden")
            $("#loading-bar").css("width", "0%")
        }, 200)
    })
}

const addEventConvo = () => {
    $(".chat-item").off("click").on("click", function() {
        const convoID = $(this).data('id')
        localStorage.setItem('currentChatID', convoID)
        window.location.href = "/html/messages.html"
    })
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    if (isNaN(date)) {
        return "Date not available"
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('fr-FR', options)
}

const userID = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user && user.user_id) {
        $('#user-id').text("Voici votre id pour créer une conversation : " + user.user_id);
    } else {
        $('#user-id').text("Voici votre id pour créer une conversation : Utilisateur non connecté");
    }
}