document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form reload

    // Get values from form
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Basic validation
    if (!name || !email || !message) {
      alert("Please fill out all fields.");
      return;
    }

    // Create object to send
    const formData = {
      name,
      email,
      message
    };

    // Send POST request to JSON server
    fetch("http://localhost:3000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to submit message.");
        }
        return res.json();
      })
      .then(() => {
        alert("Message sent successfully!");
        form.reset();         // Clear form
        loadMessages();       // Refresh messages
      })
      .catch(error => {
        console.error("Error:", error);
        alert("There was a problem sending your message.");
      });
  });

  // Load messages and add delete icon
  function loadMessages() {
    fetch("http://localhost:3000/messages")
      .then(res => res.json())
      .then(messages => {
        const container = document.getElementById("adminMessages");
        if (!container) return;
        container.innerHTML = "";

        messages.forEach(msg => {
          const div = document.createElement("div");
          div.className = "flex justify-between items-start bg-white p-3 shadow mb-3 rounded";

          div.innerHTML = `
            <div>
              <strong>${msg.name}</strong> <br>
              <em>${msg.email}</em><br>
              <p>${msg.message}</p>
            </div>
            <button class="text-red-500 delete-btn" data-id="${msg.id}" title="Delete">
              <i class="bi bi-trash-fill text-xl"></i>
            </button>
          `;

          container.appendChild(div);
        });

        // Attach delete functionality
        document.querySelectorAll(".delete-btn").forEach(btn => {
          btn.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            if (confirm("Delete this message?")) {
              fetch(`http://localhost:3000/messages/${id}`, {
                method: "DELETE"
              })
              .then(() => loadMessages());
            }
          });
        });
      });
  }

  loadMessages(); // Initial load
});
