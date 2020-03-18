var arrayPines = [];
window.addEventListener('load', startScripts);

function startScripts() {

    load_map();

    //Animate the dropdown
    const menu = document.getElementById('menu');
    if (menu != null) {
        menu.addEventListener('click', () => {
            document.getElementById('items-menu').classList.toggle('slide');
            menu.classList.toggle('menuHover');
        });
    }

    /*
    *   Set dynamic content with select.
    *   When the administrator selects 'multiple select with answer unique - sumr', the system creates HTML content for the administrator adds the answer options.
    */
    const selectQuestion = document.getElementsByName('questiontype');
    if (selectQuestion[0] != null) {
        selectQuestion[0].addEventListener('change', () => {
            if (selectQuestion[0].value == 'smur') {
                createCardAnswers();
            } else {
                if (document.getElementById('multiplyAnswer')) {
                    deleteElementDOM(document.getElementById('multiplyAnswer'));
                }
            }
        });
    }

    const btnCloseMsg = document.getElementById('close');
    if (btnCloseMsg != null) {
        btnCloseMsg.addEventListener('click', () => document.getElementById('msg').remove());
    }

    const createInputTitle = document.getElementById('title');
    if (createInputTitle != null) {
        createInputTitle.addEventListener('keyup', () => {
            document.getElementById('survey-title').innerHTML = createInputTitle.value;
        });
    }

    const createInputIntroduction = document.getElementById('introduction');
    if (createInputIntroduction != null) {
        createInputIntroduction.addEventListener('keyup', () => {
            document.getElementById('survey-introduction').innerHTML = createInputIntroduction.value;
        });
    }

    const createInputEstimated = document.getElementById('estimated');
    if (createInputEstimated != null) {
        createInputEstimated.addEventListener('keyup', () => {
            document.getElementById('survey-estimated').innerHTML = `Tiempo estimado: ${createInputEstimated.value} minutos`;
        });
    }
}

/*
*   Remove DOM element object
*   element: DOM element object
*/
function deleteElementDOM(element) {
    element.remove();
}

function createCardAnswers() {
    const divMultiplyAnswer = document.createElement('div');
    divMultiplyAnswer.setAttribute('id', 'multiplyAnswer');
    divMultiplyAnswer.setAttribute('class', 'card multiplyAnswer');
    const h4 = document.createElement('h4');
    h4.setAttribute('class', 'card card-title');
    h4.innerHTML = 'Respuestas';
    const divOptionZone = document.createElement('div');
    divOptionZone.setAttribute('id', 'opcionzone');
    const divGroupInput = document.createElement('div');
    divGroupInput.setAttribute('class', 'group-input');
    const inputElement = document.createElement('input');
    inputElement.setAttribute('name', 'option1');
    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('required', 'required');
    const iElement = document.createElement('i');
    iElement.setAttribute('class', 'fas fa-trash-alt icon-red');
    const divGroupBtn = document.createElement('div');
    divGroupBtn.setAttribute('class', 'group-input');
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('id', 'addOption');
    button.setAttribute('class', 'btn-rad btn-green btn-right m-0');
    button.innerHTML = 'Añadir opción';
    const divGroupCheck = document.createElement('div');
    divGroupCheck.setAttribute('class', 'check');
    const inputCheck = document.createElement('input');
    inputCheck.setAttribute('name', 'other');
    inputCheck.setAttribute('type', 'checkbox');
    inputCheck.setAttribute('value', 'yes');
    const labelCheck = document.createElement('label');
    labelCheck.setAttribute('for', 'other');
    labelCheck.innerHTML = 'Añadir respuesta "Otro"';

    divGroupBtn.appendChild(button);

    divGroupInput.appendChild(inputElement);
    divGroupInput.appendChild(iElement);
    divOptionZone.appendChild(divGroupInput);

    divGroupCheck.appendChild(inputCheck);
    divGroupCheck.appendChild(labelCheck);

    divMultiplyAnswer.appendChild(h4);
    divMultiplyAnswer.appendChild(divOptionZone);
    divMultiplyAnswer.appendChild(divGroupCheck);
    divMultiplyAnswer.appendChild(divGroupBtn);

    const questionZone = document.getElementById('questionZone');
    questionZone.appendChild(divMultiplyAnswer);

    iElement.addEventListener('click', () => {
        deleteElementDOM(iElement.parentElement);
    });

    button.addEventListener('click', () => {
        const countOptCreated = document.getElementById('opcionzone').childElementCount;        //consultar cuantas opciones hay creadas hasta el momento
        const divGroupInput = document.createElement('div');
        const inputElement = document.createElement('input');
        const iElement = document.createElement('i');

        divGroupInput.setAttribute('class', 'group-input');
        inputElement.setAttribute('name', 'option' + (countOptCreated + 1).toString());
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('required', 'required');
        iElement.setAttribute('class', 'fas fa-trash-alt icon-red');

        divGroupInput.appendChild(inputElement);
        divGroupInput.appendChild(iElement);

        const opcionzone = document.getElementById('opcionzone');
        opcionzone.appendChild(divGroupInput);


        iElement.addEventListener('click', () => {
            deleteElementDOM(iElement.parentElement);
        });
    });
}

function showMsg(element) {
    element[1].style.display = 'inline';
}

function hiddenMsg(element) {
    element[1].style.display = 'none';
}

function load_map() {
    const tilesProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const containerMap = document.getElementById('map_canvas');
    if (containerMap != null) {
        let arrayMarkers = [];
        let marker;

        let map_canvas = L.map('map_canvas').setView([7.9043335, -72.511977], 12);
        L.tileLayer(tilesProvider, {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 18,
        }).addTo(map_canvas);

        marker = L.marker([7.9043335, -72.511977]).addTo(map_canvas);;

        map_canvas.addEventListener('click', function (event) {
            map_canvas.removeLayer(marker);
            let latlng = map_canvas.mouseEventToLatLng(event.originalEvent);
            marker = L.marker(latlng).addTo(map_canvas);

            //Request the process reverse geocoding to nominatim
            let request = new XMLHttpRequest();
            request.open('POST', "http://nominatim.openstreetmap.org/reverse?" +
                "format=geojson&" +
                "lat=" + latlng.lat + "&lon=" + latlng.lng, true);

            request.onload = function () {
                if (this.status >= 200 && this.status < 400) {
                    // Success!
                    let geoData = JSON.parse(this.response);
                    let featuresSite = geoData['features'];
                    let propertiesSite = featuresSite[0]['properties'];
                    let address = propertiesSite['display_name'];

                    const dir = document.getElementById('direction');
                    if (dir != null) {
                        dir.value = address + ' (Lat: ' + latlng.lat + ', Lon: ' + latlng.lng + ')';
                    }
                } else {
                    // We reached our target server, but it returned an error
                    console.log('Rejected request');
                }
            };
            request.onerror = function () {
                // There was a connection error of some sort
                console.log('Connection error');
            };
            request.send();
        });
    }
}