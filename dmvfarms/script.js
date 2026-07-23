// =========================================================
// CONFIG
// =========================================================

// Which boolean fields can appear as checkmark tags, and their labels.
// Add a new { key, label } here any time you add a new true/false field.
const BOOLEAN_BADGES = [
  { key: "organic",      label: "Organic" },
  { key: "woman-owned",  label: "Woman-Owned" },
  { key: "black-owned",  label: "Black-Owned" },
  { key: "regenerative", label: "Regenerative" },
  { key: "family-farm",  label: "Family Farm" }
];

// Maps each farm's "type" value to the id of the container it belongs in.
// The keys on the left must match the "type" values in your JSON exactly.
const TYPE_CONTAINERS = {
  produce: "produce-farms",
  flower: "flower-farms",
  apiary: "apiaries",
  dairy: "dairy-farms"
};

// =========================================================
// HELPERS
// =========================================================

// Prevents farm text (like a description) from being interpreted as HTML.
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// =========================================================
// DATA LOADING
// =========================================================

async function loadData() {
  try {
    const response = await fetch("database.json");
    const data = await response.json();
    console.log("data loaded", data);
    return data;
  } catch (error) {
    console.error("Failed to load data:", error);
    throw new Error("Could not load data from API");
  }
}

// =========================================================
// CARD RENDERING
// =========================================================

function renderFarmCard(farm) {
  // Checkmark tags - only the ones that are true
  const tagsHtml = BOOLEAN_BADGES
    .filter(({ key }) => farm[key] === true)
    .map(({ label }) => `
      <div class="tag">
        <i class="fa-solid fa-circle-check" style="color: #29bf12"></i>
        <p>${escapeHtml(label)}</p>
      </div>
    `)
    .join("");

  // Offerings - tag_1, tag_2, tag_3, ... skipping any that are empty
  const offeringKeys = Object.keys(farm)
    .filter(k => /^tag_\d+$/.test(k))
    .sort();
  const offeringsHtml = offeringKeys
    .map(k => farm[k])
    .filter(Boolean)
    .map(o => `<div class="offering">${escapeHtml(o)}</div>`)
    .join("");

  const cityLine = [farm.city, farm.state].filter(Boolean).join(", ");

  return `
    <div class="card">
      <div class="image-container">
        <div class="location">
          <address>
            <i class="fa-solid fa-location-dot" style="color: #333333"></i>
            ${escapeHtml(cityLine)}
          </address>
        </div>
        <img
          src="${escapeHtml(farm.image || "https://via.placeholder.com/400x250")}"
          alt="${escapeHtml(farm.name)}"
        />
      </div>

      <div class="content-container">
        <h3>${escapeHtml(farm.name)}</h3>

        ${tagsHtml ? `<div class="tag-container">${tagsHtml}</div>` : ""}
        ${offeringsHtml ? `<div class="offering-container">${offeringsHtml}</div>` : ""}

        <hr />
        <p class="description">${escapeHtml(farm.description || "")}</p>

        <div class="button-container">
          ${farm.website ? `
            <a href="${escapeHtml(farm.website)}" class="btn pink" target="_blank" rel="noopener">
              Website
              <i class="fa-solid fa-arrow-up-right-from-square" style="color: rgb(0, 0, 0)"></i>
            </a>` : ""}
          <button class="yellow">More Info</button>
        </div>
      </div>
    </div>
  `;
}

// =========================================================
// SORT FARMS INTO THEIR CONTAINERS
// =========================================================

async function init() {
  try {
    const farms = await loadData();

    for (const [type, containerId] of Object.entries(TYPE_CONTAINERS)) {
      const container = document.getElementById(containerId);
      if (!container) continue; // this page doesn't have that section, skip it

      const matchingFarms = farms.filter(farm => farm.type === type);

      container.innerHTML = matchingFarms.length
        ? matchingFarms.map(farm => renderFarmCard(farm)).join("")
        : `<p class="empty-state">No farms in this category yet.</p>`;
    }
  } catch (error) {
    console.error("Could not render farms:", error);
  }
}

init();
