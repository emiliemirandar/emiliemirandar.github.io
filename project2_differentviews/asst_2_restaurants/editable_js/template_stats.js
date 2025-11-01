/**
 * STATS VIEW - STUDENTS IMPLEMENT
 * Show aggregate statistics and insights - good for understanding the big picture
 */
function showStats(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Calculate meaningful statistics from the dataset
  // - Present insights visually
  // - Show distributions, averages, counts, etc.
  // - Help users understand patterns in the data
   try {
    if (!data || !Array.isArray(data.features)) {
      throw new Error("Invalid dataset: features not found");
    }
    
  const restaurants = data.features;

// All caps to Title Case
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

  // Total Restaurants
  const total = restaurants.length;
  const compliant = restaurants.filter(restaurants => restaurants.properties.inspection_results === "Compliant").length;
  const nonCompliant = restaurants.filter(restaurants => restaurants.properties.inspection_results === "Non-Compliant", "Critical Violations", "Facility Closed").length;
  const complianceSchedule = restaurants.filter(restaurants => restaurants.properties.inspection_results === "Compliance Schedule - Completed", "Compliance Schedule - Outstanding").length;
  const unknownCompliance = restaurants.filter(restaurants => restaurants.properties.inspection_results === "------", "Facility Reopened").length;
// Restaurant Inspection Results
// 0 "------"
// 1 "Facility Reopened" (ADDED)
// 2 "Critical Violations" (ADDED)
// 3 "Compliance Schedule - Completed" (ADDED)
// 4 "Non-Compliant" (ADDED)
// 5 "Compliant" (ADDED)
// 6 "Compliance Schedule - Outstanding" (ADDED)
// 7 "Facility Closed" (ADDED)


  // Top compliant cities
  const compliantByCity = {};
  restaurants.forEach(r => {
    const city = r.properties.city || "Unknown";
    if (r.properties.inspection_results === "Compliant") {
      compliantByCity[city] = (compliantByCity[city] || 0) + 1;
    }
  });
  const topCompliantCities = Object.entries(compliantByCity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([city, count]) => `
      <div class="city-stat">
        <span class="city-name">${toTitleCase(city)}</span>
        <span class="city-count">${count}</span>
      </div>
    `).join('');

  // Top non-compliant cities
  const nonCompliantByCity = {};
  restaurants.forEach(r => {
    const city = r.properties.city || "Unknown";
    if (["Non-Compliant", "Critical Violations", "Facility Closed"].includes(r.properties.inspection_results)) {
      nonCompliantByCity[city] = (nonCompliantByCity[city] || 0) + 1;
    }
  });
  const topNonCompliantCities = Object.entries(nonCompliantByCity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([city, count]) => `
      <div class="city-stat">
        <span class="city-name">${toTitleCase(city)}</span>
        <span class="city-count">${count}</span>
      </div>
    `).join('');

  // Build HTML
  return `
    <h2 class="view-title">Restaurant Statistics <i class="fa-solid fa-utensils" style="color: #000000;"></i></h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">${total}</div>
        <p class="stat-label">Total Restaurants</p>
      </div>
      <div class="stat-card compliant">
        <div class="stat-number">${compliant}</div>
        <p class="stat-label">Compliant</p>
      </div>
      <div class="stat-card noncompliant">
        <div class="stat-number">${nonCompliant}</div>
        <p class="stat-label">Non-Compliant</p>
      </div>
      <div class="stat-card complianceschedule">
        <div class="stat-number">${complianceSchedule}</div>
        <p class="stat-label">Ongoing Inspection</p>
      </div>
        <div class="stat-card unknown">
        <div class="stat-number">${unknownCompliance}</div>
        <p class="stat-label">Unknown Compliance</p>
      </div>

    <div class="city-comparison">
    <div class="cities">
      <h4>Top Cities - Compliant Restaurants</h4>
      <div class="city-stats top">${topCompliantCities}</div>
    </div>

    <div class="cities">
      <h4>Top Cities - Non-Compliant Restaurants</h4>
      <div class="city-stats bottom">${topNonCompliantCities}</div>
    </div>
    </div>
  `;
} 
  catch (error) {
    console.error(error);
    return `<p class="error">Unable to load stats. Please try again later.</p>`;
  }
}

export default showStats
