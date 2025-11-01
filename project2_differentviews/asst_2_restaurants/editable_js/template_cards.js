
/**
 * CARD VIEW - PROVIDED AS EXAMPLE
 * Display data as browsable cards - good for comparing individual items
 */
const upperCaseExceptions = ["BBQ", "TGI", "B&A", "TEX-MEX", "I", "II", "III", "IV", "LLC", "D-LITE", "UMCP", "LANHAM-SEABROOK"];
//Not sure how to get this to work with words like McDonalds or something similar.
function toTitleCase(text) {
  if (!text) return "";
  
  return text
    .toLowerCase()
    .split(" ")
    .map(word => {
      if (upperCaseExceptions.includes(word.toUpperCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function dateFormat(dateString) {
        if (!dateString || dateString === '------') return 'Unknown date';
        const date = new Date(dateString);
        return date.toLocaleDateString();
}

function getBgColor(result) {
  if (!result) return "#F0F0F0"; // default gray
  switch (result) {
    case "Critical Violations":
      return "#F4B8BC";
    case  "Non-Compliant": 
      return "#F4B8BC";
      case  "Facility Closed": 
      return "#F4B8BC";
    case "Facility Reopened":
      return "#FFEDAE"; // yellow
    case "Compliance Schedule - Completed":
      return "#FFEDAE"; // yellow
    case "Compliance Schedule - Outstanding":
      return "#FFEDAE"; // yellow
    case "Compliant":
      return "#C4F4C7"; // green
    default:
      return "#F0F0F0"; // gray
  }
} 

function showCards(data) {

  const maxCards = 10;
  const randomRestaurants = [...data.features]
    .sort(() => Math.random() - 0.5)
    .slice(0, maxCards);
  const cardHTML = randomRestaurants
    .map(features => {
    const restaurants = features.properties;
    const address = toTitleCase(features.properties.address_line_1) + ', ' +
                toTitleCase(features.properties.city) + ', ' +
                features.properties.state + ', ' +
                features.properties.zip;

    const bgColor = getBgColor(restaurants.inspection_results);
      
    return `
      
                <div class="restaurant-card" style="background-color: ${bgColor};">
                 <h2>${toTitleCase(features.properties.name)} <i class="fa-solid fa-utensils" style="color: #000000;"></i></h2>
                    <p><i class="fa-solid fa-location-dot" style="color: #000000;"></i> <strong>${address}</strong></p>
                    <p><i class="fa-solid fa-box" style="color: #000000;"></i> <strong>Inspection Results:</strong> ${features.properties.inspection_results}</p>
                    <p><i class="fa-solid fa-calendar-days" style="color: #000000;"></i> <strong>Date of Last Inspection:</strong> ${dateFormat(features.properties.inspection_date)}</p>
                </div>
            `
    })
    .join("");
     /*html*/ 
  return `
                <h2 class="view-title">Maryland Restaurant Randomizer</h2>
                <p class="view-description">Examine compliance records for various restaurants across Maryland</p>
                <div class="card-grid">
                    ${cardHTML}
                </div>
            `;
}

export default showCards;