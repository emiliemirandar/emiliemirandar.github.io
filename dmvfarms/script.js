// ============================================
// Loading Data from database.json
// ============================================


// syntax: async function functionname() {
// let result = await somePromise(); }


async function loadData() {
  try {
    // Replace w/ chosen API
    // Examples:
    // const response = await fetch('https://data.princegeorgescountymd.gov/resource/xxxx.json');
    // const response = await fetch('https://api.nasa.gov/neo/rest/v1/feed?api_key=DEMO_KEY');
    // const data = await response.json();

    const response = await fetch ('database.json')
    const data = await response.json();
    console.log("data loaded", data);

    return data;
    
    // Simulate API delay
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // return mockRestaurantData;
  } catch (error) {
    console.error("Failed to load data:", error);
    throw new Error("Could not load data from API");
  }
}

// export default loadData
