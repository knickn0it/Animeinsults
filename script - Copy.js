let currentAudio = null; // Track the currently playing audio

// Number of assets (adjust based on your actual file count or dynamically fetch)
const assetCount = 5; // Example: 5 pairs of image/audio files

// File directory paths for images and audio
const imageDirectory = "assets/images/";
const audioDirectory = "assets/audio/";

// Generate image and audio assets dynamically based on the count
const animeAssets = Array.from({ length: assetCount }, (_, index) => ({
  image: `${imageDirectory}anime-image${index + 1}.jpg`,
  audio: `${audioDirectory}insult${index + 1}.mp3`
}));

// Select HTML elements for dynamic content
const counterElement = document.getElementById("counter");
const dynamicMessageElement = document.getElementById("dynamicMessage");
const animeImageElement = document.getElementById("animeImage");
const insultButton = document.getElementById("insultButton");

// Initialize insults array (will be fetched from insults.json)
let insults = [];

// Fetch insults from the local insults.json file
fetch('assets/insults.json')  // Assuming insults.json is in the assets folder
  .then(response => response.json())
  .then(data => {
    insults = data;  // Assign the loaded insults to the array
    dynamicMessageElement.textContent = "Press the button for your first insult!";
  })
  .catch(error => {
    console.error("Error loading insults:", error);
    dynamicMessageElement.textContent = "Failed to load insults. Please try again later.";
  });

// Manually list the background images
const backgroundImages = [
  'disgusted1.jpg', 
  'disgusted2.jpg', 
  'disgusted3.jpg',
  'disgusted4.jpg',
  'disgusted5.jpg',
  'disgusted6.jpg',
  'disgusted7.jpg',
  'disgusted8.jpg',
  'disgusted9.jpg'
];

// Pick a random background image
const randomBackground = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
document.body.style.backgroundImage = `url('assets/background/${randomBackground}')`;
document.body.style.backgroundSize = 'cover'; // Ensure the background covers the entire screen
document.body.style.backgroundPosition = 'center'; // Center the image

// Fetch the insult count from Cloudflare Worker API
fetch('https://crimson-lab-0db6.dathanster.workers.dev/api/count')  // Replace with your Worker URL
  .then(response => response.json())
  .then(data => {
    let insultCount = data.count;  // Get the current count from Cloudflare Worker
    updateUI(insultCount);  // Update the UI based on the fetched count
  })
  .catch(error => console.error("Error fetching count:", error));

// Function to update UI (insult count, images, messages)
function updateUI(insultCount) {
  // Set the counter display
  counterElement.textContent = insultCount;

  // Show the last insult and matching image based on insultCount
  if (insultCount > 0) {
    const assetIndex = (insultCount - 1) % assetCount;
    animeImageElement.src = animeAssets[assetIndex].image;  // Set image based on count
    animeImageElement.style.display = "block";  // Ensure the image is displayed
    dynamicMessageElement.textContent = insults[insultCount % insults.length];  // Set matching insult message
  } else {
    animeImageElement.style.display = "none";
    dynamicMessageElement.textContent = "Press the button for your first insult!";
  }
}

// Button click event listener to update count and play audio
insultButton.addEventListener("click", () => {
  // Fetch the current count from Cloudflare Worker
  fetch('https://crimson-lab-0db6.dathanster.workers.dev/api/count')  // Replace with your Worker URL
    .then(response => response.json())
    .then(data => {
      let newCount = data.count + 1; // Increment the count
      counterElement.textContent = newCount; // Update the display

      // Update the count in Cloudflare Worker
      fetch('https://crimson-lab-0db6.dathanster.workers.dev/api/count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: newCount })
      })
        .then(() => {
          updateUI(newCount);  // Update UI after count update
        })
        .catch(error => console.error('Error updating count:', error));

      // Select a matching asset (image and audio) based on the count
      const assetIndex = (newCount - 1) % assetCount;
      const selectedAsset = animeAssets[assetIndex];

      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;  // Reset to the beginning
      }

      // Play the selected audio clip
      currentAudio = new Audio(selectedAsset.audio);
      currentAudio.play();
    })
    .catch(error => console.error('Error fetching count:', error));
});