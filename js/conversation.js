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
            
                    const chatName = $('<span></span>').addClass('chat-name').text(convo.name || "Unnamed Conversation")
            
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