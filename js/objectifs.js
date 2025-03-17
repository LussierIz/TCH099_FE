// Sélection des éléments DOM
const objForm = document.getElementById('objForm');
const listeObjectifs = document.getElementById('liste-objectifs');
const starRating = document.querySelectorAll('.star-rating span');

// Gestion des étoiles de difficulté
let selectedDifficulty = 1; // par défaut

starRating.forEach(star => {
    star.addEventListener('click', function() {
        selectedDifficulty = parseInt(this.dataset.value);
        updateStarRating(selectedDifficulty);
    });
});

// Mettre à jour l'affichage des étoiles
function updateStarRating(difficulty) {
    starRating.forEach((star, index) => {
        star.classList.toggle('active', index < difficulty);
    });
}

// Soumission du formulaire
objForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Récupération des valeurs du formulaire
    const newGoal = {
        titre: document.getElementById('obj-titre').value,
        description: document.getElementById('obj-desc').value,
        difficulte: selectedDifficulty,
        echeance: document.getElementById('obj-echeance').value,
        progress: 0 // Progression initiale
    };

    // Ajout de l'objectif à la liste
    addGoalToUI(newGoal);

    // Réinitialisation du formulaire
    this.reset();
    updateStarRating(1); // Réinitialiser les étoiles
});

// Ajouter un objectif à l'interface
function addGoalToUI(goal) {
    const goalCard = document.createElement('div');
    goalCard.className = 'objectif-card';
    goalCard.innerHTML = `
        <h3>${goal.titre}</h3>
        <p>${goal.description}</p>
        <div class="goal-progress">
            <div class="progress-bar" style="width: ${goal.progress}%"></div>
        </div>
        <span class="goal-deadline">${new Date(goal.echeance).toLocaleDateString()}</span>
        <button class="btn-delete">Supprimer</button>
    `;

    // Gestion de la suppression
    goalCard.querySelector('.btn-delete').addEventListener('click', () => {
        goalCard.remove();
    });

    listeObjectifs.appendChild(goalCard);
}