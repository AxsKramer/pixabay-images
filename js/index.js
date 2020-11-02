const result = document.querySelector('#result');
const form = document.querySelector('#form');
const pageDiv = document.querySelector('#paging');
const alertDiv = document.getElementById('alert');

const registersPerPage = 30;
let totalPages;
let iterator;
let currentPage = 1;

form.addEventListener('submit', validateForm);

function validateForm(event) {
    event.preventDefault();
    const term = document.querySelector('#term').value;
    if(term === '' || !isNaN(term)) {
        showAlert('Add a correct search term');
        return;
    }
    else{
        searchImages();
    }
}

function showAlert(message) {
    const alert = document.querySelector('alert');
    if(!alert) {
        const alert = document.createElement('p');
        alert.classList.add('text-center', 'alert', 'alert-danger');
        alert.innerHTML = `
            <strong class="font-weight-bold">Error!</strong>
            <span class="font-weight-normal">${message}</span>
        `;
        alertDiv.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }
}

async function searchImages() {
    const term = document.querySelector('#term').value;
    const key = '1732750-d45b5378879d1e877cd1d35a6';
    const url = `https://pixabay.com/api/?key=${key}&q=${term}&per_page=${registersPerPage}&page=${currentPage}`;
    const response = await fetch(url);
    const data = await response.json();
    totalPages = calcPages(data.totalHits);
    showImages(data.hits);
}

function showImages(images) {
    if(result.firstChild){
        cleanHtml(result);
    }
    images.forEach( image => {
        const { previewURL, likes, views, largeImageURL } = image;
        result.innerHTML += `
            <div class="card mt-4" style="width: 12rem;">
                <img class="card-img-top" src="${previewURL}" alt='image from pixabay' litle='image from pixabay'>
                <div class="card-body">
                    <p class="font-weight-bold card-text d-flex justify-content-between"> 
                        ${likes} <span class="font-weight-normal"> Likes </span> 
                        ${views} <span class="font-weight-normal"> Views </span> 
                    </p>
                    <a class="btn btn-primary btn-block" href="${largeImageURL}" target="_blank" rel="noopener noreferrer" >
                        See image
                    </a>
                </div>
            </div>
        `;
    });
    cleanHtml(pageDiv);
    printPagesIterator();
}

function calcPages(total) {
    return parseInt( Math.ceil( total / registersPerPage ));
}

function printPagesIterator() {
    iterator = createPageIterator(totalPages);
    while(true) {
        const { value, done} = iterator.next();
        if(done) return;

        const link = document.createElement('a');
        link.href = '#';
        link.dataset.page = value;
        link.textContent = value;
        link.classList.add('text-white', 'btn', 'btn-primary', 'mr-1', 'mt-1', 'px-2');
        link.onclick = () => {
            currentPage = value;
            searchImages();
        }
        pageDiv.appendChild(link);
    }
}

function* createPageIterator(total) {
    for (let i = 1; i <= total; i++ ) {
        yield i;
    }
}

function cleanHtml(element){
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}