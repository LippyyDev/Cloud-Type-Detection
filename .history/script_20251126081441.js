// Model URL
const URL = "https://teachablemachine.withgoogle.com/models/aZnNb8uTX/";

let model, webcam, labelContainer, maxPredictions;
let isWebcamActive = false;
let predictionInterval = null;
let currentImage = null;

// Background video change delay system
let pendingVideoChange = null;
let currentVideoCondition = null;
let videoChangeTimer = null;
const VIDEO_CHANGE_DELAY = 5000; // 5 seconds in milliseconds

// Cloud explanations in Indonesian
const cloudExplanations = {
  "cirriform clouds": {
    name: "Awan Cirriform",
    description:
      "Awan cirriform adalah awan tinggi yang tipis dan halus, biasanya terbuat dari kristal es. Awan ini berada di ketinggian 6-12 km dan sering kali menandakan cuaca yang baik, meskipun kadang-kadang dapat menjadi pertanda perubahan cuaca.",
    characteristics: [
      "Tinggi: 6-12 km di atas permukaan",
      "Terbuat dari kristal es",
      "Tipis dan transparan",
      "Bentuk seperti serat atau bulu",
      "Warna putih cerah",
      "Tidak menghasilkan hujan",
    ],
  },
  "clear sky": {
    name: "Langit Cerah",
    description:
      "Langit cerah berarti tidak ada awan yang terlihat atau hanya sedikit awan. Kondisi ini biasanya menandakan cuaca yang baik dengan visibilitas yang jelas dan sinar matahari yang optimal.",
    characteristics: [
      "Tidak ada awan atau sangat sedikit",
      "Visibilitas sangat baik",
      "Sinar matahari optimal",
      "Cuaca stabil",
      "Ideal untuk aktivitas outdoor",
      "Suhu biasanya lebih hangat",
    ],
  },
  "cumulonimbus clouds": {
    name: "Awan Cumulonimbus",
    description:
      "Awan cumulonimbus adalah awan vertikal yang sangat besar dan padat, dikenal sebagai awan badai. Awan ini dapat menghasilkan hujan deras, petir, angin kencang, dan bahkan tornado. Sangat berbahaya untuk penerbangan.",
    characteristics: [
      "Awan badai yang sangat besar",
      "Dapat mencapai ketinggian 12-15 km",
      "Menghasilkan hujan deras",
      "Disertai petir dan guntur",
      "Angin kencang dan turbulensi",
      "Dapat menghasilkan hujan es",
    ],
  },
  "cumulus clouds": {
    name: "Awan Cumulus",
    description:
      "Awan cumulus adalah awan putih yang terlihat seperti kapas atau bunga kol. Awan ini biasanya muncul di cuaca cerah dan menunjukkan kondisi atmosfer yang tidak stabil. Awan cumulus kecil biasanya menandakan cuaca yang baik.",
    characteristics: [
      "Bentuk seperti kapas atau bunga kol",
      "Dasar datar, puncak membulat",
      "Warna putih cerah",
      "Tinggi: 1-2 km",
      "Muncul di cuaca cerah",
      "Dapat berkembang menjadi awan badai",
    ],
  },
  "high cumuliform clouds": {
    name: "Awan Cumuliform Tinggi",
    description:
      "Awan cumuliform tinggi adalah awan vertikal yang berada di ketinggian menengah hingga tinggi. Awan ini menunjukkan aktivitas konvektif yang kuat dan dapat berkembang menjadi awan badai jika kondisi atmosfer mendukung.",
    characteristics: [
      "Ketinggian menengah hingga tinggi",
      "Bentuk vertikal yang berkembang",
      "Menunjukkan aktivitas konvektif",
      "Dapat berkembang menjadi awan badai",
      "Sering disertai angin kencang",
      "Perlu diwaspadai untuk aktivitas outdoor",
    ],
  },
  "stratiform clouds": {
    name: "Awan Stratiform",
    description:
      "Awan stratiform adalah awan yang membentuk lapisan horizontal yang luas dan seragam. Awan ini biasanya menghasilkan hujan ringan hingga sedang yang berkelanjutan. Sering muncul dalam cuaca mendung dan stabil.",
    characteristics: [
      "Lapisan horizontal yang luas",
      "Menutupi sebagian besar langit",
      "Menghasilkan hujan ringan hingga sedang",
      "Cuaca mendung dan stabil",
      "Visibilitas berkurang",
      "Dapat bertahan berjam-jam",
    ],
  },
  "stratocumulus clouds": {
    name: "Awan Stratocumulus",
    description:
      "Awan stratocumulus adalah awan rendah yang membentuk pola seperti gumpalan atau gulungan. Awan ini biasanya tidak menghasilkan hujan yang signifikan dan sering muncul dalam cuaca yang relatif stabil.",
    characteristics: [
      "Awan rendah (di bawah 2 km)",
      "Pola seperti gumpalan atau gulungan",
      "Warna abu-abu atau putih",
      "Tidak menghasilkan hujan signifikan",
      "Cuaca relatif stabil",
      "Sering muncul di pagi hari",
    ],
  },
};

