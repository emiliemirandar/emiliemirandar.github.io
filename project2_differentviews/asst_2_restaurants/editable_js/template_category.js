/**
 * CATEGORY VIEW - STUDENTS IMPLEMENT
 * Group data by categories - good for understanding relationships and patterns
 */
function showCategories(data) {
console.log("showCategories() was called");
console.log([...new Set(data.features.map(f => f.properties.inspection_results))]);
if (!data || !Array.isArray(data.features)) {
  return `<p class="error">Invalid data format.</p>`;
}
  // TODO: Students implement this function
  // Requirements:
  // - Group data by a meaningful category (cuisine, neighborhood, price, etc.)
  // - Show items within each group
  // - Make relationships between groups clear
  // - Consider showing group statistics
const restaurants = data.features;

  if (restaurants.length === 0) {
    return `<p class="error">No restaurant data found.</p>`;
  }

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

 // compliance groups
  const complianceGroups = {
    compliant: {},
    nonCompliant: {},
    schedule: {},
    unknown: {}
  };

  restaurants.forEach(restaurants => {
    const city = toTitleCase(restaurants.properties.city) || "Unknown City";
    const name = toTitleCase(restaurants.properties.name);
    const result = restaurants.properties.inspection_results;

    let group;
    if (result === "Compliant" || result === "Compliance Schedule - Completed") group = "compliant";
    else if (result === "Non-Compliant" || result === "Critical Violations" || result === "Facility Closed") group = "nonCompliant";
    else if (result === "Compliance Schedule - Outstanding" || result === "Facility Reopened") group = "schedule";
    else group = "unknown";

    if (!complianceGroups[group][city]) complianceGroups[group][city] = [];
    complianceGroups[group][city].push(name);
  });

  const groupLabels = {
    compliant: "Compliant",
    nonCompliant: "Non-Compliant",
    schedule: "Compliance Schedule",
    unknown: "Unknown"
  };

  // HTML
  let categoryHTML = "";
  for (const group in complianceGroups) {
    const cities = complianceGroups[group];
    categoryHTML += `
      <div class="category-section">
        <h3 class="category-header ${group}" data-group="${group}">
        <i class="fa fa-caret-right"></i> ${groupLabels[group]}
        </h3>

        <div class="category-items" style="display:none;">
    `;

    for (const city in cities) {
      categoryHTML += `
        <h4 class="category-subheader" data-city="${city}">
          <i class="fa fa-caret-right"></i> ${city} (${cities[city].length})
        </h4>
        <ul class="category-items" id="city-${group}-${city.replace(/\s+/g, '-')}" style="display:none;">
          ${cities[city].map(name => `<li class="category-item">${name}</li>`).join("")}
        </ul>
      `;
    }

    categoryHTML += `</div></div>`;
  }

  // Collapsible
  setTimeout(() => {
    // Compliance group toggle
    document.querySelectorAll(".category-header").forEach(header => {
      header.addEventListener("click", () => {
        const list = header.nextElementSibling;
        const icon = header.querySelector("i");
        if (list.style.display === "none") {
          list.style.display = "block";
          icon.classList.remove("fa-caret-right");
          icon.classList.add("fa-caret-down");
        } else {
          list.style.display = "none";
          icon.classList.remove("fa-caret-down");
          icon.classList.add("fa-caret-right");
        }
      });
    });

    // City toggle
    document.querySelectorAll(".category-subheader").forEach(header => {
      header.addEventListener("click", () => {
        const group = header.closest(".category-section").querySelector(".category-header").dataset.group;
        const list = document.getElementById(`city-${group}-${header.dataset.city.replace(/\s+/g, '-')}`);
        const icon = header.querySelector("i");
        if (list.style.display === "none") {
          list.style.display = "block";
          icon.classList.remove("fa-caret-right");
          icon.classList.add("fa-caret-down");
        } else {
          list.style.display = "none";
          icon.classList.remove("fa-caret-down");
          icon.classList.add("fa-caret-right");
        }
      });
    });
  }, 50);

  return `
    <h2 class="view-title">Restaurants by Compliance & City <i class="fa-solid fa-city" style="color: #000000;"></i></h2>
    ${categoryHTML}
  `;
}

export default showCategories;
