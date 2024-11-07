const countryBtn = document.getElementById('countryBtn');
const cityBtn = document.getElementById('cityBtn');
const countryLanguageBtn = document.getElementById('countryLanguageBtn');
const recordsTable = document.getElementById('records');

// Función para obtener el código de país según la IP
async function getCountryCode() {
    try {
        const response = await axios.get('//54.144.92.141/php-intro-connection/index.php');
        return response.data.country_code3;
    } catch (error) {
        console.error("Error al obtener el código de país:", error);
        return null;
    }
}

// Función para mostrar ciudades del país detectado
async function showCities() {
    clearRecords();
    const countryCode3 = await getCountryCode();
    if (countryCode3) {
        axios.get(`//54.144.92.141/php-intro-connection/getRecords.php?table=city&country_code3=${countryCode3}`)
            .then(response => {
                if (response.data.length > 0) {
                    // Ordena para mostrar la ciudad detectada primero, si existe
                    const sortedData = response.data.sort((a, b) => a.isDetected ? -1 : 1);
                    populateTable(sortedData, ['ID', 'Name', 'CountryCode', 'District', 'Population'], 'Ciudades');
                } else {
                    alert("No se encontraron ciudades para el país correspondiente.");
                }
            })
            .catch(error => {
                console.error("Error al obtener las ciudades:", error);
            });
    }
}

// Función para mostrar idiomas del país detectado
async function showLanguages() {
    clearRecords();
    const countryCode3 = await getCountryCode();
    if (countryCode3) {
        axios.get(`//54.144.92.141/php-intro-connection/getRecords.php?table=countrylanguage&country_code3=${countryCode3}`)
            .then(response => {
                if (response.data.length > 0) {
                    populateTable(response.data, ['CountryCode', 'Language', 'IsOfficial', 'Percentage'], 'Idiomas');
                } else {
                    alert("No se encontraron idiomas para el país correspondiente.");
                }
            })
            .catch(error => {
                console.error("Error al obtener los idiomas:", error);
            });
    }
}

// Asignar eventos a los botones
cityBtn.addEventListener('click', showCities);
countryLanguageBtn.addEventListener('click', showLanguages);

// Función para poblar la tabla
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