// Weather predictions based on cloud types
const weatherPredictions = {
  "cirriform clouds": {
    condition: "Cerah Berawan",
    icon: "fa-sun",
    iconColor: "#ffd700",
    temperature: "Hangat",
    humidity: "Rendah",
    wind: "Tenang hingga Sedang",
    precipitation: "Tidak ada",
    visibility: "Sangat Baik",
    recommendation:
      "Cuaca ideal untuk aktivitas outdoor. Gunakan sunscreen karena sinar UV tinggi.",
    alert: null,
  },
  "clear sky": {
    condition: "Cerah",
    icon: "fa-sun",
    iconColor: "#ffd700",
    temperature: "Panas",
    humidity: "Sangat Rendah",
    wind: "Tenang",
    precipitation: "Tidak ada",
    visibility: "Sempurna",
    recommendation:
      "Cuaca sangat baik untuk semua aktivitas outdoor. Pastikan terhidrasi dengan baik.",
    alert: null,
  },
  "cumulonimbus clouds": {
    condition: "Badai Petir",
    icon: "fa-cloud-bolt",
    iconColor: "#8b0000",
    temperature: "Dingin",
    humidity: "Sangat Tinggi",
    wind: "Sangat Kencang",
    precipitation: "Hujan Deras",
    visibility: "Sangat Buruk",
    recommendation:
      "HINDARI aktivitas outdoor! Cari tempat berlindung. Waspada petir dan angin kencang.",
    alert: "warning",
  },
  "cumulus clouds": {
    condition: "Cerah dengan Awan",
    icon: "fa-cloud-sun",
    iconColor: "#4ecdc4",
    temperature: "Hangat",
    humidity: "Sedang",
    wind: "Sedang",
    precipitation: "Kemungkinan Hujan Ringan",
    visibility: "Baik",
    recommendation:
      "Cuaca cukup baik untuk aktivitas outdoor. Waspada jika awan berkembang menjadi lebih besar.",
    alert: null,
  },
  "high cumuliform clouds": {
    condition: "Berpotensi Badai",
    icon: "fa-cloud-showers-heavy",
    iconColor: "#ff6b6b",
    temperature: "Sedang",
    humidity: "Tinggi",
    wind: "Kencang",
    precipitation: "Hujan Sedang hingga Deras",
    visibility: "Sedang",
    recommendation:
      "Waspada! Cuaca dapat memburuk dengan cepat. Hindari aktivitas outdoor yang berisiko.",
    alert: "caution",
  },
  "stratiform clouds": {
    condition: "Mendung",
    icon: "fa-cloud",
    iconColor: "#6c757d",
    temperature: "Dingin",
    humidity: "Tinggi",
    wind: "Sedang",
    precipitation: "Hujan Ringan hingga Sedang",
    visibility: "Sedang",
    recommendation:
      "Cuaca mendung dengan kemungkinan hujan. Bawa payung atau jas hujan jika keluar.",
    alert: null,
  },
  "stratocumulus clouds": {
    condition: "Berawan",
    icon: "fa-cloud",
    iconColor: "#95a5a6",
    temperature: "Sedang",
    humidity: "Sedang",
    wind: "Tenang hingga Sedang",
    precipitation: "Sangat Sedikit atau Tidak Ada",
    visibility: "Baik",
    recommendation:
      "Cuaca berawan yang stabil. Cocok untuk aktivitas outdoor ringan.",
    alert: null,
  },
};

// Load the image model
async function init() {
  try {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata silently (no loading indicator)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    console.log("Model loaded successfully");
  } catch (error) {
    console.error("Error loading model:", error);
    alert("Gagal memuat model. Pastikan koneksi internet Anda stabil.");
  }
}

