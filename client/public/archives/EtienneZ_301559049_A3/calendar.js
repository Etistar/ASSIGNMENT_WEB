/*
   Author: Etienne ZONON
   Date:   31/05/2026
   Student ID: 301559049
   Course: COMP125 - Assignment #2
*/

// 1. Data arrays to populate the calendar layout
const customerNames = [
    "Smith", "Jane", "Peter", "Paul", "Jones", "Chong",
    "Alex", "Mike", "Jackson", "Michael", "Kim", "Tang", "David",
    "Joseph", "Samuel", "Neto", "Christopher", "Hong", "Peace", "Daniel",
    "Jacob", "Christie", "Yin", "Feng", "Julian", "Bube", "Kate",
    "Meghan", "Tim", "Brown", "Fisher"
];

const foodMeals = [
    "Burger", "Pizza", "Shawarma", "Hot Dog", "Brochette", "Caesar Salad", "Poutine", "Tacos", "Nuggets", "Fish & Chips",
    "Burger", "Pizza", "Shawarma", "Hot Dog", "Brochette", "Caesar Salad", "Poutine", "Tacos", "Nuggets", "Fish & Chips",
    "Burger", "Pizza", "Shawarma", "Hot Dog", "Brochette", "Caesar Salad", "Poutine", "Tacos", "Nuggets", "Fish & Chips",
    "Burger" // 31ème jour pour compléter le mois d'août
];

const mealPrices = [
    9.95, 12.95, 10.50, 4.50, 11.00, 7.95, 8.50, 9.00, 6.00, 13.95,
    9.95, 12.95, 10.50, 4.50, 11.00, 7.95, 8.50, 9.00, 6.00, 13.95,
    9.95, 12.95, 10.50, 4.50, 11.00, 7.95, 8.50, 9.00, 6.00, 13.95,
    9.95 // Prix du burger pour le 31ème jour
];

const serviceOptions = [
    "Take-away", "Take-away", "Take-away", "Take-away", "Eat-in", "Eat-in",
    "Eat-in", "Eat-in", "Eat-in", "Eat-in", "Eat-in", "Take-away", "Take-away",
    "Take-away", "Take-away", "Take-away", "Eat-in", "Eat-in", "Take-away", "Take-away",
    "Take-away", "Eat-in", "Eat-in", "Eat-in", "Eat-in", "Eat-in", "Take-away",
    "Eat-in", "Eat-in", "Take-away", "Eat-in"
];

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// 2. Core function to construct and inject the calendar table matrix
function generateCalendar() {
    let container = document.getElementById("calendar-container");
    
    // Set up the structural heading framework
    let html =
     `<h2 class="calendar-title"> Calendar<br>
    <span style="font-size:1.2rem; color:#666;">June 2026</span>
    </h2>`;
    html += `<table class="calendar-table"><thead><tr>`;
    
    // Append standard weekday header bars
    for (let i = 0; i < daysOfWeek.length; i++) {
        html += `<th>${daysOfWeek[i]}</th>`;
    }
    html += `</tr></thead><tbody><tr>`;
    
    // June 2026 begins on a Monday (leaves 1 placeholder empty blocks for Sunday)
    let emptyOffsetDays = 1; 
    //for (let i = 0; i < emptyOffsetDays; i++) {
        html += `<td class="empty-cell"></td>`;
    //}
    
    let currentWeekDay = emptyOffsetDays;
    
    // Loop structural grid iterations for all 30 days of the month
    for (let day = 1; day <= 30; day++) {
        if (currentWeekDay === 7) {
            html += `</tr><tr>`; // Go to newline if it is sup to 7 
            currentWeekDay = 0;
        }
        
        
        // Assemble structural HTML content blocks per table grid cell
        html += `<td>`;
        html += `<span class="date-num">${day}</span>`;
        html += `<div class="order-details">`;
        html += `<div class="order-type">${serviceOptions[day]}</div>`;
        html += `<div>(${customerNames[day]})</div>`;
        html += `<div style="font-style: italic; color:#666;">${foodMeals[day]}</div>`;
        html += `<div style="font-weight: bold; color:#b01e1e;">${mealPrices[day].toFixed(2)}</div>`;
        html += `</div>`;
        html += `</td>`;
        
        currentWeekDay++;
    }
    
  
    
    html += `</tr></tbody></table>`;
    
    // Target insertion point hook directly to paint visual frame architecture
    container.innerHTML = html;
}

// Fire rendering sequences immediately upon browser document window initialization step
window.onload = generateCalendar;