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