// Initialize webcam
async function initWebcam() {
  try {
    // Make sure model is loaded first
    if (!model) {
      // Show loading while model is being loaded
      const predictionSection = document.getElementById("prediction-section");
      if (predictionSection) {
        predictionSection.style.display = "block";
        predictionSection.innerHTML =
          '<div class="loading"><i class="fas fa-spinner"></i><p>Memuat model...</p></div>';
      }
      await init();
      // Restore prediction section structure after model loads
      if (predictionSection) {
        predictionSection.innerHTML = `
                    <h2 class="section-title">
                        <i class="fas fa-chart-line"></i>
                        Hasil Prediksi
                    </h2>
                    <div id="label-container" class="label-container"></div>
                `;
      }
    }

    // Hide upload button and show webcam
    document.getElementById("upload-btn").style.display = "none";
    document.getElementById("file-input").style.display = "none";
    document.getElementById("image-preview").style.display = "none";

    // Setup webcam
    const flip = true;
    webcam = new tmImage.Webcam(400, 400, flip);
    await webcam.setup();
    await webcam.play();

    isWebcamActive = true;

    // Append webcam canvas
    const webcamContainer = document.getElementById("webcam-container");
    webcamContainer.innerHTML = "";
    webcamContainer.appendChild(webcam.canvas);
    webcamContainer.style.display = "block";

    // Show control buttons
    document.getElementById("control-buttons").style.display = "flex";
    document.getElementById("webcam-btn").style.display = "none";

    // Show prediction and explanation sections first
    const predictionSection = document.getElementById("prediction-section");
    const explanationSection = document.getElementById("explanation-section");
    const weatherSection = document.getElementById(
      "weather-prediction-section"
    );

    // Ensure prediction section has correct structure
    if (
      predictionSection &&
      !predictionSection.querySelector("#label-container")
    ) {
      predictionSection.innerHTML = `
                <h2 class="section-title">
                    <i class="fas fa-chart-line"></i>
                    Hasil Prediksi
                </h2>
                <div id="label-container" class="label-container"></div>
            `;
    }

    predictionSection.style.display = "block";
    explanationSection.style.display = "block";
    weatherSection.style.display = "block";

    // Setup label container
    labelContainer = document.getElementById("label-container");
    if (labelContainer) {
      labelContainer.innerHTML = "";
      for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
      }
    }

    // Start prediction loop
    startPredictionLoop();
  } catch (error) {
    console.error("Error initializing webcam:", error);
    alert(
      "Gagal mengakses webcam. Pastikan Anda memberikan izin akses kamera."
    );
  }
}

// Start prediction loop
function startPredictionLoop() {
  if (predictionInterval) {
    clearInterval(predictionInterval);
  }

  predictionInterval = setInterval(async () => {
    if (isWebcamActive && webcam) {
      webcam.update();
      await predict();
    }
  }, 100); // Predict every 100ms
}

// Stop webcam
function stopWebcam() {
  if (webcam) {
    webcam.stop();
    isWebcamActive = false;
  }

  if (predictionInterval) {
    clearInterval(predictionInterval);
    predictionInterval = null;
  }

  // Clear webcam container
  const webcamContainer = document.getElementById("webcam-container");
  if (webcamContainer) {
    webcamContainer.innerHTML = "";
    webcamContainer.style.display = "none";
  }

  document.getElementById("control-buttons").style.display = "none";
  document.getElementById("webcam-btn").style.display = "inline-flex";
  document.getElementById("upload-btn").style.display = "inline-flex";

  // Clear predictions
  if (labelContainer) {
    labelContainer.innerHTML = "";
  }
  document.getElementById("cloud-explanation").innerHTML = "";
  document.getElementById("prediction-section").style.display = "none";
  document.getElementById("explanation-section").style.display = "none";
  document.getElementById("weather-prediction-section").style.display = "none";

  // Reset background video
  controlBackgroundVideo("", "");

  // Clear video change timer
  if (videoChangeTimer) {
    clearTimeout(videoChangeTimer);
    videoChangeTimer = null;
  }
  pendingVideoChange = null;
  currentVideoCondition = null;

  // Reset webcam variable
  webcam = null;
}

