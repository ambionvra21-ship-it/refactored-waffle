let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budgetChart;
const form = document.getElementById('expense-form');
const list = document.getElementById('transaction-list');

function initChart() {
    const ctx = document.getElementById('budgetChart').getContext('2d');
    const currencyTotals = {};
    transactions.forEach(t => {
        currencyTotals[t.currency] = (currencyTotals[t.currency] || 0) + parseFloat(t.amount);
    });
    if (budgetChart) budgetChart.destroy();
    budgetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(currencyTotals),
            datasets: [{
                data: Object.values(currencyTotals),
                backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function updateUI() {
    if (!list) return;
    list.innerHTML = '';
    transactions.forEach((t, index) => {
        const li = document.createElement('li');
        li.className = 'data-item';
        li.innerHTML = `
            <span>${t.desc} <strong>(${t.currency})</strong></span>
            <span>${t.amount} ${t.currency} 
                <button class="delete-btn" onclick="deleteTransaction(${index})">Delete</button>
            </span>
        `;
        list.appendChild(li);
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    initChart();
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const desc = document.getElementById('exp-desc').value;
        const amount = document.getElementById('exp-amount').value;
        const currency = document.getElementById('exp-currency').value;
        transactions.push({ desc, amount, currency });
        form.reset();
        updateUI();
    });
}

window.deleteTransaction = function(index) {
    transactions.splice(index, 1);
    updateUI();
};

// Navigation Systems
document.querySelectorAll('.sidebar ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.sidebar ul li a').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(el => el.classList.remove('active'));
        
        this.classList.add('active');
        const targetId = this.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
    });
});

// Ambient Audio Controls
const audioTracks = {
    rain: new Audio('https://mixkit.co'),
    cafe: new Audio('https://mixkit.co'),
    fire: new Audio('https://mixkit.co')
};

// Setup audio nodes loop behavior
Object.values(audioTracks).forEach(track => { track.loop = true; });

window.changeVolume = function(trackKey, val) {
    const audio = audioTracks[trackKey];
    if (audio) {
        audio.volume = val;
        if (val > 0 && audio.paused) {
            audio.play().catch(e => console.log("User interaction required for autoplay"));
        } else if (val == 0) {
            audio.pause();
        }
    }
};

updateUI();
