/**
 * Script dynamique pour l'implémentation des pages web.
 * Ce fichier gère toutes les requêtes asynchrones (Fetch) ainsi que la gestion 
 * des interactions utilisateur. Il inclut la mise à jour dynamique du contenu, 
 * la gestion des événements sur les boutons et potentiellement l'affichage de 
 * notifications ou d'erreurs en cas de problème réseau.
 *
 * @author Izak Lussier
 * @version 1.1
 * @date 2025-03-11
 */

/**
 * Cette fonction s'exécute dès que le DOM (Document Object Model) est complètement chargé.
 * Cela permet de s'assurer que tous les éléments HTML sont disponibles pour être manipulés,
 * avant d'exécuter toute logique JavaScript.
 */ 
$(document).ready(() => {
    // Permet d'obtenir les informations importantes de l'url
    const urlParams = new URLSearchParams(window.location.search)
    const currentPage = window.location.pathname.split('/').pop()

    if(currentPage === "index.html"){
        let currentDate = new Date() // Récupère la date actuelle
        createCalendar(currentDate) // Crée le calendrier pour le mois actuel
        addTache() // Ajoute les tâches associées à ce mois
        
        /**
         * Gestion du clic sur le bouton "Mois précédent".
         * Met à jour la date en reculant d'un mois, recrée le calendrier et met à jour les tâches.
         */
        $("#prevMonth").click(() => {
            currentDate.setMonth(currentDate.getMonth() - 1)
            createCalendar(currentDate)
            addTache()
        })

        /**
         * Gestion du clic sur le bouton "Mois suivant".
         * Met à jour la date en avançant d'un mois, recrée le calendrier et met à jour les tâches.
         */
        $("#nextMonth").click(() => {
            currentDate.setMonth(currentDate.getMonth() + 1)
            createCalendar(currentDate)
            addTache()
        })
    }
})

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
 * Ajoute une tâche à une date spécifique dans le calendrier.
 * 
 * Cette fonction prend un objet tâche (ici `tacheExemple`), puis crée un élément HTML 
 * représentant cette tâche sous forme de `<div>` contenant un `<li>`. Ensuite, elle 
 * l'ajoute à une cellule de calendrier correspondant à la date de la tâche.
 */
let addTache = () => {
    let task = tacheExemple
    let taskElement = $(`<div class="task"><li>${task.titre}</li></div>`)
    $(`#day-${task.date}`).append(taskElement)
}

let addTacheArray = () => {
    
}