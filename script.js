const fileInput = document.getElementById("file-input");
const editBtn = document.getElementById("edit-btn");
const downloadTransparentBtn = document.getElementById("download-transparent-btn");
const downloadEditedBtn = document.getElementById("download-edited-btn");
const colorOptions = document.getElementById("color-options");
const preview = document.getElementById("preview");
const imagePreview = document.querySelector(".image-preview");
const colorPicker = document.getElementById("color-picker");
const selectedColors = document.getElementById("selected-colors");
const gradientInput = document.getElementById("gradient-input");
const gradientPreview = document.getElementById("gradient-preview");
const addColorBtn = document.getElementById("add-color-btn");
const addGradientBtn = document.getElementById("add-gradient-btn");

let selectedGradient = "";
let editedImageBlob; // To store the edited image blob

// Show image preview and color options when the Edit button is clicked
editBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
        alert("Please upload an image.");
        return;
    }

    const url = URL.createObjectURL(file);
    preview.src = url; // Set the preview image
    imagePreview.classList.remove("hidden");
    colorOptions.classList.remove("hidden");
    downloadTransparentBtn.classList.remove("hidden");
    downloadEditedBtn.classList.remove("hidden");

    // Call the API to remove the background
    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto"); // optional size parameter

    try {
        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": "Gc7QerdvAJ2SErR4Kv28hFpW",
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Error removing background");
        }

        editedImageBlob = await response.blob(); // Get the blob of the edited image
        alert("Background removed! Choose a color or gradient to apply.");

    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
});

// Function to add selected color
addColorBtn.addEventListener("click", () => {
    const color = colorPicker.value;
    const colorDiv = document.createElement("div");
    colorDiv.className = "selected-color";
    colorDiv.style.backgroundColor = color;
    selectedColors.appendChild(colorDiv);
});

// Function to add selected gradient
addGradientBtn.addEventListener("click", () => {
    const gradient = gradientInput.value;
    if (!gradient) {
        alert("Please enter a valid gradient.");
        return;
    }
    selectedGradient = gradient;
    gradientPreview.style.background = selectedGradient; // Show the gradient preview
});

// Handle download of the transparent image
downloadTransparentBtn.addEventListener("click", () => {
    if (!editedImageBlob) {
        alert("No edited image available for download.");
        return;
    }

    const url = URL.createObjectURL(editedImageBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transparent_image.png';
    link.click();
});

// Handle download of the edited image with selected background
downloadEditedBtn.addEventListener("click", () => {
    if (!editedImageBlob) {
        alert("No edited image available for download.");
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = URL.createObjectURL(editedImageBlob);
    
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the selected background color or gradient
        if (selectedGradient) {
            ctx.fillStyle = selectedGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill with gradient
        } else {
            ctx.fillStyle = colorPicker.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill with color
        }
        
        ctx.drawImage(img, 0, 0); // Draw the edited image on top

        canvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'edited_image.png';
            link.click();
        });
    };
});
