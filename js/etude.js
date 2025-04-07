class Pomodoro {
    constructor(displayElement, duration = 25 * 60){
        this.$displayElement = $(displayElement)
        this.duration = duration
        this.remainingTime = duration
        this.interval = null
        this.tempsCumule = 0
        this.startTime = null
        this.endTime = null
    }

    formatTime(seconds){
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    updateDisplay(){
        this.$displayElement.text(this.formatTime(this.remainingTime))
    }

    start() {
        if (this.interval) {return}
        this.startTime = new Date()
        this.interval = setInterval(() => {
            if (this.remainingTime > 0) {
                this.remainingTime--
                this.tempsCumule = this.duration - this.remainingTime
                this.updateDisplay()
            } else {
                this.stop()
                this.showNotification("Temps écoulé !")
            }
        }, 1000)
    }

    stop() {
        clearInterval(this.interval)
        this.interval = null
    }

    reset(duration = this.duration) {
        this.stop()
        this.remainingTime = duration
        this.updateDisplay()
    }

    getTempsCumule() {
        return this.tempsCumule
    }

    showNotification(message) {
        
    }
}

const enregistrerSessionEtude = (tempsCumule, startTime, endTime) => {
    const user = JSON.parse(localStorage.getItem("user"))

    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    dataSession = {
        user_id: user.user_id,
        duree: tempsCumule,
        date_debut: startTime,
        date_fin: endTime
    }

    fetch("http://localhost:8000/api/session/enregistrer", {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataSession)
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
        location.reload()
    })
    .catch(error => {
        console.error("Erreur lors de la création :", error);
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

const getNombreSession = () => {
    const user = JSON.parse(localStorage.getItem("user"))

    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    fetch(`http://localhost:8000/api/session/${user.user_id}`, {
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
        if (data.error) {
            throw new Error("Erreur reçue du serveur: " + data.error)
        }

        console.log(data)

        const nombreSessions = data.nombre_sessions

        const sessionElement = $('.session.card-style h1')
        sessionElement.append(` ${nombreSessions}`)
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