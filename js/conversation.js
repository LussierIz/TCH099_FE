const getConvo = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch (`http://localhost:8000/api/convo/${user.id}`, {
        methode: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        return response.json()
    })
    .then(data => {
        if (data.error) 
            throw new Error("Erreur reçue du serveur: " + data.error)

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
