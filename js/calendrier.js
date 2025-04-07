/**
 * Script interactif de gestion du calendrier et des tâches.
 * Ce fichier prend en charge les interactions utilisateur pour :
 * - Générer dynamiquement un calendrier en fonction du mois et de l'année sélectionnés.
 * - Ajouter, afficher et gérer des tâches associées à des dates spécifiques.
 * - Gérer l'affichage et le masquage dynamique du formulaire d'ajout de tâche.
 * - Mettre à jour le calendrier en fonction des tâches enregistrées.
 *
 * Fonctionnalités principales :
 * - Navigation entre les mois pour afficher le calendrier correspondant.
 * - Vérification et mise en forme des entrées utilisateur pour l'ajout de tâches.
 * - Mise à jour dynamique du calendrier avec les tâches enregistrées.
 *
 * @author Izak Lussier
 * @version 1.1
 * @date 2025-03-11
 */

/**
 * Objet exemple représentant une tâche.
 * Cet objet pourrait être utilisé comme modèle lors d'une requête asynchrone
 * pour récupérer ou envoyer des tâches à un serveur.
 */
const tacheExemple = {
    titre: "Devoir",
    description: "Voici un courte description",
    date: "2025-02-10"
}

/**
 * Tableau contenant la liste des tâches.
 * Chaque tâche est représentée sous forme d'objet avec ses propriétés.
 */
const tblTache = []

// Énumération pour représenter les jours de la semaine
const DaysOfWeek = Object.freeze({
    Sunday: 0, 
    Monday: 1, 
    Tuesday: 2, 
    Wednesday: 3, 
    Thursday: 4, 
    Friday: 5, 
    Saturday: 6
})

//Objet associatif pour obtenir le nom d'un mois à partir de son numéro
const MonthsString = Object.freeze({
    0: "January", 
    1: "February", 
    2: "March", 
    3: "April", 
    4: "May",
    5: "June", 
    6: "July", 
    7: "August",
    8: "September",
    9: "October", 
    10: "November", 
    11: "December"
})

/**
 * Retourne le nombre de jours dans un mois donné d'une année spécifique.
 *
 * @param {number} year - L'année
 * @param {number} month - Le mois (de 0 à 11, où 0 = Janvier et 11 = Décembre)
 * @returns {number} - Le nombre de jours dans le mois spécifié
 *
 */
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()

/**
 * Retourne le jour de la semaine correspondant au premier jour d'un mois donné.
 *
 * @param {number} year - L'année
 * @param {number} month - Le mois (de 0 à 11, où 0 = Janvier et 11 = Décembre)
 * @returns {number} - Le jour de la semaine du premier jour du mois (0 = Dimanche, ..., 6 = Samedi)
 */
const getFirstDay = (year, month) => new Date(year, month, 1).getDay()

/**
 * Vérifie si une date donnée correspond à la date actuelle.
 *
 * @param {number|null} day - Le jour du mois (1-31). Peut être `null` si la date est invalide
 * @param {number} month - Le mois (0-11, où 0 = Janvier et 11 = Décembre)
 * @param {number} year - L'année (ex: 2025)
 * @param {Date} today - L'objet `Date` représentant la date actuelle
 * @returns {boolean} - `true` si la date correspond à aujourd'hui, sinon `false`
 */
const checkCurrentDate = (day, month, year, today) => day !== null && day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

/**
 * Génère une date aléatoire entre l'an 2000 et 2025.
 *
 * @returns {Date} - Un objet `Date` représentant une date aléatoire valide
 */
const getRandomDate = () => {
    let year = Math.floor(Math.random() * (2025 - 2000 + 1)) + 2000
    let month = Math.floor(Math.random() * 12)
    let day = Math.floor(Math.random() * getDaysInMonth(year, month)) + 1
    return new Date(year, month, day)
}

/**
 * Crée un calendrier HTML pour le mois et l'année spécifiés.
 * 
 * Cette fonction génère un tableau de jours correspondant au mois spécifié,
 * avec des cases vides pour les jours avant le premier jour du mois et après 
 * le dernier jour du mois. Elle ajoute également une classe CSS "today" 
 * pour marquer le jour actuel.
 *
 * @param {Date} date - L'objet Date représentant le mois et l'année à afficher
 */
