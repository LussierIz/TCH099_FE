class Pomodoro {
    constructor(displayElement, duration = 25 * 60){
        this.$displayElement = $(displayElement)
        this.duration = duration
        this.remainingTime = duration
        this.interval = null
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
                this.updateDisplay()
            } else {
                this.stop()
                alert("Temps écoulé !")
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
}