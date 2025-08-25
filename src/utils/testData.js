// src/utils/testData.js

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

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

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    metricsByDate[dateString] = {
      sleepHours: (Math.random() * 5 + 4).toFixed(1),
      exercised: Math.random() > 0.5,
      caffeine: getRandom(caffeineOptions),
      x: Math.random() > 0.7,
      y: Math.random() > 0.4,
      z: Math.random() > 0.8,
    };

    const numEntries = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numEntries; j++) {
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
      const formattedTimestamp = date.toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }).replace(',', '');

      entries.push({
        id: date.getTime() + j,
        text: getRandom(sampleTexts),
        moods: [getRandom(moods)],
        timestamp: formattedTimestamp,
      });
    }
  }

  entries.sort((a, b) => b.id - a.id);

  return { entries, metricsByDate };
}