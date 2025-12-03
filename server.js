const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./fitness.db');
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize Database
db.serialize(() => {
    // Table for Workout Circuits (e.g., "Leg Day")
    db.run(`CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        frequency INTEGER
    )`);

    // Table for Exercises within a circuit
    db.run(`CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER,
        name TEXT,
        sets INTEGER,
        reps INTEGER,
        weight REAL,
        FOREIGN KEY(workout_id) REFERENCES workouts(id)
    )`);

    // Table for Body Stats
    db.run(`CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        weight REAL,
        notes TEXT
    )`);
});

// --- API ROUTES ---

// 1. Get all Workouts and their exercises
app.get('/api/workouts', (req, res) => {
    const query = `
        SELECT w.id as w_id, w.name as w_name, w.frequency, 
               e.id as e_id, e.name as e_name, e.sets, e.reps, e.weight
        FROM workouts w
        LEFT JOIN exercises e ON w.id = e.workout_id
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json(err.message);
        
        // Group exercises by workout
        const workouts = {};
        rows.forEach(row => {
            if (!workouts[row.w_id]) {
                workouts[row.w_id] = {
                    id: row.w_id,
                    name: row.w_name,
                    frequency: row.frequency,
                    exercises: []
                };
            }
            if (row.e_id) {
                workouts[row.w_id].exercises.push({
                    name: row.e_name,
                    sets: row.sets,
                    reps: row.reps,
                    weight: row.weight
                });
            }
        });
        res.json(Object.values(workouts));
    });
});

// 2. Add a new Workout Circuit
app.post('/api/workouts', (req, res) => {
    const { name, frequency } = req.body;
    db.run(`INSERT INTO workouts (name, frequency) VALUES (?, ?)`, [name, frequency], function(err) {
        if (err) return res.status(500).json(err.message);
        res.json({ id: this.lastID });
    });
});

// 3. Add Exercise to a Workout
app.post('/api/exercises', (req, res) => {
    const { workout_id, name, sets, reps, weight } = req.body;
    db.run(`INSERT INTO exercises (workout_id, name, sets, reps, weight) VALUES (?, ?, ?, ?, ?)`, 
        [workout_id, name, sets, reps, weight], function(err) {
        if (err) return res.status(500).json(err.message);
        res.json({ id: this.lastID });
    });
});

// 4. Get Body Stats
app.get('/api/stats', (req, res) => {
    db.all(`SELECT * FROM stats ORDER BY date DESC`, [], (err, rows) => {
        if (err) return res.status(500).json(err.message);
        res.json(rows);
    });
});

// 5. Add Body Stats
app.post('/api/stats', (req, res) => {
    const { weight, notes } = req.body;
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    db.run(`INSERT INTO stats (date, weight, notes) VALUES (?, ?, ?)`, [date, weight, notes], function(err) {
        if (err) return res.status(500).json(err.message);
        res.json({ id: this.lastID });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});