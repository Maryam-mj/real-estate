const propertyForm = document.getElementById("propertyForm");
const propertyContainer = document.getElementById("property-container");

// Read: Load all properties
function getProperties() {
  fetch("http://localhost:3000/properties")
    .then(res => res.json())
    .then(properties => {
      propertyContainer.innerHTML = "";
      properties.forEach(property => loadedProperties(property));
    })
    .catch(error => console.error("Error loading properties:", error));
}

// Display one property as a card
function loadedProperties(property) {
  const col = document.createElement("div");
  col.classList.add("col-md-4", "mb-4");

  col.innerHTML = `
    <div class="card shadow-sm h-100">
      <img src="${property.poster}" class="card-img-top" alt="Property Image">
      <div class="card-body">
        <h5 class="card-title">${property.location}</h5>
        <p class="card-text"> ${property.plot}</p>
        <div class="d-flex justify-content-end gap-3">
          <i class="bi bi-pencil-square text-primary edit-btn" style="cursor:pointer;" data-id="${property.id}"></i>
          <i class="bi bi-trash text-danger delete-btn" style="cursor:pointer;" data-id="${property.id}"></i>
        </div>
      </div>
    </div>
  `;

  propertyContainer.appendChild(col);
}

// Create or Update
propertyForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("propertyid").value;
  const location = document.getElementById("propertyLocation").value.trim();
  const poster = document.getElementById("propertyPoster").value.trim();
  const plot = document.getElementById("propertyplot").value.trim();

  if (!location || !poster || !plot) return;

  const property = { location, poster, plot };

  const method = id ? "PUT" : "POST";
  const url = id 
    ? `http://localhost:3000/properties/${id}` 
    : "http://localhost:3000/properties";

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(property),
  })
    .then(() => {
      propertyForm.reset();
      document.getElementById("submitBtn").textContent = "Add Property";
      getProperties();
    })
    .catch(error => console.error("Error saving property:", error));
});

// Delete or Edit actions
propertyContainer.addEventListener("click", function (e) {
  const id = e.target.dataset.id;

  // Delete
  if (e.target.classList.contains("delete-btn")) {
    fetch(`http://localhost:3000/properties/${id}`, {
      method: "DELETE"
    })
      .then(() => getProperties())
      .catch(err => console.error("Error deleting property:", err));
  }

  // Edit
 // Edit
if (e.target.classList.contains("edit-btn")) {
  fetch(`http://localhost:3000/properties/${id}`)
    .then(res => res.json())
    .then(property => {
      // Fill the form with existing values
      document.getElementById("propertyid").value = property.id;
      document.getElementById("propertyLocation").value = property.location;
      document.getElementById("propertyPoster").value = property.poster;
      document.getElementById("propertyplot").value = property.plot;
      document.getElementById("submitBtn").textContent = "Update Property";

      // Scroll to form for editing
      propertyForm.scrollIntoView({ behavior: "smooth" });
    })
    .catch(err => console.error("Error loading property for edit:", err));


  }
});

// Initial load
document.addEventListener("DOMContentLoaded", getProperties);
