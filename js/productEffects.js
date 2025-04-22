function productEffects(prodId) {
    const banque = JSON.parse(localStorage.getItem("banque")) || {};
    switch (prodId) {
        case 1: // Thème Galaxie
            document.querySelector(".sidebar").classList.add("theme-alternative");
            break;
        case 2: // companion
            const nameEl = document.getElementById("pet-product");
            if (nameEl && !nameEl.textContent.includes("₍^. .^₎⟆")) {
                nameEl.textContent = nameEl.textContent.trim() + " ₍^. .^₎⟆";
            }
            break;
        case 3: 
            loadAndApplyFont("Comic Neue");
            break;
        default:
            console.warn("Effet inconnu pour produit", prodId);
    }
}

  // Charge dynamiquement une font Google et l'applique au body
  function loadAndApplyFont(fontName) {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g,"+")}:wght@400&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  
    link.onload = () => {
      document.body.style.fontFamily = `'${fontName}', sans-serif`;
    };
}
