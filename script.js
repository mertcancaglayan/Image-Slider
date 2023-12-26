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


const sliding = (value) => {
	imageGalleryDiv.animate(
		{
			transform: `translate(${-value}%)`,
		},
		{ duration: 1100, fill: "forwards" },
	);
}

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

	let percentage = (mouseDelta / maxDelta) * 100;
	let nextPercentage = parseFloat(imageGalleryDiv.dataset.prevPercentage) + percentage;

	nextPercentage = Math.min(nextPercentage, 125);
	nextPercentage = Math.max(nextPercentage, -125);

	imageGalleryDiv.dataset.percentage = nextPercentage;

	sliding(nextPercentage);
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

	let percentage = (touchDelta / maxDelta) * 100;
	let nextPercentage = parseFloat(imageGalleryDiv.dataset.prevPercentage) + percentage;

	nextPercentage = Math.min(nextPercentage, 125);
	nextPercentage = Math.max(nextPercentage, -125);

	imageGalleryDiv.dataset.percentage = nextPercentage;

	sliding(nextPercentage);
};

window.onwheel = (event) => {
	if (isZoomed) return;
	const wheelValue = event.deltaY;

	let percentage = wheelValue / 15;
	let nextPercentage = parseFloat(imageGalleryDiv.dataset.prevPercentage) + percentage;

	nextPercentage = Math.min(nextPercentage, 125);
	nextPercentage = Math.max(nextPercentage, -125);

	imageGalleryDiv.dataset.prevPercentage = nextPercentage;

	sliding(nextPercentage);
};

let isZoomed = false;

const bodyTransition = (clickedElement) => {
	const images = document.querySelectorAll(".image");

	if (isZoomed) {
		images.forEach((img) => {
			if (img === clickedElement) {
				img.style.filter = "none";
			} else {
				img.style.filter = "blur(5px)";
				img.style.transition = "filter 0.5s ease-in-out";
			}
		});
	} else {
		imageGalleryDiv.style.filter = "none";
		images.forEach((img) => {
			img.style.filter = "none";
		});
	}
};

let isZooming = false;

const disableClick = () => {
	const overlay = document.createElement("div");
	overlay.style.position = "fixed";
	overlay.style.top = "0";
	overlay.style.left = "0";
	overlay.style.width = "100%";
	overlay.style.height = "100%";
	overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
	overlay.style.zIndex = "9999";
	overlay.id = "clickOverlay";

	document.body.appendChild(overlay);

	document.body.style.overflow = "hidden";
};

const enableClick = () => {
	const overlay = document.getElementById("clickOverlay");
	if (overlay) {
		overlay.parentNode.removeChild(overlay);
	}
};

const zoomOut = (clickedElement) => {
	if (isZooming) {
		return;
	}

	isZooming = true;

	disableClick();

	clickedElement.classList.remove("zoom");
	clickedElement.animate(
		{
			transform: "scale(1)",
		},
		{
			duration: 500,
			fill: "forwards",
		},
	);
	isZoomed = false;
	bodyTransition(clickedElement);

	setTimeout(() => {
		clickedElement.style.zIndex = 0;
		isZooming = false;
		enableClick();
	}, 500);
};

const zoomIn = (clickedElement) => {
	if (isZooming) {
		return;
	}

	isZooming = true;

	disableClick();

	clickedElement.classList.add("zoom");
	clickedElement.animate(
		{
			transform: "scale(1.6)",
		},
		{
			duration: 500,
			fill: "forwards",
		},
	);
	isZoomed = true;
	bodyTransition(clickedElement);
	clickedElement.style.zIndex = 1;

	setTimeout(() => {
		isZooming = false;
		enableClick();
	}, 500);
};

imageGalleryDiv.addEventListener("click", (event) => {
    const clickedElement = event.target;

    if (clickedElement === imageGalleryDiv) {
        return;
    }

    const elements = document.querySelectorAll(".image");
    const elementIndex = Array.from(elements).indexOf(clickedElement);

    const totalElements = elements.length;
    const percentage = (elementIndex / (totalElements - 1)) * 250 - 125;

    imageGalleryDiv.dataset.percentage = percentage;

	sliding(percentage)
    const zoomedChild = imageGalleryDiv.querySelector(".zoom");

    if (clickedElement.classList.contains("zoom")) {
        zoomOut(clickedElement);
    } else {
        if (zoomedChild) {
            zoomOut(zoomedChild);
        } else {
            zoomIn(clickedElement);
        }
    }
});