// Handle file upload
async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Stop webcam first if active
  if (isWebcamActive || webcam) {
    stopWebcam();
  }

  // Make sure model is loaded
  if (!model) {
    // Show loading while model is being loaded
    const predictionSection = document.getElementById("prediction-section");
    if (predictionSection) {
      predictionSection.style.display = "block";
      predictionSection.innerHTML =
        '<div class="loading"><i class="fas fa-spinner"></i><p>Memuat model...</p></div>';
    }
    await init();
    // Restore prediction section structure after model loads
    if (predictionSection) {
      predictionSection.innerHTML = `
                <h2 class="section-title">
                    <i class="fas fa-chart-line"></i>
                    Hasil Prediksi
                </h2>
                <div id="label-container" class="label-container"></div>
            `;
    }
  }

  // Ensure webcam is fully stopped and hidden
  document.getElementById("webcam-btn").style.display = "inline-flex";
  document.getElementById("upload-btn").style.display = "inline-flex";

  // Clear webcam container completely
  const webcamContainer = document.getElementById("webcam-container");
  if (webcamContainer) {
    webcamContainer.innerHTML = "";
    webcamContainer.style.display = "none";
  }

  // Show image preview
  const reader = new FileReader();
  reader.onload = async function (e) {
    const img = new Image();
    img.onload = async function () {
      // Display image
      const imagePreview = document.getElementById("image-preview");
      if (imagePreview) {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Uploaded image">`;
        imagePreview.style.display = "block";
      }

      currentImage = img;

      // Show prediction and explanation sections first
      const predictionSection = document.getElementById("prediction-section");
      const explanationSection = document.getElementById("explanation-section");
      const weatherSection = document.getElementById(
        "weather-prediction-section"
      );

      // Ensure prediction section has correct structure
      if (
        predictionSection &&
        !predictionSection.querySelector("#label-container")
      ) {
        predictionSection.innerHTML = `
                    <h2 class="section-title">
                        <i class="fas fa-chart-line"></i>
                        Hasil Prediksi
                    </h2>
                    <div id="label-container" class="label-container"></div>
                `;
      }

      predictionSection.style.display = "block";
      explanationSection.style.display = "block";
      weatherSection.style.display = "block";

      // Setup label container
      labelContainer = document.getElementById("label-container");
      if (labelContainer) {
        labelContainer.innerHTML = "";
        for (let i = 0; i < maxPredictions; i++) {
          labelContainer.appendChild(document.createElement("div"));
        }
      }

      // Predict
      await predictFromImage(img);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);

  // Reset file input to allow selecting the same file again
  event.target.value = "";
}

// Predict from webcam
async function predict() {
  if (!model || !webcam || !isWebcamActive) return;

  try {
    const prediction = await model.predict(webcam.canvas);
    displayPredictions(prediction);
  } catch (error) {
    console.error("Prediction error:", error);
  }
}

// Predict from uploaded image
async function predictFromImage(img) {
  if (!model || !img) return;

  try {
    // Create canvas to draw image
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const prediction = await model.predict(canvas);
    displayPredictions(prediction);
  } catch (error) {
    console.error("Prediction error:", error);
  }
}

// Display predictions
function displayPredictions(prediction) {
  if (!prediction || prediction.length === 0) return;

  // Sort predictions by probability
  const sortedPredictions = [...prediction].sort(
    (a, b) => b.probability - a.probability
  );

  // Find highest probability
  const highestPrediction = sortedPredictions[0];

  // Ensure labelContainer exists
  if (!labelContainer) {
    labelContainer = document.getElementById("label-container");
  }

  // If still doesn't exist, create it
  if (!labelContainer) {
    const predictionSection = document.getElementById("prediction-section");
    if (predictionSection) {
      if (!predictionSection.querySelector("#label-container")) {
        const container = document.createElement("div");
        container.id = "label-container";
        container.className = "label-container";
        predictionSection.appendChild(container);
      }
      labelContainer = document.getElementById("label-container");
    }
  }

  if (!labelContainer) {
    console.error("Label container not found");
    return;
  }

  // Clear and rebuild label container
  labelContainer.innerHTML = "";

  sortedPredictions.forEach((pred, index) => {
    const isHighest = index === 0;
    const probabilityPercent = parseFloat((pred.probability * 100).toFixed(2));

    const div = document.createElement("div");
    div.className = `prediction-item ${isHighest ? "highest" : ""}`;

    // Hide bar if probability is 0
    const barStyle =
      probabilityPercent > 0
        ? `style="width: ${probabilityPercent}%"`
        : 'style="display: none"';

    div.innerHTML = `
            <div>
                <div class="class-name">${formatClassName(pred.className)}</div>
                <div class="probability-bar">
                    <div class="probability-fill" ${barStyle}></div>
                </div>
            </div>
            <div class="probability">${probabilityPercent.toFixed(2)}%</div>
        `;
    labelContainer.appendChild(div);
  });

  // Display cloud explanation for highest probability
  displayCloudExplanation(
    highestPrediction.className,
    highestPrediction.probability
  );

  // Display weather prediction
  displayWeatherPrediction(highestPrediction.className);
}

