// src/utils/testData.js

// Helper function to get a random item from an array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Main function to generate 30 days of sample data
export function generateTestData() {
  const entries = [];
  const metricsByDate = {};

  const moods = ['😊', '😄', '🥰', '😴', '😔', '😠', '😨', '😳'];
  const sampleTexts = [
    "Had a really productive day at work.",
    "Felt a bit tired, probably need more sleep.",
    "Great workout session this morning!",
    "Spent some quality time with family.",
    "Feeling anxious about the upcoming week.",
    "A quiet and relaxing evening.",
    "Tried a new recipe for dinner, it was delicious.",
    "Struggled to focus today.",
  ];
  const caffeineOptions = ['none', 'coffee', 'tea', 'other'];

  // Loop backwards for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const dateString = date.toISOString().split('T')[0];

    // --- Create Metrics for the day ---
    metricsByDate[dateString] = {
      sleepHours: (Math.random() * 5 + 4).toFixed(1), // Sleep between 4 and 9 hours
      exercised: Math.random() > 0.5,
      caffeine: getRandom(caffeineOptions),
      x: Math.random() > 0.7,
      y: Math.random() > 0.4,
      z: Math.random() > 0.8,
    };

    // --- Create 1 to 3 Journal Entries for the day ---
    const numEntries = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numEntries; j++) {
      // Set a random time for the entry on that day
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
      
      const formattedTimestamp = date.toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }).replace(',', '');

      entries.push({
        id: date.getTime() + j, // Unique ID
        text: getRandom(sampleTexts),
        moods: [getRandom(moods)],
        timestamp: formattedTimestamp,
      });
    }
  }

  // Sort entries by date, newest first
  entries.sort((a, b) => b.id - a.id);

  return { entries, metricsByDate };
}