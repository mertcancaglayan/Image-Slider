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
	"image (11).jpg",
];

const imageGalleryDiv = document.getElementById("imageGallery");
let isMouseDown = false;


imageNames.forEach((imageName) => {
	const imgElement = document.createElement("img");
	imgElement.src = `${folderName}/${imageName}`;
	imgElement.alt = "Gallery Image";
	imgElement.classList.add("image");
	imgElement.setAttribute("draggable", "false");
	imageGalleryDiv.appendChild(imgElement);
});

window.onmousedown = (event) => {
	event.preventDefault();
	isMouseDown = true;
	imageGalleryDiv.dataset.mouseDownAt = event.clientX;
	imageGalleryDiv.dataset.prevPercentage = parseFloat(imageGalleryDiv.dataset.percentage) || 0;
};

window.onmouseup = () => {
	imageGalleryDiv.dataset.mouseDownAt = 0;
	isMouseDown = false;
};

window.onmousemove = (event) => {
	if (!isMouseDown || isZoomed) return;


	const mouseDelta = parseFloat(imageGalleryDiv.dataset.mouseDownAt) - event.clientX;
	const maxDelta = window.innerWidth / 2;

	let percentage = (mouseDelta / maxDelta) * -100;
	let nextPercentage = parseFloat(imageGalleryDiv.dataset.prevPercentage) + percentage;

	nextPercentage = Math.min(nextPercentage, 100);
	nextPercentage = Math.max(nextPercentage, -100);

	imageGalleryDiv.dataset.percentage = nextPercentage;

    imageGalleryDiv.animate({
        transform:`translate(${nextPercentage}%)`
    }, {duration: 1100, fill:"forwards"});

};

window.ontouchstart = (event) => {
	event.preventDefault();
	isMouseDown = true;
	imageGalleryDiv.dataset.touchStartX = event.touches[0].clientX;
};

window.ontouchend = () => {
	isMouseDown = false;
};

window.ontouchmove = (event) => {
	if (!isMouseDown || isZoomed) return;
	event.preventDefault();

	const touchDelta = parseFloat(imageGalleryDiv.dataset.touchStartX) - event.touches[0].clientX;
	const maxDelta = window.innerWidth / 2;

	let percentage = (touchDelta / maxDelta) * -100;
    let nextPercentage = parseFloat(imageGalleryDiv.dataset.prevPercentage) + percentage;

	nextPercentage = Math.min(nextPercentage, 100);
	nextPercentage = Math.max(nextPercentage, -100);

	imageGalleryDiv.dataset.percentage = nextPercentage;


    imageGalleryDiv.animate({
        transform:`translate(${nextPercentage}%)`
    }, {duration: 1100, fill:"forwards"});
};

window.onwheel = (event) => {
    if (isZoomed) return;
    const wheelValue = event.deltaY;

    let percentage = wheelValue / 15;
    let nextPercentage = parseFloat(imageGalleryDiv.dataset.prevPercentage) + percentage;

    nextPercentage = Math.min(nextPercentage, 100);
    nextPercentage = Math.max(nextPercentage, -100);

    imageGalleryDiv.dataset.prevPercentage = nextPercentage;

    imageGalleryDiv.animate({
        transform:`translate(${-nextPercentage}%)`
    }, {duration: 1100, fill:"forwards"});
};


let isZoomed = false;

const bodyTransition = (clickedElement) => {
    const images = document.querySelectorAll('.image');

    if (isZoomed) {
        images.forEach(img => {
            if (img === clickedElement) {
                img.style.filter = "none";
            } else {
                img.style.filter = "blur(5px)";
                img.style.transition = "filter 0.5s ease-in-out";
            }
        });
    } else {
        imageGalleryDiv.style.filter = "none";
        images.forEach(img => {
            img.style.filter = "none";
        });
    }
};

const zoomOut = (clickedElement) => {
    clickedElement.animate({
        transform: "scale(1)"
    }, {
        duration: 500,
        fill: "forwards"
    });
    isZoomed = false;
    bodyTransition(clickedElement);
    clickedElement.classList.remove("zoom");
};

const zoomIn = (clickedElement) => {
    clickedElement.classList.add("zoom");
    clickedElement.animate({
        transform: "scale(1.6)"
    }, {
        duration: 500,
        fill: "forwards"
    });
    isZoomed = true;
    bodyTransition(clickedElement);
    clickedElement.style.zIndex = 1;
};

imageGalleryDiv.addEventListener("click", (event) => {
    const clickedElement = event.target;

    if (clickedElement === imageGalleryDiv) {
        return;
    }

    if (clickedElement.classList.contains("zoom")) {
        zoomOut(clickedElement);
    } else {
        zoomIn(clickedElement);
    }
});
