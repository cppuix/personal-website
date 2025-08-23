const scrollLeftNavButton = document.getElementById("scrollLeftNavButton");
const scrollRightNavButton = document.getElementById("scrollRightNavButton");
const topNavbar = document.getElementById("topNavbar");

const scrollAmount = 30;

scrollLeftNavButton.onclick = () => {
  console.log("scrolling left", topNavbar.scrollLeft);
  topNavbar.scrollLeft += scrollAmount;
};

scrollRightNavButton.onclick = () => {
  console.log("scrolling right", topNavbar.scrollLeft);
  topNavbar.scrollLeft -= scrollAmount;
};