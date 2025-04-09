const API_URL = 'http://localhost:3000/api';
let selectedColor = '#000000';
let isMouseDown = false;

// DOM elements
const gridContainer = document.getElementById('grid-container');
const refreshButton = document.getElementById('refresh-btn');
const statusElement = document.getElementById('status');
const colorOptions = document.querySelectorAll('.color-option');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchGrid();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    refreshButton.addEventListener('click', fetchGrid);
    
    // Color picker
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedColor = option.getAttribute('data-color');
        });
    });
    
    // Mouse events for continuous drawing
    document.addEventListener('mousedown', () => { isMouseDown = true; });
    document.addEventListener('mouseup', () => { isMouseDown = false; });
}

// Fetch grid data from API
async function fetchGrid() {
    try {
        showStatus('Loading grid...', 'info');
        const response = await fetch(`${API_URL}/grid`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch grid: ${response.status}`);
        }
        
        const gridData = await response.json();
        renderGrid(gridData);
        showStatus('Grid loaded successfully!', 'success');
        setTimeout(() => hideStatus(), 2000);
    } catch (error) {
        console.error('Error fetching grid:', error);
        showStatus(`Error: ${error.message}`, 'error');
    }
}

// Render grid based on data
function renderGrid(gridData) {
    gridContainer.innerHTML = '';
    
    gridData.grid.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        rowElement.className = 'grid-row';
        
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'grid-cell';
            cellElement.style.backgroundColor = cell;
            
            // Add click event for painting
            cellElement.addEventListener('mousedown', () => {
                updateCell(rowIndex, colIndex, selectedColor);
            });
            
            cellElement.addEventListener('mouseover', () => {
                if (isMouseDown) {
                    updateCell(rowIndex, colIndex, selectedColor);
                }
            });
            
            rowElement.appendChild(cellElement);
        });
        
        gridContainer.appendChild(rowElement);
    });
}

// Update cell color
async function updateCell(row, col, color) {
    try {
        const response = await fetch(`${API_URL}/pixel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ row, col, color })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update pixel: ${response.status}`);
        }
        
        const gridData = await response.json();
        renderGrid(gridData);
    } catch (error) {
        console.error('Error updating pixel:', error);
        showStatus(`Error: ${error.message}`, 'error');
    }
}

// Status message handling
function showStatus(message, type) {
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
    statusElement.style.display = 'block';
}

function hideStatus() {
    statusElement.style.display = 'none';
}