// Format class name for display
function formatClassName(className) {
  return className
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Display cloud explanation
function displayCloudExplanation(className, probability) {
  const explanation = cloudExplanations[className.toLowerCase()];
  const explanationDiv = document.getElementById("cloud-explanation");

  if (!explanation) {
    explanationDiv.innerHTML = `
            <div class="cloud-name">${formatClassName(className)}</div>
            <div class="cloud-description">
                Probabilitas: ${(probability * 100).toFixed(2)}%
            </div>
        `;
    return;
  }

  const probabilityPercent = (probability * 100).toFixed(2);

  explanationDiv.innerHTML = `
        <div class="cloud-name">${explanation.name}</div>
        <div class="cloud-description">
            ${explanation.description}
        </div>
        <div class="cloud-characteristics">
            <h3>Karakteristik:</h3>
            <ul>
                ${explanation.characteristics
                  .map((char) => `<li>${char}</li>`)
                  .join("")}
            </ul>
        </div>
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <strong>Probabilitas Deteksi: ${probabilityPercent}%</strong>
        </div>
    `;
}

// Actually change the background video (called after delay)
function applyBackgroundVideoChange(videoPath) {
  const video = document.getElementById("background-video");
  const body = document.body;

  if (videoPath && video) {
    // Change video source if needed
    const source = video.querySelector("source");
    if (source && source.src !== videoPath) {
      source.src = videoPath;
      video.load();
      
      // Wait for video to be ready before fading out gradient
      video.addEventListener('loadeddata', function() {
        body.classList.add("video-ready");
      }, { once: true });
    } else {
      // Video already loaded, fade out gradient immediately
      body.classList.add("video-ready");
    }
    
    video.classList.add("active");
    body.classList.add("video-background");
    // Ensure video is playing
    video.play().catch((err) => {
      console.log("Video autoplay prevented:", err);
    });
  } else if (video) {
    // Hide video background, show default gradient
    video.classList.remove("active");
    body.classList.remove("video-background");
    body.classList.remove("video-ready");
    video.pause();
    body.classList.remove("video-ready");
  }
}

// Control background video based on weather condition with delay
function controlBackgroundVideo(condition, precipitation) {
  // Conditions that indicate storm/badai
  const stormConditions = ["Badai Petir", "Berpotensi Badai"];

  // Conditions that indicate rain (excluding "Kemungkinan Hujan Ringan" which is just a possibility)
  const rainConditions = [
    "Hujan Deras",
    "Hujan Sedang hingga Deras",
    "Hujan Ringan hingga Sedang",
  ];

  // Conditions for cloudy/partly cloudy
  const cloudyConditions = ["Cerah Berawan", "Cerah dengan Awan", "Berawan"];

  // Conditions for clear sky
  const clearConditions = ["Cerah"];

  // Conditions for overcast/mendung
  const overcastConditions = ["Mendung"];

  let videoPath = null;

  // Priority: Storm > Cloudy/Overcast/Clear (based on condition) > Rain (only if actual rain, not just possibility)
  if (stormConditions.includes(condition)) {
    // Show storm video
    videoPath = "src/video/Badai.mp4";
  } else if (cloudyConditions.includes(condition)) {
    // Show partly cloudy video (prioritize condition over precipitation)
    videoPath = "src/video/CerahBerawan.mp4";
  } else if (overcastConditions.includes(condition)) {
    // Show overcast video
    videoPath = "src/video/Mendung.mp4";
  } else if (clearConditions.includes(condition)) {
    // Show clear sky video
    videoPath = "src/video/Cerah.mp4";
  } else if (precipitation && rainConditions.includes(precipitation)) {
    // Show rain video (only for actual rain, not "Kemungkinan")
    videoPath = "src/video/Rain.mp4";
  }

  // Create condition key for comparison
  const conditionKey = `${condition}|${precipitation || ""}`;

  // If condition hasn't changed, do nothing
  if (conditionKey === currentVideoCondition) {
    return;
  }

  // Clear existing timer if any
  if (videoChangeTimer) {
    clearTimeout(videoChangeTimer);
    videoChangeTimer = null;
  }

  // If not using webcam (e.g., file upload), apply immediately
  if (!isWebcamActive) {
    currentVideoCondition = conditionKey;
    applyBackgroundVideoChange(videoPath);
    return;
  }

  // For webcam: wait 5 seconds before changing
  pendingVideoChange = videoPath;
  currentVideoCondition = conditionKey;

  videoChangeTimer = setTimeout(() => {
    // Check if condition is still the same after delay
    if (
      currentVideoCondition === conditionKey &&
      pendingVideoChange === videoPath
    ) {
      applyBackgroundVideoChange(videoPath);
      pendingVideoChange = null;
    }
    videoChangeTimer = null;
  }, VIDEO_CHANGE_DELAY);
}

// Display weather prediction
function displayWeatherPrediction(className) {
  const weather = weatherPredictions[className.toLowerCase()];
  const weatherDiv = document.getElementById("weather-prediction");
  const weatherSection = document.getElementById("weather-prediction-section");

  if (!weather) {
    weatherSection.style.display = "none";
    // Reset background if no weather data
    controlBackgroundVideo("", "");
    return;
  }

  // Show weather section
  weatherSection.style.display = "block";

  // Control background video based on condition and precipitation
  controlBackgroundVideo(weather.condition, weather.precipitation);

  const alertClass = weather.alert ? `weather-alert-${weather.alert}` : "";

  weatherDiv.innerHTML = `
        <div class="weather-main ${alertClass}">
            <div class="weather-icon-container">
                <i class="fas ${weather.icon}" style="color: ${weather.iconColor}; font-size: 4rem;"></i>
            </div>
            <div class="weather-condition">
                <h3 class="weather-condition-title">${weather.condition}</h3>
            </div>
        </div>
        
        <div class="weather-details">
            <div class="weather-detail-item">
                <i class="fas fa-thermometer-half"></i>
                <div>
                    <span class="detail-label">Suhu:</span>
                    <span class="detail-value">${weather.temperature}</span>
                </div>
            </div>
            <div class="weather-detail-item">
                <i class="fas fa-tint"></i>
                <div>
                    <span class="detail-label">Kelembaban:</span>
                    <span class="detail-value">${weather.humidity}</span>
                </div>
            </div>
            <div class="weather-detail-item">
                <i class="fas fa-wind"></i>
                <div>
                    <span class="detail-label">Angin:</span>
                    <span class="detail-value">${weather.wind}</span>
                </div>
            </div>
            <div class="weather-detail-item">
                <i class="fas fa-cloud-rain"></i>
                <div>
                    <span class="detail-label">Presipitasi:</span>
                    <span class="detail-value">${weather.precipitation}</span>
                </div>
            </div>
            <div class="weather-detail-item">
                <i class="fas fa-eye"></i>
                <div>
                    <span class="detail-label">Visibilitas:</span>
                    <span class="detail-value">${weather.visibility}</span>
                </div>
            </div>
        </div>
        
        <div class="weather-recommendation ${alertClass}">
            <i class="fas fa-info-circle"></i>
            <p>${weather.recommendation}</p>
        </div>
    `;
}

// Show loading state (only when section is visible)
function showLoading() {
  const predictionSection = document.getElementById("prediction-section");
  if (predictionSection && predictionSection.style.display !== "none") {
    const existingContent = predictionSection.querySelector(".label-container");
    if (!existingContent) {
      predictionSection.innerHTML =
        '<div class="loading"><i class="fas fa-spinner"></i><p>Memuat model...</p></div>';
    }
  }
}

// Hide loading state and restore structure if needed
function hideLoading() {
  const predictionSection = document.getElementById("prediction-section");
  if (predictionSection) {
    // Only restore if it's currently showing loading
    const loadingDiv = predictionSection.querySelector(".loading");
    if (loadingDiv) {
      predictionSection.innerHTML = `
                <h2 class="section-title">
                    <i class="fas fa-chart-line"></i>
                    Hasil Prediksi
                </h2>
                <div id="label-container" class="label-container"></div>
            `;
      labelContainer = document.getElementById("label-container");
    }
  }
}

// Initialize GSAP animations on page load (only hover effects, no initial animations)
document.addEventListener("DOMContentLoaded", function () {
  // Initialize background video
  const video = document.getElementById("background-video");
  if (video) {
    video.load(); // Preload video
    // Video will be shown/hidden based on weather condition
  }

  // Animate buttons on hover only
  gsap.utils.toArray(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      gsap.to(btn, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    btn.addEventListener("mouseleave", function () {
      gsap.to(btn, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
});

// Initialize model when page loads
window.addEventListener("load", init);