const createCalendar = (date) => {
    let year = date.getFullYear()
    let month = date.getMonth()
    let today = new Date()

    let firstDay = getFirstDay(year, month)
    let daysInMonth = getDaysInMonth(year, month)
    
    let calendrier = []

    for (let i = 0; i < firstDay; i++) {calendrier.push(null)}
    for (let j = 1; j <= daysInMonth; j++) {calendrier.push(j)}
    while (calendrier.length % 7 !== 0) {calendrier.push(null)}

    let calendrierElement = $("#Calendrier")
    calendrierElement.find("tbody").remove()

    let tbody = $("<tbody></tbody>")
    calendrierElement.append(tbody)

    let caption = calendrierElement.find("caption")
    if (caption.length === 0) {
        caption = $("<caption></caption>")
        calendrierElement.prepend(caption)
    }
    caption.text(`${MonthsString[month]} ${year}`)

    let tr = $("<tr></tr>")
    tbody.append(tr)

    calendrier.forEach((day, index) => {
        if (index % 7 === 0 && index !== 0) {
            tr = $("<tr></tr>")
            tbody.append(tr)
        }
        let classes = checkCurrentDate(day, month, year, today) ? "today" : ""
        if (day) {
            let dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            let dayCell = $(`<td id="day-${dateString}" class="${classes}">${day}</td>`)
            tr.append(dayCell)
        } else {tr.append("<td></td>")}
    })
}

/**
 * Fonction permettant d'ajouter une tâche au calendrier.
 */
let ajoutForm = () => {
    // Récupérer les valeurs des champs du formulaire et supprimer les espaces inutiles
    let nomTache = $("#nom-tache").val()
    let descTache = $("#desc-tache").val().trim()
    let dateTache = $("#date-tache").val().trim()
    let nomObjectif = $('#objectif-tache').val()

    /**
     * Vérification et correction du format de la date.
     * Si l'utilisateur a entré un jour ou un mois avec un seul chiffre (ex: "2025-3-7"), 
     * on ajoute un zéro devant pour obtenir un format valide "YYYY-MM-DD".
     */
    let dateParts = dateTache.split("-")
    if (dateParts.length === 3) {
        let year = dateParts[0]
        let month = dateParts[1].padStart(2, '0') // Ajoute un zéro si nécessaire
        let day = dateParts[2].padStart(2, '0')   // Ajoute un zéro si nécessaire
        dateTache = `${year}-${month}-${day}`
    } else {
        alert("Format de date invalide. Utilisez YYYY-MM-DD.")
        return
    }

    // Vérifier que tous les champs sont remplis
    if (nomTache === "" || descTache === "" || dateTache === "") {
        alert("Veuillez remplir tous les champs.")
        return
    }

    // Création de l'objet représentant la tâche
    const tache = {
        titre: nomTache,
        description: descTache,
        date: dateTache,
        titre_objectif: nomObjectif
    }

    // Ajouter la tâche au tableau des tâches et l'afficher dans le calendrier
    tblTache.push(tache)
    addTache(tache)

    createTache(tache)
    
    // Réinitialiser le formulaire et fermer la fenêtre d'ajout de tâche
    $(".ajout-form")[0].reset()
    $(".ajout-Tache").removeClass("show")
    $(".calendrier").removeClass("hidden")
}

/**
 * Ajoute une tâche à une date spécifique dans le calendrier.
 * 
 * @param {Object} tache - L'objet représentant la tâche à ajouter
 * @param {string} tache.titre - Le titre de la tâche
 * @param {string} tache.date_fin - La date de la tâche au format "YYYY-MM-DD"
 */
let addTache = (tache) => {
    let taskElement = $(`<div class="task"><li>${tache.titre}</li></div>`)
    $(`#day-${tache.date_fin}`).append(taskElement)
}

/**
 * Ajoute toutes les tâches du tableau `tblTache` au calendrier.
 * 
 * @param {Array<Object>} tblTache - Tableau contenant toutes les tâches
 */
let addTacheArray = (tblTache) => {
    // Vider le calendrier avant de le mettre à jour pour éviter les doublons
    $(".task").remove()
    // Ajouter chaque tâche dans le calendrier
    tblTache.forEach(tache => addTache(tache))
}

let createTache = (tache) => {
    const user = JSON.parse(localStorage.getItem("user"))

    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    tacheData = tache

    console.log(tacheData)

    fetch("http://localhost:8000/api/creer-tache", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + user.token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tacheData)
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
            const errorData = await response.json(); // Récupérer l'erreur depuis la réponse JSON
            throw new Error(`Erreur HTTP : ${response.status}, Message: ${errorData.error || 'Erreur inconnue'}`);
        }
    })
    .then(data => {
        window.location.reload();
    })
    .catch(error => {
        console.error("Erreur lors de la création de l'objectif:", error);
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

let getTache = () => {
    const user = JSON.parse(localStorage.getItem("user"))

    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")

    fetch(`http://localhost:8000/api/get-taches/${user.user_id}`, {
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
        addTacheArray(data.taches)
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