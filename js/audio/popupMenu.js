const menu = document.getElementById("audioOptionsContainer");
const menuButton = document.getElementById("audioMenuButton");
const autoPlayIcon = document.getElementById("autoPlayIcon");
const noAutoPlayIcon = document.getElementById("noAutoPlayIcon");


function toggleMenu(event)
{
    event.stopPropagation(); // منع تأثير النقرات الخارجية غير المرغوب فيها

    const { innerWidth: w, innerHeight: h } = window;
    const { width: mw, height: mh } = menu.getBoundingClientRect();
    // const { offsetLeft: mbx, offsetTop: mby, offsetWidth: mbw, offsetHeight: mbh } = menuButton;
    const { left: mbx, top: mby, height: mbh } = menuButton.getBoundingClientRect();

    let posX = mbx, posY = mby + mbh + 5; // المحاذاة أسفل الزر مع إزاحة

    if (posX + mw > w) posX = w - mw - 10; // عدم تجاوز الحافة اليمنى
    if (posY + mh > h) posY = h - mh; // عدم تجاوز الحافة السفلية

    const visible = (menu.style.visibility === "visible");

    if (visible)
    {
        menu.style.visibility = "hidden";
    }
    else
    {
        menu.style.visibility = "visible";
        menu.style.left = `${posX}px`;
        menu.style.top = `${posY}px`;
    }
}

// إغلاق القائمة عند النقر خارجها
document.addEventListener("click", (event) =>
{
    const menu = document.getElementById("audioOptionsContainer");
    const menuButton = document.getElementById("audioMenuButton");

    if (menu.style.visibility === "visible" && !menu.contains(event.target) && !menuButton.contains(event.target))
    {
        menu.style.visibility = "hidden";
    }
});

function toggleAutoPlay()
{
    autoPlay = !autoPlay;

    if(autoPlay)
    {
        localStorage.setItem("autoPlay", "true");
        autoPlayIcon.style.display = "inline";
        noAutoPlayIcon.style.display = "none";
    }
    else
    {
        localStorage.setItem("autoPlay", "false");
        autoPlayIcon.style.display = "none";
        noAutoPlayIcon.style.display = "inline";
    }
}