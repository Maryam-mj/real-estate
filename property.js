document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("propertyForm");
    const propertyContainer = document.getElementById("property-container");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      let propertyId = document.getElementById("propertyid").value;
      let propertyLocation = document.getElementById("propertyLocation").value;
      let propertyPoster = document.getElementById("propertyPoster").value;
      let propertyPlot = document.getElementById("propertyplot").value;
  
      const propertyObj = {
        id: propertyId,
        location: propertyLocation,
        poster: propertyPoster,
        plot: propertyPlot
      };
  
      // POST request to add property
      fetch("http://localhost:3000/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(propertyObj)
      })
        .then(response => response.json())
        .then(data => {
          loadProperty(data); // Load the new property immediately
          form.reset(); // Clear form after adding
        })
        .catch(error => console.error("Error adding property:", error));
    });
  
    // Function to create and display property card
    function loadProperty(property) {
      let card = document.createElement("div");
      card.classList.add("card", "col-md-3", "m-3", "shadow-sm");
  
      card.innerHTML = `
        <img src="${property.poster || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${property.location}">
        <div class="card-body">
          <h5 class="card-title">${property.location}</h5>
          <p class="card-text">${property.plot}</p>
          <a href="#" class="btn btn-sm btn-primary">View Details</a>
        </div>
      `;
  
      propertyContainer.appendChild(card);
    }
  
    // Fetch and display all properties on page load
    function getProperties() {
      fetch("http://localhost:3000/properties")
        .then(res => res.json())
        .then(properties => {
          properties.forEach(property => loadProperty(property));
        })
        .catch(error => console.error("Error fetching properties:", error));
    }
  
    getProperties(); // Load properties on page load
  });
  