/*    
      Author: Etienne ZONON
      Date:   26/05/2026
      Student_ID : 301559049

  
 */
/*
 * Calcule le montant total en fonction des cases cochées et affiche la confirmation.
 */
// 1. Définition des constantes de prix et de taxe (Taxe ajustée à 13% selon les consignes COMP125)
const BURGER_PRICE = 9.95,
      PIZZA_PRICE = 12.95,
      SHAWARMA_PRICE = 10.50,
      HOT_DOG_PRICE = 4.50,
      BROCHETTE_PRICE = 11.00,
      CESARSALAD_PRICE = 7.95,
      POUTINE_PRICE = 8.50,
      TACOS_PRICE = 9.00,
      NUGGETS_PRICE = 6.00,
      FISH_AND_CHIPS_PRICE = 13.95,
      SALES_TAX = 0.13; // Modifié de 0.07 à 0.13 pour respecter l'énoncé (13%)

// 2. Déclencheurs sur changement d'état (onchange)
document.getElementById("burger").onchange = calcTotal;
document.getElementById("pizza").onchange = calcTotal;
document.getElementById("Shawarma").onchange = calcTotal;
document.getElementById("hot_dog").onchange = calcTotal;
document.getElementById("brochette").onchange = calcTotal;
document.getElementById("CesarSalad").onchange = calcTotal;
document.getElementById("poutine").onchange = calcTotal;
document.getElementById("tacos").onchange = calcTotal;
document.getElementById("nuggets").onchange = calcTotal;
document.getElementById("fish_and_chips").onchange = calcTotal;

// 3. Fonction de formatage en dollars
function formatCurrency(value) {
   return "$" + value.toFixed(2);
}

// 4. Fonction calcTotal() principale
function calcTotal() {
   // a. Déclaration de la variable de coût initialisée à 0
   let cost_variable = 0;

   // b. Déclaration des variables de sélection (.checked)
   let buyBurger = document.getElementById("burger").checked;
   let buyPizza = document.getElementById("pizza").checked;
   let buyShawarma = document.getElementById("Shawarma").checked;
   let buyHotDog = document.getElementById("hot_dog").checked;
   let buyBrochette = document.getElementById("brochette").checked;
   let buyCesarSalad = document.getElementById("CesarSalad").checked;
   let buyPoutine = document.getElementById("poutine").checked;
   let buyTacos = document.getElementById("tacos").checked;
   let buyNuggets = document.getElementById("nuggets").checked;
   let buyFishAndChips = document.getElementById("fish_and_chips").checked;

   // c. Utilisation des structures conditionnelles pas à pas
   if (buyBurger) { cost_variable += BURGER_PRICE; }
   if (buyPizza) { cost_variable += PIZZA_PRICE; }
   if (buyShawarma) { cost_variable += SHAWARMA_PRICE; }
   if (buyHotDog) { cost_variable += HOT_DOG_PRICE; }
   if (buyBrochette) { cost_variable += BROCHETTE_PRICE; }
   if (buyCesarSalad) { cost_variable += CESARSALAD_PRICE; }
   if (buyPoutine) { cost_variable += POUTINE_PRICE; }
   if (buyTacos) { cost_variable += TACOS_PRICE; }
   if (buyNuggets) { cost_variable += NUGGETS_PRICE; }
   if (buyFishAndChips) { cost_variable += FISH_AND_CHIPS_PRICE; }

   // d. Affichage du coût total de la nourriture
   document.getElementById("foodTotal").innerHTML = formatCurrency(cost_variable);

   // e. Déclaration et calcul de la taxe
   let foodTax = cost_variable * SALES_TAX;

   // f. Affichage de la taxe
   document.getElementById("foodTax").innerHTML = formatCurrency(foodTax);

   // g. Déclaration et calcul du coût total de la facture
   let totalCost = cost_variable + foodTax;

   // h. Affichage du montant total de la facture
   document.getElementById("totalBill").innerHTML = formatCurrency(totalCost);
   
   // i. Retourne la valeur finale calculée pour qu'elle puisse être réutilisée lors de la soumission
   return totalCost;
}

// 5. NOUVELLE FONCTION : Déclenchée uniquement lors du clic sur le bouton Submit
function submitOrder() {
    // Force le recalcul pour être sûr d'avoir le montant le plus récent
    let finalTotal = calcTotal();
    
    // Message pop-up personnalisé demandé
    alert("Your order has been received.\nTotal: " + formatCurrency(finalTotal) + "\nThank you!");
}
