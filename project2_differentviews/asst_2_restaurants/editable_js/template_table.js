
/**
 * TABLE VIEW - STUDENTS IMPLEMENT
 * Display data in sortable rows - good for scanning specific information
 */
function showTable(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Show data in a table format
  // - Include all important fields
  // - Make it easy to scan and compare
  // - Consider adding sorting functionality

const upperCaseExceptions = ["BBQ", "TGI", "B&A", "TEX-MEX", "I", "II", "III", "IV", "LLC", "D-LITE", "UMCP"];
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

let filteredData = data.features.filter(f =>
  f.properties.inspection_results &&
  f.properties.inspection_results.trim().toLowerCase() === "compliant"
);
filteredData = filteredData.slice(0, 20);      

function getBgColor(result) {
  if (!result) return "#F0F0F0"; // default
  switch (result) {
    case "Compliant":
      return "#C4F4C7"; // green
    default:
      return "#F0F0F0"; // gray
  }
} 
  /**
 * TABLE VIEW - STUDENTS IMPLEMENT
 * Display data in sortable rows - good for scanning specific information
 */
  console.log("showTable() was called");

  let tableRows = "";
  filteredData.slice(0, 20).forEach(features => {
    const name = toTitleCase(features.properties.name);
    const city = toTitleCase(features.properties.city); 
    const results = features.properties.inspection_results; 
    const handWashing = features.properties.proper_hand_washing;
    const illWorkers = features.properties.ill_workers_restricted; 
    const sewage = features.properties.proper_sewage_disposal; 
    const rodentsInsects = features.properties.rodent_and_insects; 
    const result = features.properties.inspection_results;
    const bgColor = getBgColor(result);

    tableRows += `
      <tr style="background-color: ${bgColor}">
        <td>${name}</td>
        <td>${city}</td>
        <td>${results}</td>
        <td>${handWashing}</td>
        <td>${illWorkers}</td>
        <td>${sewage}</td>
        <td>${rodentsInsects}</td>
      </tr>
    `;
  });

  return `
    <h2 class="view-title">Top Restaurants <i class="fa-solid fa-utensils" style="color: #000000;"></i></h2>
    <div>
      <p class="view-description">See the top Maryland restaurants feeding you delicious food that's also safe.<p>
    </div>
    </div>
    <div class="table-wrapper">
      <table class="restaurant-table">
        <thead>
          <tr>
            <th>Restaurant</th>
            <th>City</th>
            <th>Overall Inspection Results</th>
            <th>Hand Washing</th>
            <th>Ill Workers</th>
            <th>Sewage Disposal</th>
            <th>Rodents and Insects</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>
  `;
}

export default showTable;