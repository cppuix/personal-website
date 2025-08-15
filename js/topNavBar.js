const scrollLeftNavButton = document.getElementById("scrollLeftNavButton");
const scrollRightNavButton = document.getElementById("scrollRightNavButton");
const topNavbar = document.getElementById("topNavbar");

const scrollAmount = 30;

scrollLeftNavButton.onclick = () => {
  topNavbar.scrollLeft += scrollAmount;
};

scrollRightNavButton.onclick = () => {
  topNavbar.scrollLeft -= scrollAmount;
};