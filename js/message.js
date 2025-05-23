const getMessages = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const convoID = JSON.parse(localStorage.getItem("currentChatID"))

    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    console.log(convoID)

    if (!convoID) {
        console.error("Aucun chat sélectionné.");
        showMessage("Veuillez sélectionner une conversation.", true);
        return;
    }

    fetch (`http://localhost:8000/api/convo/messages/${convoID}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(async response => {
        if (response.status === 401) {
          const errorData = await response.json();
          if (errorData.error === "Token expiré!") {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Votre session a expiré. Veuillez vous reconnecter.",
              type: "error"
            }));
          } else {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Erreur d'authentification : " + errorData.error,
              type: "error"
            }));
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
        if (data.error){throw new Error("Erreur reçue du serveur: " + data.error)}

        console.log(data)

        $('.messages-container').empty()
        data.messages.forEach(function(message) {
            const messageElement = $('<p></p>')

            if (message.id_utilisateur === user.user_id) {
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
        if (error === "Unauthorized") {
            return;
        }

        showMessage("Une erreur est survenue, veuillez réessayer.", true);
    })
    .finally(() => {
        $("#loading-bar").css("width", "100%")
        setTimeout(() => {
            $("#loading-bar").css("visibility", "hidden")
            $("#loading-bar").css("width", "0%")
        }, 200)
    })
}

const newMessage = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const convoID = JSON.parse(localStorage.getItem("currentChatID"))
    const texteMessage = $('#message-text').val()

    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    if (!texteMessage.trim()) {
        showMessage("Veuillez entrer un message.", true)
        return
    }
    
    const dataMessage = {
        id_utilisateur: user.user_id,
        id_chat: convoID,
        texte:texteMessage
    }

    $(".send-btn").prop("disabled", true).text("Envoi en cours...")

    fetch("http://localhost:8000/api/convo/messages/new", {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataMessage)
    })
    .then(async response => {
        if (response.status === 401) {
          const errorData = await response.json();
          if (errorData.error === "Token expiré!") {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Votre session a expiré. Veuillez vous reconnecter.",
              type: "error"
            }));
          } else {
            localStorage.setItem("flashMessage", JSON.stringify({
              message: "Erreur d'authentification : " + errorData.error,
              type: "error"
            }));
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
        console.log(data)
        localStorage.setItem("flashMessage", JSON.stringify({
            message: "Message envoyé !",
            type: "success"
          }));
        location.reload()
    })
    .catch(error => {
        console.error("Erreur lors de la création :", error)
        if (error === "Unauthorized") {
            return;
        }

        showMessage("Une erreur est survenue, veuillez réessayer.", true);
    })
    .finally(() => {
        $(".send-btn").prop("disabled", false).text("Envoyer")
        $("#loading-bar").css("width", "100%")
        setTimeout(() => {
            $("#loading-bar").css("visibility", "hidden")
            $("#loading-bar").css("width", "0%")
        }, 200)
    })
}