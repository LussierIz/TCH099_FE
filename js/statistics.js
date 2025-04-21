const getStats = () => {
    const user = JSON.parse(localStorage.getItem("user"))

    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    fetch (`http://localhost:8000/api/stats/${user.user_id}`, {
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
    })
    .then(data => {
        if (data.error){throw new Error("Erreur reçue du serveur: " + data.error)}
        let allEtude = data

        console.log(data)

        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startOfWeek.setHours(0, 0, 0, 0)
        let totalSecondsHeb = 0

        $.each(data, function(_, session) {
            const sessionDate = new Date(session.date_debut + 'T00:00:00')

            if (sessionDate >= startOfWeek && sessionDate <= now) {
                const durationParts = session.Duree.split(':')
                const hours = parseInt(durationParts[0])
                const minutes = parseInt(durationParts[1])
                const seconds = parseInt(durationParts[2])

                totalSecondsHeb += (hours * 3600) + (minutes * 60) + seconds
            } else {
                console.log("Non dans la semaine: ", session.date_debut)
            }
        });

        const totalHoursHeb = (totalSecondsHeb / 3600).toFixed(1)
        
        let totalSeconds = 0
        
        allEtude.forEach(etude => {
            const [h, m, s] = etude.Duree.split(':').map(Number)
            totalSeconds += (h * 3600) + (m * 60) + s
        })
        
        const totalHours = (totalSeconds / 3600).toFixed(1)
        const moyenneHours = ((totalSeconds / allEtude.length) / 3600).toFixed(1)
        
        
        $('#weekly-hours .stats-number').text(`${totalHoursHeb} hrs`)
        $('#total-hours .stats-number').text(`${totalHours} hrs`)
        $('#moyenne-hours .stats-number').text(`${moyenneHours} hrs`)
    })
    .catch(error => {
        console.error("Erreur lors de l'obtention des Messages :", error)
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

const getObjectifStats = () => {
    const user = JSON.parse(localStorage.getItem("user"))

    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    fetch(`http://localhost:8000/api/get-objectifs/${user.user_id}`, {
        method: "GET",
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
    })
    .then(data => {
        console.log(data)

        let nbObjectifs = 0

        data.objectifs.forEach(obj => {
            if(obj.statut === "complété"){nbObjectifs++}
        })

        const elementObjectif = $(`<h3>Objectifs Completes</h3>
            <p class="stats-number">${nbObjectifs}</p>
            <p>Tu as complete ${nbObjectifs} objectifs cette semaine!</p>`)
        
        $('#objectif-complete').empty().append(elementObjectif)
    })
    .catch(error => {
        console.error("Erreur lors du chargement des objectifs :", error);
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