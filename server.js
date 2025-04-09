const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize grid (20x20 grid with white pixels)
const DEFAULT_COLOR = '#ffffff';
const GRID_SIZE = 20;
let grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(DEFAULT_COLOR));

// API Routes
app.get('/api/grid', (req, res) => {
    res.json({ grid });
});

// New endpoint to update a pixel
app.post('/api/pixel', (req, res) => {
    const { row, col, color } = req.body;
    
    // Validate inputs
    if (row === undefined || col === undefined || !color) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Validate row and column are within grid bounds
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
        return res.status(400).json({ error: 'Row or column out of bounds' });
    }
    
    // Validate color format (basic hex color validation)
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(color)) {
        return res.status(400).json({ error: 'Invalid color format' });
    }
    
    // Update the pixel
    grid[row][col] = color;
    
    // Return the updated grid
    res.json({ grid, updated: { row, col, color } });
});

// Start server
app.listen(PORT, () => {
    console.log(`Pixel Grid server running on http://localhost:${PORT}`);
});
