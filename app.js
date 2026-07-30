let expenses = JSON.parse(localStorage.getItem('exp')) || [];
let chart;

document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.sidebar a').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(el => el.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(this.getAttribute('data-target')).classList.add('active');
        if(this.getAttribute('data-target') === 'exp') makeChart();
    });
});

function makeChart() {
    let ctx = document.getElementById('chart')?.getContext('2d');
    if(!ctx) return;
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: expenses.map(e => e.desc),
            datasets: [{ data: expenses.map(e => e.amt), backgroundColor: ['#4f46e5','#10b981','#ef4444'] }]
        }
    });
}

document.getElementById('exp-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    expenses.push({ desc: document.getElementById('desc').value, amt: parseFloat(document.getElementById('amt').value) });
    localStorage.setItem('exp', JSON.stringify(expenses));
    document.getElementById('exp-form').reset();
    showExp();
});

function showExp() {
    let list = document.getElementById('exp-list');
    if(list) list.innerHTML = expenses.map(e => `<li>${e.desc}: $${e.amt}</li>`).join('');
    makeChart();
}

window.viewJSON = function() {
    try {
        document.getElementById('json-out').innerText = JSON.stringify(JSON.parse(document.getElementById('json-in').value), null, 4);
    } catch(err) { document.getElementById('json-out').innerText = "Invalid JSON"; }
};

window.testRx = function() {
    let match = new RegExp(document.getElementById('rx-pat').value).test(document.getElementById('rx-str').value);
    document.getElementById('rx-out').innerText = match ? "Match!" : "No Match.";
};

showExp();
