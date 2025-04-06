class Pomodoro {
    constructor(displayElement, duration = 25 * 60){
        this.$displayElement = $(displayElement)
        this.duration = duration
        this.remainingTime = duration
        this.interval = null
        this.tempsCumule = 0
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

    getSessionCounter() {
        return this.sessionCounter
    }

    showNotification(message) {
        
    }
}

const enregistrerSessionEtude = (tempsCumule) => {
    const user = JSON.parse(localStorage.getItem("user"))

    $("#loading-bar").css("visibility", "visible")
    $("#loading-bar").css("width", "50%")
}