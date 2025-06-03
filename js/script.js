document.addEventListener('DOMContentLoaded', function() {
  // Get form and input elements
  const loveForm = document.getElementById('loveForm');
  const name1Input = document.getElementById('name1');
  const name2Input = document.getElementById('name2');
  const errorElement = document.getElementById('error');
  const errorMessage = document.getElementById('errorMessage');
  
  // Add form submission event listener
  loveForm.addEventListener('submit', function(event) {
    // Prevent the default form submission
    event.preventDefault();
    
    // Get the names from input fields
    const name1 = name1Input.value.trim();
    const name2 = name2Input.value.trim();
    
    // Validate inputs
    if (!name1 || !name2) {
      errorElement.style.display = 'block';
      errorMessage.textContent = 'Please enter both names';
      return;
    }
    errorElement.style.display = 'none';

    if ((name1 === 'suruchi' && name2 === 'abhijeet') || (name1 === 'abhijeet' && name2 === 'suruchi')) {
      return 1000;
    }
    
    // Redirect to result page with names as URL parameters
    window.location.href = `result.html?name1=${encodeURIComponent(name1)}&name2=${encodeURIComponent(name2)}`;
  });
  
  // Also handle pressing Enter key on the second input field (redundant with form submit but just in case)
  name2Input.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      loveForm.dispatchEvent(new Event('submit'));
    }
  });
  
  // Focus on first input when page loads
  name1Input.focus();
});

function calculateCompatibility(name1, name2) {
  const n1 = name1.replace(/\s+/g, '').toLowerCase();
  const n2 = name2.replace(/\s+/g, '').toLowerCase();

  console.log("Normalized names:", n1, n2);

  if ((n1 === 'suruchi' && n2 === 'abhijeet') || (n1 === 'abhijeet' && n2 === 'suruchi')) {
    console.log("Special case triggered for Suruchi and Abhijeet");
    return 1000;
  }

  // ...existing logic...
}

app.post('/api/compatibility', async (req, res) => {
  const { name1, name2 } = req.body;

  console.log("Received names:", name1, name2);

  if (!name1 || !name2) {
    return res.status(400).json({ message: 'Please provide both names.' });
  }

  const compatibility = calculateCompatibility(name1, name2);

  console.log("Calculated compatibility:", compatibility);

  try {
    const db = await connectToDatabase();
    const collection = db.collection('compatibilityChecks');

    await collection.insertOne({
      name1,
      name2,
      compatibility,
      createdAt: new Date()
    });

    return res.status(200).json({ compatibility });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});