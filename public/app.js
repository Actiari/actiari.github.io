const API_URL = '/api';

// --- Navigation ---
function showSection(sectionId) {
    document.getElementById('workouts-section').classList.add('hidden');
    document.getElementById('stats-section').classList.add('hidden');
    document.getElementById(`${sectionId}-section`).classList.remove('hidden');
}

// --- Workouts Logic ---
async function loadWorkouts() {
    const res = await fetch(`${API_URL}/workouts`);
    const workouts = await res.json();
    const container = document.getElementById('workout-list');
    container.innerHTML = '';

    workouts.forEach(w => {
        const div = document.createElement('div');
        div.className = 'card circuit-card';
        
        let exercisesHtml = w.exercises.map(e => `
            <li>
                <strong>${e.name}</strong> 
                <span>${e.sets} sets x ${e.reps} reps @ ${e.weight}kg</span>
            </li>
        `).join('');

        div.innerHTML = `
            <div class="circuit-header">
                <div>
                    <h3>${w.name}</h3>
                    <small>${w.frequency}x per week</small>
                </div>
                <button onclick="openModal(${w.id})">+ Add Exercise</button>
            </div>
            <ul class="exercise-list">
                ${exercisesHtml.length ? exercisesHtml : '<li style="color:#777">No exercises yet.</li>'}
            </ul>
        `;
        container.appendChild(div);
    });
}

document.getElementById('workoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('w-name').value;
    const frequency = document.getElementById('w-freq').value;

    await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, frequency })
    });
    
    document.getElementById('workoutForm').reset();
    loadWorkouts();
});

// --- Exercise Modal Logic ---
const modal = document.getElementById('ex-modal');

function openModal(workoutId) {
    document.getElementById('ex-workout-id').value = workoutId;
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

document.getElementById('exerciseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const workout_id = document.getElementById('ex-workout-id').value;
    const name = document.getElementById('ex-name').value;
    const sets = document.getElementById('ex-sets').value;
    const reps = document.getElementById('ex-reps').value;
    const weight = document.getElementById('ex-weight').value;

    await fetch(`${API_URL}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workout_id, name, sets, reps, weight })
    });

    closeModal();
    document.getElementById('exerciseForm').reset();
    loadWorkouts();
});

// --- Stats Logic ---
async function loadStats() {
    const res = await fetch(`${API_URL}/stats`);
    const stats = await res.json();
    const tbody = document.getElementById('stats-body');
    tbody.innerHTML = '';

    stats.forEach(s => {
        const row = `<tr>
            <td>${s.date}</td>
            <td>${s.weight}</td>
            <td>${s.notes}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

document.getElementById('statsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const weight = document.getElementById('s-weight').value;
    const notes = document.getElementById('s-notes').value;

    await fetch(`${API_URL}/stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight, notes })
    });

    document.getElementById('statsForm').reset();
    loadStats();
});

// --- Init ---
loadWorkouts();
loadStats();