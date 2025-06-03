/**
 * Love Compatibility Algorithm Test
 * This script validates the compatibility algorithm by testing various name pairs
 * and demonstrating its properties.
 */

// Import the calculateCompatibility function from the main file
// or redefine it here for standalone testing
function calculateCompatibility(name1, name2) {
  // Normalize names: remove spaces and convert to lowercase to ensure case-insensitivity.
  const n1 = name1.replace(/\s+/g, '').toLowerCase();
  const n2 = name2.replace(/\s+/g, '').toLowerCase();

  // Helper function to calculate a score for each letter (a=1, b=2, ..., z=26).
  const getScore = (str) =>
    Array.from(str).reduce((acc, char) => {
      const code = char.charCodeAt(0);
      if (code >= 97 && code <= 122) {
        return acc + (code - 96);
      }
      return acc;
    }, 0);

  // Calculate the individual scores for both names.
  const score1 = getScore(n1);
  const score2 = getScore(n2);

  // Calculate the absolute difference between the two name scores.
  const diff = Math.abs(score1 - score2);
  
  // Compute a "difference factor" using exponential decay.
  const diffFactor = Math.floor(Math.exp(-diff / 50) * 100);

  // Calculate how many unique letters are common between the two names.
  const set1 = new Set(n1);
  const set2 = new Set(n2);
  const commonLettersCount = [...set1].filter(letter => set2.has(letter)).length;
  const totalUniqueLetters = new Set([...set1, ...set2]).size;
  
  // Compute the "common letter factor" as a percentage.
  const commonFactor = totalUniqueLetters > 0 ? Math.floor((commonLettersCount / totalUniqueLetters) * 100) : 0;

  // Final compatibility value is the average of our two factors, clamped to a maximum of 100.
  let compatibility = Math.floor((diffFactor + commonFactor) / 2);
  compatibility = Math.min(100, Math.max(0, compatibility));

  return compatibility;
}

// Test function to validate algorithm properties
function testCompatibilityAlgorithm() {
  console.log('---- LOVE COMPATIBILITY ALGORITHM TEST ----\n');
  
  // 1. Test the example pairs mentioned in the analysis
  const testPairs = [
    ['John', 'Mary'],
    ['Romeo', 'Juliet'],
    ['Luke', 'Leia'],
    ['Batman', 'Joker']
  ];
  
  console.log('SAMPLE RESULTS:');
  testPairs.forEach(([name1, name2]) => {
    const compatibility = calculateCompatibility(name1, name2);
    console.log(`"${name1}" and "${name2}": ${compatibility}%`);
  });
  
  // 2. Test deterministic nature by running the same pair multiple times
  console.log('\nDETERMINISTIC NATURE TEST:');
  const pair = ['Alex', 'Taylor'];
  const results = [];
  for (let i = 0; i < 5; i++) {
    results.push(calculateCompatibility(pair[0], pair[1]));
  }
  console.log(`"${pair[0]}" and "${pair[1]}" run 5 times: ${results.join(', ')}%`);
  console.log(`All results identical: ${new Set(results).size === 1 ? 'YES' : 'NO'}`);
  
  // 3. Test case insensitivity and space handling
  console.log('\nNAME NORMALIZATION TEST:');
  const original = calculateCompatibility('John', 'Mary');
  const withSpaces = calculateCompatibility('J o h n', 'M a r y');
  const differentCase = calculateCompatibility('JOHN', 'mary');
  console.log(`Original: "John" and "Mary": ${original}%`);
  console.log(`With spaces: "J o h n" and "M a r y": ${withSpaces}%`);
  console.log(`Different case: "JOHN" and "mary": ${differentCase}%`);
  console.log(`Normalization working: ${original === withSpaces && original === differentCase ? 'YES' : 'NO'}`);
  
  // 4. Test boundary cases
  console.log('\nBOUNDARY CASES:');
  console.log(`Same name "Anna" and "Anna": ${calculateCompatibility('Anna', 'Anna')}%`);
  console.log(`Very different "Xyz" and "Abc": ${calculateCompatibility('Xyz', 'Abc')}%`);
  console.log(`Empty strings "" and "": ${calculateCompatibility('', '')}%`);
  console.log(`Special characters "Jön@" and "M#ry": ${calculateCompatibility('Jön@', 'M#ry')}%`);
}

// Run the tests
testCompatibilityAlgorithm();

/**
 * How to run this script:
 * 1. Save this file as testCompatibility.js
 * 2. Run with Node.js: node testCompatibility.js
 * 
 * Expected output will show:
 * - Sample results matching the analysis
 * - Confirmation of deterministic behavior
 * - Validation of name normalization
 * - Testing of boundary cases
 */