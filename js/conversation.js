const addEventConvo = () => {
    $(".chat-item").each(function() {
        $(this).on('click', () => {
            window.location.href = "/html/messages.html"
        })
    });
}
