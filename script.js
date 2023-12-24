const folderName = "images";

const imageNames = [
    "image (1).jpg",
    "image (2).jpg",
    "image (3).jpg",
    "image (4).jpg",
    "image (5).jpg",
    "image (6).jpg",
    "image (7).jpg",
    "image (8).jpg",
    "image (9).jpg",
    "image (10).jpg",
    "image (11).jpg"
];

const imageGalleryDiv = document.getElementById("imageGallery");
let isMouseDown = false;

imageNames.forEach(imageName => {
    const imgElement = document.createElement("img");
    imgElement.src = `${folderName}/${imageName}`;
    imgElement.alt = "Gallery Image";
    imgElement.classList.add("image");
    imgElement.setAttribute("draggable", "false");
    imgElement.style.objectPosition = `0 50% `;
    imageGalleryDiv.appendChild(imgElement);
});

