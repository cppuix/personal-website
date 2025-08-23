const themeSwitch = document.getElementById("themeSwitch");

//##################################################
//                      THEME STUFF
//##################################################

if (localStorage.getItem("theme") === "light")  
{
  document.body.classList.add("light-mode");
}

themeSwitch.addEventListener("click", () =>
{
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

function goToPlaylist(playlistIndex)
{
  localStorage.setItem("currentPlaylistIndex", playlistIndex)
  window.location.href = "/lessons.html";
}

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function adjustNavbar()
{
  
  var x = document.getElementById("topNavbar");
  console.log("adjusting navbar", x.className)
  if (x.className === "navbar")
  {
    console.log(x.className)
    x.className += " responsive";
  }
  else
  {
    x.className = "navbar";
  }
}


document.addEventListener("DOMContentLoaded", function()
{
    let links = document.querySelectorAll("#topNavbar a");
    let currentPage = window.location.pathname;

    links.forEach(link =>
    {
        if (link.getAttribute("href") === currentPage)
        {
            link.classList.add("active");
        }
    });
});

