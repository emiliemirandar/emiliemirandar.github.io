// ============================================
// Loading Data from database.json
// ============================================


// syntax: async function functionname() {
// let result = await somePromise(); }


async function loadData() {
  try {

    const response = await fetch ('database.json')
    const data = await response.json();
    console.log("data loaded", data);

    return data;
  
  } catch (error) {
    console.error("Failed to load data:", error);
    throw new Error("Could not load data from API");
  }
}

async function init() {
  const farms = await loadData();       
  const html = farms.map(farm => renderFarmCard(farm)).join("");
  document.getElementById("root").innerHTML = html;
}

init();

// export default loadData
