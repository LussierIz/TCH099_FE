document.addEventListener("DOMContentLoaded", function () {
    generateUsername();
});


function generateUsername() {
    const user = JSON.parse(localStorage.getItem('user'));
    fetch(`http://localhost:8000/api/get-user/${user.user_id}`, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + user.token,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('prenom', data.user.prenom);
                document.getElementById('username').textContent = data.user.prenom;
            } else {
                console.error(data.error);
            }
        })
        .catch(err => console.error('Failed to fetch user data:', err));
}

