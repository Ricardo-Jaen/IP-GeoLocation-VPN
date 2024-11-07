//hola
const countryBtn = document.getElementById('countryBtn');
const cityBtn = document.getElementById('cityBtn');
const countryLanguageBtn = document.getElementById('countryLanguageBtn');
const searchCountryBtn = document.getElementById('searchCountryBtn');
const recordsTable = document.getElementById('records');
const searchInput = document.getElementById('searchInput');
const modalSearchButton = document.getElementById('modalSearchButton');
const searchModal = new bootstrap.Modal(document.getElementById('searchModal'));

// Mostrar la ventana flotante
searchCountryBtn.addEventListener('click', () => {
    searchModal.show();
});

// Evento para el botón Buscar dentro del modal
modalSearchButton.addEventListener('click', () => {
    const countryName = searchInput.value.trim();
    if (!countryName) {
        alert("Debes ingresar un nombre de país.");
        return;
    }
    clearRecords();

    // Solicitud GET en axios con el nombre del país
    axios.get(`//54.144.92.141/php-intro-connection/getRecords.php?search=${encodeURIComponent(countryName)}`)
        .then(response => {
            const data = response.data;
            if (data.country && data.country.length > 0) {
                populateTable(data.country, ['Code', 'Name', 'Continent', 'Region', 'Population'], 'Países');
            } else {
                alert("No se encontraron registros para el país especificado.");
            }

            if (data.city && data.city.length > 0) {
                populateTable(data.city, ['ID', 'Name', 'CountryCode', 'District', 'Population'], 'Ciudades');
            }

            if (data.countrylanguage && data.countrylanguage.length > 0) {
                populateTable(data.countrylanguage, ['CountryCode', 'Language', 'IsOfficial', 'Percentage'], 'Idiomas');
            }
        })
        .catch(error => {
            console.error(error);
            alert("Ocurrió un error al realizar la búsqueda.");
        });

    searchModal.hide();
});

countryBtn.addEventListener('click', async () => {
    clearRecords();
    try {
        const ipResponse = await axios.get('//54.144.92.141/php-intro-connection/index.php');
        const countryCode3 = ipResponse.data.country_code3;
        if (countryCode3) {
            const response = await axios.get(`//54.144.92.141/php-intro-connection/getRecords.php?table=country&country_code3=${countryCode3}`);
            if (response.data.length > 0) {
                populateTable(response.data, ['Code', 'Name', 'Continent', 'Region', 'Population'], 'Países');
            } else {
                alert("No se encontraron registros para el país correspondiente.");
            }
        } else {
            console.error("El country_code3 no está definido.");
        }
    } catch (error) {
        console.error("Error al obtener los datos de países filtrados:", error);
    }
});

cityBtn.addEventListener('click', () => {
    clearRecords();
    axios.get('//54.144.92.141/php-intro-connection/getRecords.php?table=city')
        .then(response => {
            populateTable(response.data, ['ID', 'Name', 'CountryCode', 'District', 'Population'], 'Ciudades');
        })
        .catch(error => {
            console.error(error);
        });
});

countryLanguageBtn.addEventListener('click', () => {
    clearRecords();
    axios.get('//54.144.92.141/php-intro-connection/getRecords.php?table=countrylanguage')
        .then(response => {
            populateTable(response.data, ['CountryCode', 'Language', 'IsOfficial', 'Percentage'], 'Idiomas');
        })
        .catch(error => {
            console.error(error);
        });
});

function populateTable(data, columns, tableTitle = '') {
    recordsTable.innerHTML = '';
    if (tableTitle) {
        const titleRow = document.createElement('tr');
        const titleCell = document.createElement('td');
        titleCell.colSpan = columns.length;
        titleCell.innerHTML = `<strong>${tableTitle}</strong>`;
        titleRow.appendChild(titleCell);
        recordsTable.appendChild(titleRow);
    }
    const headerRow = document.createElement('tr');
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });
    recordsTable.appendChild(headerRow);
    data.forEach(item => {
        const row = document.createElement('tr');
        columns.forEach(col => {
            const td = document.createElement('td');
            td.textContent = item[col] || '';
            row.appendChild(td);
        });
        recordsTable.appendChild(row);
    });
}

function clearRecords() {
    recordsTable.innerHTML = '';
}
