let currentAudio = null; // Track the currently playing audio

// Number of assets (adjust based on your actual file count or dynamically fetch)
const assetCount = 3; // Example: 3 pairs of image/audio files

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

// Initialize insults array (you can preload this if you have a fixed list)
const insults = [
  "You're a disgrace to anime.",
  "Go back to watching soap operas.",
  "Even the worst anime characters have more depth than you."
];

// Get the insult count from localStorage (if it exists)
let insultCount = parseInt(localStorage.getItem('insultCount')) || 0;
updateUI();

// Manually list the background images
const backgroundImages = [
  'disgusted1.jpg', 
  'disgusted2.jpg', 
  'disgusted3.jpg'
];

// Pick a random background image
const randomBackground = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
document.body.style.backgroundImage = `url('assets/background/${randomBackground}')`;
document.body.style.backgroundSize = 'cover'; // Ensure the background covers the entire screen
document.body.style.backgroundPosition = 'center'; // Center the image

// Function to update UI (insult count, images, messages)
function updateUI() {
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

// Button click event listener
insultButton.addEventListener("click", () => {
  insultCount++;  // Increment the count
  localStorage.setItem('insultCount', insultCount);  // Store updated count in localStorage
  updateUI();

  // Select a matching asset (image and audio) based on the count
  const assetIndex = (insultCount - 1) % assetCount;
  const selectedAsset = animeAssets[assetIndex];

  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;  // Reset to the beginning
  }

  // Play the selected audio clip
  currentAudio = new Audio(selectedAsset.audio);
  currentAudio.play();
});
