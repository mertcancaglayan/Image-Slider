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
	if (!isMouseDown) return;

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
	if (!isMouseDown) return;
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
    event.preventDefault();

    const wheelDelta = event.deltaY;
    const maxDelta = window.innerHeight / 2;

    // Adjust the factor to control the scrolling speed
    const scrollFactor = 0.21; // Adjust this value to control the scroll speed (21% in this case)

    let percentage = (wheelDelta / maxDelta) * scrollFactor;
    let nextPercentage = parseFloat(imageGalleryDiv.dataset.prevPercentage) + percentage;

    nextPercentage = Math.min(nextPercentage, 21);
    nextPercentage = Math.max(nextPercentage, -21);

    imageGalleryDiv.dataset.percentage = nextPercentage;

    imageGalleryDiv.animate({
        transform: `translate(${nextPercentage}%)`
    }, { duration: 1100, fill: "forwards" });
};