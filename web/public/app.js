console.log('...Frontend Loaded...');

const btnAllLoans = document.getElementById('btnAllLoans');
const btnNotReturned = document.getElementById('btnNotReturned');
const btnTopAuthors = document.getElementById('btnTopAuthors');
const outputDiv = document.getElementById('output');

btnAllLoans.addEventListener('click', () => {
    fetchAndRender('/api/loans');
});
btnNotReturned.addEventListener('click', () => {
    fetchAndRender('/api/loans/not-returned');
});
btnTopAuthors.addEventListener('click', () => {
    fetchAndRender('/api/authors/top');
});


// FUNCION PARA RENDERIZAR TABLA CON LOS DATOS OBTENIDOS DE LAS CONSULTAS. SI NO HAY DATOS, INDICA QUE NO SE HAN CONSEGUIDO.

function renderTable(data) {

    // Limpiar el contenido previo
    outputDiv.innerHTML = '';
    
    // Si no hay datos, mostrar mensaje
    if (data.length === 0 ) {
        outputDiv.dataset.state = 'empty'
        outputDiv.textContent = 'No data found.';
        return;
    }

    // Tabla, cabecera y fila de cabecera
    const table = document.createElement('table');
    table.classList.add('dataTable')
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const columns = Object.keys(data[0]);
    
    columns.forEach(key => { // devuelve array con claves del primer objeto

        // Celda de cabecera para claves
        const th = document.createElement('th');
        th.classList.add('headerCell');
        th.textContent = key;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);
    

    // Cuerpo de la tabla
    const tbody = document.createElement('tbody');
    tbody.classList.add('tableBody');

    // Primera iteración para cada objeto del array
    data.forEach(item => {
        const row = document.createElement('tr');

        // Segunda iteración para cada clave del objeto
        columns.forEach(col => {
            const td = document.createElement('td');
            td.classList.add('dataCell');
            td.textContent = item[col] ?? '';
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    outputDiv.dataset.state = 'table'
    outputDiv.appendChild(table);
}

async function fetchAndRender(url) {
    outputDiv.dataset.state = 'loading'
    outputDiv.textContent = `Loading data from ${url}...`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error - Status: ${response.status}`);
        }
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error fetching data: ', error);
        outputDiv.dataset.state = 'error'
        outputDiv.textContent = 'Error loading data';
    }
}