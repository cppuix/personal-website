let audios = []
let filePrefix = "https://archive.org/download/dorosJami3MasailElAkida/";


function goToPageFromSpinbox(event) {
    const pageNum = event.target.value;
    if (pageNum) {
        window.location.href = `/jamieMasailAqeeeda/lesson${pageNum}/`;
    }
}

document.getElementById('first').addEventListener('click', () => {
    window.location.href = `/jamieMasailAqeeeda/lesson1/`;
});

document.getElementById('prev').addEventListener('click', () => {
    const current = parseInt(document.getElementById('pagination-spinbox').value);
    if (current > 1) window.location.href = `/jamieMasailAqeeeda/lesson${current - 1}/`;
});

document.getElementById('next').addEventListener('click', () => {
    const current = parseInt(document.getElementById('pagination-spinbox').value);
    if(audios.length > 0 && current + 1 < audios.length)
    window.location.href = `/jamieMasailAqeeeda/lesson${current + 1}/`;
});

document.getElementById('last').addEventListener('click', () => {
    if (audios.length > 0)
    {
        window.location.href = `/jamieMasailAqeeeda/lesson${audios.length}/`;
    }
});

const paginationSpinbox = document.getElementById('pagination-spinbox');

fetch(`/json/jmasLessons.json?ts=${Date.now()}`)
    .then(response => response.json())
    .then(data => {
        audios = data;
        const totalLessons = data.length;

        // Set maxlength based on number of digits
        paginationSpinbox.setAttribute('maxlength', totalLessons.toString().length);

        // Clamp current value if needed
        let val = parseInt(paginationSpinbox.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > totalLessons) val = totalLessons;
        paginationSpinbox.value = val;
    })
    .catch(err => console.error("Error fetching lessons:", err));


//######################################################################

function populateDatalist()
{
    if (!audios.length) return; // Ensure audios is loaded  

    const datalist = document.getElementById("page-suggestions");
    datalist.innerHTML = ""; // Clear existing options  

    for (let i = 1; i <= audios.length; i++)
    {
        let option = document.createElement("option");
        option.value = i;
        datalist.appendChild(option);
    }
}

document.querySelectorAll('.lessonLink').forEach(item => 
{
    item.addEventListener('click', event => 
    {
        const current = event.target.dataset.lesson;
    if (current > 1) window.location.href = `/jamieMasailAqeeeda/lesson${current - 1}/`;

        sideModal.style.display = "none";
    });
});