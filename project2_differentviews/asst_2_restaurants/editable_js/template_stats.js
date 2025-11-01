/**
 * STATS VIEW - STUDENTS IMPLEMENT
 * Show aggregate statistics and insights - good for understanding the big picture
 */

import loadData from "./load_data.js";

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

function getComplianceCategory(result) {
  if (!result || result === "------") return "unknown";
  if (result === "Compliant - No Health Risk") return "compliant";
  if (["Non-Compliant - Violations Observed", "Critical Violations observed", "Facility Closed"].includes(result)) return "nonCompliant";
  if (["Compliance Schedule - Completed", "Compliance Schedule - Outstanding", "Facility Reopened"].includes(result)) return "schedule";
  return "unknown";
}

async function showStatsView() {
  try {
    const restaurants = await loadData();

    const total = restaurants.length;

    const compliant = restaurants.filter(r => getComplianceCategory(r.inspection_results) === "compliant").length;
    const nonCompliant = restaurants.filter(r => getComplianceCategory(r.inspection_results) === "nonCompliant").length;
    const complianceSchedule = restaurants.filter(r => getComplianceCategory(r.inspection_results) === "schedule").length;
    const unknownCompliance = restaurants.filter(r => getComplianceCategory(r.inspection_results) === "unknown").length;

    // Top cities by compliance
    const countByCity = (filterFunc) => {
      const result = {};
      restaurants.forEach(r => {
        const city = r.city ? toTitleCase(r.city) : "Unknown";
        if (filterFunc(r)) {
          result[city] = (result[city] || 0) + 1;
        }
      });
      return Object.entries(result)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([city, count]) => `
          <div class="city-stat">
            <span class="city-name">${city}</span>
            <span class="city-count">${count}</span>
          </div>
        `)
        .join("");
    };

    const topCompliantCities = countByCity(r => getComplianceCategory(r.inspection_results) === "compliant");
    const topNonCompliantCities = countByCity(r => getComplianceCategory(r.inspection_results) === "nonCompliant");

    // HTML
    document.querySelector(".display-container").innerHTML = `
      <h2 class="view-title">Restaurant Statistics <i class="fa-solid fa-chart-pie"></i></h2>
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

    document.querySelectorAll(".view-button").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === "stats");
    });

  } catch (error) {
    console.error(error);
    document.querySelector(".display-container").innerHTML =
      `<p class="error">Unable to load stats. Please try again later.</p>`;
  }
}

export default showStatsView;
