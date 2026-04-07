const themeSwitch = document.getElementById("themeSwitch");

function textByLang(arText, enText, useEnglish)
{
  if (useEnglish && enText)
  {
    return enText;
  }
  return arText || enText || "";
}

async function loadSiteNavigation()
{
  const nav = document.getElementById("topNavbar");
  if (!nav)
  {
    return;
  }

  try
  {
    const res = await fetch("/content/site.json", { cache: "no-store" });
    if (!res.ok)
    {
      return;
    }

    const site = await res.json();
    if (!Array.isArray(site.nav_links) || site.nav_links.length === 0)
    {
      return;
    }

    const htmlLang = (document.documentElement.lang || "").toLowerCase();
    const useEnglish = htmlLang.startsWith("en") || site.default_language === "en";

    nav.innerHTML = site.nav_links.map(link =>
    {
      const label = textByLang(link.label_ar, link.label_en, useEnglish);
      const url = link.url || "/";
      return `<a href="${url}">${label}</a>`;
    }).join("\n");
  }
  catch (err)
  {
    console.warn("Navigation content unavailable:", err.message);
  }
}

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
  loadSiteNavigation().finally(() =>
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
});

