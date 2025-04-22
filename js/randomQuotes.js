/**
 * Script pour la gestion des citations aléatoires dans une page web.
 * Ce script permet d'afficher une citation aléatoire parmi une liste prédéfinie,
 * chaque fois que la fonction `generateQuote()` est appelée.
 *
 * Fonctionnalités principales :
 * - Contient un tableau de citations inspirantes.
 * - Génère une citation aléatoire à partir du tableau et l'affiche dans un élément HTML avec l'ID `random-quote`.
 * - La citation est affichée dans un format de citation entre guillemets.
 *
 * @author Jiayi Xu
 * @version 1.1
 * @date 2025-03-18
 */
function fetchQuotes() {
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Afficher la barre de chargement
  $("#loading-bar").css("visibility", "visible").css("width", "30%");

  fetch(`http://localhost:8000/api/get-random-quote`, {
      method: "GET",
      headers: {
          "Authorization": user?.token ? "Bearer " + user.token : "",
          "Content-Type": "application/json"
      }
  })
  .then(response => {
      if (response.status === 401) {
          return response.json().then(errorData => {
              if (errorData.error === "Token expiré!") {
                  console.log("Session expirée");
              }
              return Promise.reject("Unauthorized");
          });
      }

      if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      const quoteElement = document.getElementById("random-quote");
      
      if (data.success && data.quote?.text) {
          quoteElement.textContent = `"${data.quote.text}"`;
      } else {
          quoteElement.textContent = `"La persévérance est la clé du succès."`; // Citation par défaut
      }
  })
  .catch(error => {
      console.error("Erreur:", error);
      document.getElementById("random-quote").textContent = `"Le savoir est un trésor, mais la pratique en est la clé."`;
  })
  .finally(() => {
      // Cacher progressivement la barre de chargement
      $("#loading-bar").animate({width: "100%"}, 200, () => {
          $("#loading-bar").css("visibility", "hidden").css("width", "0%");
      });
  });
}

// Appel initial et mise à jour périodique
document.addEventListener("DOMContentLoaded", () => {
  fetchQuotes();
  setInterval(fetchQuotes, 1800000); // Rafraîchit toutes les 30 minutes
});