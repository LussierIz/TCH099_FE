$(document).ready(() => {
    let currentDate = new Date()
    createCalendar(currentDate)
    addTache()

    $("#prevMonth").click(() => {
        currentDate.setMonth(currentDate.getMonth() - 1)
        createCalendar(currentDate)
        addTache()
    })

    $("#nextMonth").click(() => {
        currentDate.setMonth(currentDate.getMonth() + 1)
        createCalendar(currentDate)
        addTache()
    })
})

const tacheExemple = {
    titre: "Devoir",
    description: "Voici un courte description",
    date: "2025-02-10"
}

const DaysOfWeek = Object.freeze({
    Sunday: 0, 
    Monday: 1, 
    Tuesday: 2, 
    Wednesday: 3, 
    Thursday: 4, 
    Friday: 5, 
    Saturday: 6
})

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

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
const getFirstDay = (year, month) => new Date(year, month, 1).getDay()
const checkCurrentDate = (day, month, year, today) => day !== null && day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
const getRandomDate = () => {
    let year = Math.floor(Math.random() * (2025 - 2000 + 1)) + 2000
    let month = Math.floor(Math.random() * 12)
    let day = Math.floor(Math.random() * getDaysInMonth(year, month)) + 1
    return new Date(year, month, day)
}

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

let addTache = () => {
    let task = tacheExemple
    let taskElement = $(`<div class="task">${task.titre}</div>`)
    $(`#day-${task.date}`).append(taskElement)
}