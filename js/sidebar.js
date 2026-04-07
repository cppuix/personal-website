
var sideModal = document.getElementById("sideModal");
var aboutModal = document.getElementById("aboutModal");

var openSideModalButton = document.getElementById("openSideModalButton");
var closeSideModalButton = document.getElementById("collapseSideModalButton");
var closeAboutModalButton = document.getElementById("closeAboutModalButton");

openSideModalButton.onclick = function ()
{
  sideModal.style.display = "block";
}

closeSideModalButton.onclick = function ()
{
  sideModal.style.display = "none";
}

closeAboutModalButton.onclick = function ()
{
  aboutModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event)
{
  if (event.target == aboutModal)
  {
    aboutModal.style.display = "none";
  }
  if (event.target == sideModal)
  {
    sideModal.style.display = "none";
  }
}

function openAboutDialog()
{
  aboutModal.style.display = "block";
}