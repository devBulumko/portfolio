const query = document.getElementById("userquery"); // input
const queryBtn = document.getElementById("search"); // search button
const resultview = document.querySelector(".results"); // results

window.addEventListener('load', () => {
  queryBtn.addEventListener("click", () => {
    resultview.removeAttribute("hidden")
    get_subdomains(query.value);
  });
});
// Function to display results
function displayResults(subdomains) {
  // Clear previous results
  
  resultview.innerHTML = "";

  // Create a download link
  
  if(subdomains.length<1){
      
      resultview.textContent='Found 0 subdomains, or an error occurred. Try again'
  }else{
    resultview.append(`FOUND ${subdomains.length} SUBDOMAINS`)
    const downloadLink = document.createElement("a");
    downloadLink.href = generateDownloadURL(subdomains);
    downloadLink.textContent = "Download Results";
    downloadLink.style.padding = "10px"
    downloadLink.style.border = "1px solid"
    downloadLink.style.textDecoration = "none"
    downloadLink.style.backgroundColor="rgb(90, 90, 90)"
    downloadLink.style.color = "white"
    downloadLink.style.margin = "0 0 20px 10px"
    downloadLink.download = "subdomains.txt";
    // Add the download link to the results container
    resultview.appendChild(downloadLink);
  }

  // Display subdomains
  const subdomainsElement = document.createElement("div");
  subdomainsElement.style.margin = "30px 0 0 0"
  resultview.appendChild(subdomainsElement);
  subdomains.forEach(subdomain => {
    const subdomainElement = document.createElement("p");
    subdomainElement.textContent = subdomain;
    subdomainsElement.appendChild(subdomainElement);
  });
}
function generateDownloadURL(subdomains) {
  const data = subdomains.join("\n");
  const blob = new Blob([data], { type: "text/plain" });
  return URL.createObjectURL(blob);
}
// Function to get subdomains
async function get_subdomains(domain) {
  try {
    const crtsh = async (domain) => {
      try {
        const opt = {
          method: "GET",
          headers: {
            mode:"no-cors","Access-Control-Allow-Origin": "*",credentials: 'include'
          }
        };
        const crtshsearch = await fetch(`https://cors-anywhere.herokuapp.com/https://crt.sh/?q=${domain}&output=json`, opt);
        const crtshresults = await crtshsearch.json();
        const crtshdata = crtshresults.map(result => result["common_name"].replace(/^\*\./, ''));
        return crtshdata;
      } catch (error) {
        console.log("There was an issue with Crtsh");
        console.log(error);
        return [];
      }
    };

    const vt = async (domain) => {
      try {
        const apikey = "005df6a2bab5ddd46edaa3452b52f06680eaed2b7d8dc7f14b5e3b656c0c5b4b";
        const vturl = `https://cors-anywhere.herokuapp.com/https://www.virustotal.com/api/v3/domains/${domain}/subdomains?limit=100`;
        const options = {
          method: 'GET',
          headers: {
            "X-Apikey": apikey,"Access-Control-Allow-Origin": "*",credentials: 'include'
          }
        };
        const vtresult = await fetch(vturl, options);
        const vtdata = await vtresult.json();
        const vtSubdomains = vtdata.data.map(el => el.id.replace(/^\*\./, ''));
        return vtSubdomains;
      } catch (error) {
        console.log("There was an issue with Virustotal");
        return [];
      }
    };

    const [crtshdata, vtSubdomains] = await Promise.all([crtsh(domain), vt(domain)]);

    // Remove duplicates
    const subdomains = [...new Set([...crtshdata, ...vtSubdomains])];

    displayResults(subdomains);
  } catch (error) {
    console.log("Error:", error.message);
  }
}
