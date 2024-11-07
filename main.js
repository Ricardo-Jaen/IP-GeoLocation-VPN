const countryBtn = document.getElementById('countryBtn');
const cityBtn = document.getElementById('cityBtn');
const countryLanguageBtn = document.getElementById('countryLanguageBtn');
const recordsTable = document.getElementById('records');

// Función para limpiar los registros de la tabla
function clearRecords() {
    recordsTable.innerHTML = '';
}

// Función para poblar la tabla con datos
function populateTable(data, columns, tableTitle = '') {
    clearRecords();
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

// Evento para el botón de "País"
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
            alert("No se pudo obtener el código del país.");
        }
    } catch (error) {
        console.error("Error al obtener los datos de países filtrados:", error);
    }
});

// Evento para el botón de "Ciudades"
cityBtn.addEventListener('click', async () => {
    clearRecords();
    try {
        const ipResponse = await axios.get('//54.144.92.141/php-intro-connection/index.php');
        const countryCode3 = ipResponse.data.country_code3;

        if (countryCode3) {
            const response = await axios.get(`//54.144.92.141/php-intro-connection/getRecords.php?table=city&country_code3=${countryCode3}`);
            if (response.data.length > 0) {
                populateTable(response.data, ['ID', 'Name', 'CountryCode', 'District', 'Population'], 'Ciudades');
            } else {
                alert("No se encontraron registros para las ciudades del país.");
            }
        } else {
            alert("No se pudo obtener el código del país.");
        }
    } catch (error) {
        console.error("Error al obtener los datos de ciudades filtradas:", error);
    }
});

// Evento para el botón de "Idiomas"
countryLanguageBtn.addEventListener('click', async () => {
    clearRecords();
    try {
        const ipResponse = await axios.get('//54.144.92.141/php-intro-connection/index.php');
        const countryCode3 = ipResponse.data.country_code3;

        if (countryCode3) {
            const response = await axios.get(`//54.144.92.141/php-intro-connection/getRecords.php?table=countrylanguage&country_code3=${countryCode3}`);
            if (response.data.length > 0) {
                populateTable(response.data, ['CountryCode', 'Language', 'IsOfficial', 'Percentage'], 'Idiomas');
            } else {
                alert("No se encontraron registros para los idiomas del país.");
            }
        } else {
            alert("No se pudo obtener el código del país.");
        }
    } catch (error) {
        console.error("Error al obtener los datos de idiomas filtrados:", error);
    }
});
