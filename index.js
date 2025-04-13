const API_URL = 'http://localhost:3000/properties';
const propertyContainer = document.getElementById('property-container');
const form = document.getElementById('propertyForm');
const submitBtn = document.getElementById('submitBtn');

let editMode = false;
let editingId = null;

// Fetch all properties
async function fetchProperties() {
  const res = await fetch(API_URL);
  return await res.json();
}

// Save new property
async function saveProperty(property) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property)
  });
  return await res.json();
}

// Update existing property
async function updateProperty(id, property) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property)
  });
  return await res.json();
}

// Delete a property
async function deleteProperty(id) {
  if (confirm("Are you sure you want to delete this property?")) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    displayProperties();
  }
}

// Display all properties
async function displayProperties() {
  propertyContainer.innerHTML = '';
  const properties = await fetchProperties();

  properties.forEach(prop => {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
      <div class="card shadow-sm h-100">
        <img src="${prop.Poster}" class="card-img-top" alt="Property Image" style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${prop.Plot}</h5>
          <p class="card-text"><strong>Location:</strong> ${prop.Location}</p>
          <p class="card-text"><strong>ID:</strong> ${prop.id}</p>
          <button class="btn btn-secondary btn-sm me-2" onclick="editProperty('${prop.id}')">Edit</button>
          <button class="btn btn-sm text-white" style="background-color: #1e3a8a;" onclick="deleteProperty('${prop.id}')">Delete</button>
        </div>
      </div>
    `;
    propertyContainer.appendChild(card);
  });
}

// Load property into form for editing
async function editProperty(id) {
  const properties = await fetchProperties();
  const prop = properties.find(p => p.id === id);
  
  if (prop) {
    document.getElementById('propertyid').value = prop.id;
    document.getElementById('propertyLocation').value = prop.Location;
    document.getElementById('propertyPoster').value = prop.Poster;
    document.getElementById('propertyplot').value = prop.Plot;

    editMode = true;
    editingId = id;
    submitBtn.textContent = "Update Property";
    form.scrollIntoView({ behavior: 'smooth' });
  }
}

// Handle form submission
form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const property = {
    id: document.getElementById('propertyid').value,
    Location: document.getElementById('propertyLocation').value.trim(),
    Poster: document.getElementById('propertyPoster').value.trim(),
    Plot: document.getElementById('propertyplot').value.trim()
  };

  if (!property.Location || !property.Poster || !property.Plot) {
    alert("Please fill in all fields!");
    return;
  }

  if (editMode) {
    await updateProperty(editingId, property);
    editMode = false;
    editingId = null;
    submitBtn.textContent = "Add Property";
  } else {
    await saveProperty(property);
  }

  form.reset();
  displayProperties();
});

// Initial render
displayProperties();