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
const quotes = [
    "Le sage apprend des autres, le commun apprend de ses erreurs, le fou n'apprend jamais.",
    "Une seule conversation avec un sage vaut dix ans d'étude.",
    "Même le plus haut arbre naît d'une graine minuscule.",
    "Ne crains pas d'avancer lentement, crains seulement de t'arrêter.",
    "Le diamant ne peut être poli sans friction, l'homme ne peut atteindre la perfection sans épreuves.",
    "Quand le vent du changement souffle, certains construisent des murs, d'autres des moulins",
    "Le savoir est un trésor, mais la pratique en est la clé.",
    "Si tu veux être heureux une heure, fais une sieste. Si tu veux être heureux un jour, pêche. Si tu veux être heureux toute une vie, étudie.",
    "L'encre la plus pâle vaut mieux que la meilleure mémoire.",
    "L'eau creuse la pierre non par sa force, mais par sa persistance.",
    "Apprends comme si tu ne pouvais jamais savoir assez, comme si tu craignais de perdre ce que tu as acquis.",
    "Un livre est un jardin que l'on porte dans sa poche.",
    "L'homme qui déplace une montagne commence par emporter les petites pierres.",
    "Même un cheval rapide a besoin du fouet, même un génie a besoin de travail.",
    "Le papillon ne compte pas les mois, il compte les moments. C'est le temps qui a de la valeur, pas le calendrier.",
    "Le bambou plie mais ne rompt pas : la vraie force est dans la flexibilité mentale.",
    "L'étudiant médiocre voit la rivière et pense aux dangers. L'étudiant sage y voit un chemin vers l'océan.",
    "Ne maudis pas l'obscurité – allume une lanterne. Ne maudis pas l'ignorance – ouvre un livre.",
    "La main qui tient le pinceau façonne le destin.",
    "Hier est un rêve, demain une illusion. Le travail d'aujourd'hui est la clé de l'éternité.",
    "Celui qui pose une question reste un fou cinq minutes. Celui qui ne pose jamais de questions reste un fou toute sa vie.",
    "La connaissance est comme une rivière : plus elle coule, plus elle creuse son chemin vers l’océan de la sagesse.",
    "Le succès n’est pas une montagne à gravir, mais un chemin à construire pierre par pierre.",
    "Étudie le passé si tu veux définir l’avenir.",
    "Un seul livre peut éclairer mille nuits d’obscurité.",
    "L’élève véritable ne cherche pas à briller, mais à comprendre.",
    "Le papillon ne se compare pas aux autres – il apprend à voler avec ses propres ailes.",
    "Le maître a échoué mille fois avant de montrer la voie.",
    "La nuit est sombre pour celui qui ferme les yeux, mais lumineuse pour celui qui allume une lampe.",
    "Le bambou ne pousse pas en regardant le ciel, mais en ancrant ses racines dans la terre."
  ];
  
  function generateQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('random-quote').textContent = `"${quotes[randomIndex]}"`;
  }
  generateQuote();