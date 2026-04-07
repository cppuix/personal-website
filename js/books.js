
const reader = document.getElementById("reader");
const bookFrame = document.getElementById("bookFrame");



function toggleFullScreenPdf()
{
    if (document.fullscreenElement)
    {
        exitFullScreenPdf()
    }
    else
    {
        maximizePdf()
    }
}

function maximizePdf()
{
    if (reader.requestFullscreen)  
    {
        reader.requestFullscreen();
    }
    else if (reader.mozRequestFullScreen)  
    {
        reader.mozRequestFullScreen();
    }
    else if (reader.webkitRequestFullscreen)  
    {
        reader.webkitRequestFullscreen();
    }
    else if (reader.msRequestFullscreen)  
    {
        reader.msRequestFullscreen();
    }
}

function exitFullScreenPdf()
{
    if (document.fullscreenElement)  
    {
        document.exitFullscreen();
    }
    else if (document.mozFullScreenElement)  
    {
        document.mozCancelFullScreen();
    }
    else if (document.webkitFullscreenElement)  
    {
        document.webkitExitFullscreen();
    }
    else if (document.msFullscreenElement)  
    {
        document.msExitFullscreen();
    }
}

function toggleFullScreen()
{
    if (document.fullscreenElement)
    {
        exitFullScreenPdf()
    }
    else
    {
        maximize()
    }
}