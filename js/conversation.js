const getConvo = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch (`http://localhost:8000/api/convo/${user.id}`, {
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

        const chatList = $('.chat-list')
            chatList.empty()

            data.conversations.forEach(function(convoArray) {
                convoArray.forEach(function(convo) {
                    const listItem = $('<li></li>')
                    const button = $('<button></button>').addClass('chat-item')
            
                    const chatName = $('<span></span>').addClass('chat-name').text(convo.chat_name || "Unnamed Conversation")
            
                    // Formater la date
                    const chatDate = $('<span></span>').addClass('chat-date').text(formatDate(convo.date))
            
                    button.append(chatName, chatDate);
                    listItem.append(button);
                    chatList.append(listItem);
                })
            })

            addEventConvo()
    })
    .catch(error => {
        console.error("Erreur lors de l'obtention des conversations :", error)
        alert("Une erreur est survenue, veuillez réessayer.")
    })
}

const newConvo = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id_invite = $('#id-invite').val();
    const chat_name = $('#nom-convo').val();

    if (!user || !user.id) {
        alert("Utilisateur non connecté !")
        return
    }

    if (!id_invite || !chat_name) {
        alert("Veuillez remplir tous les champs !")
        return
    }

    const dataLogin = {
        chat_name: chat_name,
        id_utilisateur: user.id,
        id_invite: id_invite,
    };

    const newChatButton = $('#ajouter-Convo')
    newChatButton.prop('disabled', true).text('Ajout en cours...')

    fetch("http://localhost:8000/api/convo/new", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataLogin)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json();
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
        newChatButton.prop('disabled', false).text('Ajouter');
    })
}


const addEventConvo = () => {
    $(".chat-item").each(function() {
        $(this).on('click', () => {
            window.location.href = "/html/messages.html"
        })
    });
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    if (isNaN(date)) {
        return "Date not available"
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('fr-FR', options)
}