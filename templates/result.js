document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const resultName1 = document.getElementById('resultName1');
  const resultName2 = document.getElementById('resultName2');
  const compatibilityResult = document.getElementById('compatibilityResult');
  const compatibilityMessage = document.getElementById('compatibilityMessage');
  const meterFill = document.getElementById('meter-fill');
  const tryAgainBtn = document.getElementById('tryAgainBtn');
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  const errorMessage = document.getElementById('errorMessage');
  const resultsElement = document.getElementById('results');
  // API endpoint - Use the absolute URL for local testing
  const API_URL = 'http://localhost:3000/api/compatibility';
  
  console.log("Result.js loaded");

  // Extract names from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const name1 = urlParams.get('name1');
  const name2 = urlParams.get('name2');
  
  console.log("Names from URL:", name1, name2);

  // Redirect back to main page if names are not provided
  if (!name1 || !name2) {
    window.location.href = 'index.html';
    return;
  }

  // Configure try again button
  tryAgainBtn.addEventListener('click', function() {
    window.location.href = 'index.html';
  });

  // Show loading spinner
  loadingElement.style.display = 'flex';
  errorElement.style.display = 'none';
  resultsElement.style.display = 'none';

  // Call API to calculate compatibility
  console.log("Sending API request to:", API_URL);
  
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name1, name2 }),
  })
  .then(response => {
    console.log("API Response status:", response.status);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("API Response data:", data);
    // Display results
    displayResults(name1, name2, data.compatibility);
  })
  .catch(error => {
    console.error('Error:', error);
    loadingElement.style.display = 'none';
    errorElement.style.display = 'block';
    errorMessage.textContent = 'An error occurred. Please try again later. Check the console for details.';
  });

  function displayResults(name1, name2, compatibility) {
    // Hide loading
    loadingElement.style.display = 'none';
    
    // Update result names
    resultName1.textContent = name1;
    resultName2.textContent = name2;
    
    // Update meter fill with animation
    meterFill.style.width = `${compatibility}%`;
    
    // Update compatibility percentage with animation
    let counter = 0;
    const interval = setInterval(() => {
      if (counter >= compatibility) {
        clearInterval(interval);
        compatibilityResult.textContent = compatibility; // Make sure final value is exact
        return;
      }
      compatibilityResult.textContent = counter;
      counter++;
    }, 15);
    
    // Set compatibility message
    compatibilityMessage.textContent = getCompatibilityMessage(compatibility);
    
    // Show results container
    resultsElement.style.display = 'block';
  }

  function getCompatibilityMessage(percentage) {
    if (percentage >= 90) {
      return "Perfect match! You were destined to be together! ✨";
    } else if (percentage >= 75) {
      return "Great match! Your love has amazing potential! 💖";
    } else if (percentage >= 60) {
      return "Good match! You have a strong connection! 😊";
    } else if (percentage >= 40) {
      return "Decent match. You might need to work on your relationship. 🌱";
    } else if (percentage >= 20) {
      return "Not a great match. But opposites sometimes attract! 🤔";
    } else {
      return "Maybe just be friends? The stars aren't aligned for romance. 🌟";
    }
  }
});