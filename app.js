let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budgetChart;
const form = document.getElementById('expense-form');
const list = document.getElementById('transaction-list');

// Chart initialization logic
function initChart() {
    const canvas = document.getElementById('budgetChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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
    if (list) {
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
    }
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

// Client-Side Native Excel Document Exporter (SheetJS)
window.exportToExcel = function() {
    if(transactions.length === 0) return alert("No transactions available to map export sheets.");
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger Entries");
    XLSX.writeFile(workbook, "Workspace_Expense_Ledger.xlsx");
};

// Global Workspace App Routing Engine Switches
document.querySelectorAll('.sidebar ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.sidebar ul li a').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(el => el.classList.remove('active'));
        
        this.classList.add('active');
        const targetId = this.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
        if (targetId === 'expense-tracker') setTimeout(initChart, 50);
    });
});

// Clipboard Manager Logic Blocks
let snippets = JSON.parse(localStorage.getItem('snippets')) || [];
const snippetForm = document.getElementById('snippet-form');
const snippetList = document.getElementById('snippet-list');

function renderSnippets() {
    if(!snippetList) return;
    snippetList.innerHTML = '';
    snippets.forEach((s, idx) => {
        const div = document.createElement('div');
        div.className = 'card snippet-card-item';
        div.style.marginBottom = "15px";
        div.innerHTML = `
            <h4>${s.title}</h4>
            <pre style="background:#f8fafc; padding:10px; border-radius:6px; margin:8px 0; font-family:monospace; white-space:pre-wrap;">${s.text}</pre>
            <button class="btn-primary" onclick="copySnippet(${idx})" style="width:auto; padding:6px 12px; margin-right:5px;">Copy</button>
            <button class="delete-btn" onclick="deleteSnippet(${idx})">Delete</button>
        `;
        snippetList.appendChild(div);
    });
    localStorage.setItem('snippets', JSON.stringify(snippets));
}

if(snippetForm) {
    snippetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('snip-title').value;
        const text = document.getElementById('snip-text').value;
        snippets.push({ title, text });
        snippetForm.reset();
        renderSnippets();
    });
}
window.copySnippet = function(idx) { navigator.clipboard.writeText(snippets[idx].text); alert("Snippet Copied!"); };
window.deleteSnippet = function(idx) { snippets.splice(idx, 1); renderSnippets(); };

// Ambient Sound Controls
const audioTracks = {
    rain: new Audio('https://mixkit.co'),
    cafe: new Audio('https://mixkit.co'),
    fire: new Audio('https://mixkit.co')
};
Object.values(audioTracks).forEach(track => { track.loop = true; });
window.changeVolume = function(trackKey, val) {
    const audio = audioTracks[trackKey];
    if (audio) {
        audio.volume = val;
        if (val > 0 && audio.paused) audio.play().catch(() => {});
        else if (val == 0) audio.pause();
    }
};

// Smart Offline Template Email Drafter Logic
window.generateEmailDraft = function() {
    const tone = document.getElementById('email-tone').value;
    const prompt = document.getElementById('email-prompt').value;
    const outputBox = document.getElementById('email-output');
    
    let draft = "";
    if(tone === "professional") {
        draft = `Subject: Professional Correspondence Request Regarding: ${prompt}\n\nDear Team,\n\nI am writing to formally communicate our tracking updates regarding ${prompt}.\n\nPlease review the attached items and let me know your thoughts.\n\nBest Regards,\nWorkspace Professional User`;
    } else if(tone === "casual") {
        draft = `Subject: Hey! Quick update on ${prompt}\n\nHi everyone,\n\nJust wanted to check in and drop a quick note about ${prompt}.\n\nLet me know what you think when you have a free second!\n\nCheers,\nUser`;
    } else {
        draft = `Subject: URGENT: Action Required - ${prompt}\n\nHello,\n\nThis is an urgent follow-up notification regarding ${prompt}.\n\nWe require an immediate response or confirmation to advance past this step.\n\nThank you,\nManagement Operations`;
    }
    outputBox.value = draft;
};
window.copyEmailToClipboard = function() {
    const txt = document.getElementById('email-output').value;
    if(!txt) return alert("Nothing drafted to copy yet.");
    navigator.clipboard.writeText(txt);
    alert("Draft text successfully locked onto target clip stack structural buffers!");
};

// Invoice Component Rendering Engines & PDF Formatter Exporters
let activeInv = null;
window.previewInvoice = function() {
    const client = document.getElementById('inv-client').value || "Valued Client";
    const service = document.getElementById('inv-service').value || "General Consultation Services";
    const cost = document.getElementById('inv-cost').value || "0.00";
    const symbol = document.getElementById('inv-currency').value;
    
    activeInv = { client, service, cost, symbol };
    document.getElementById('invoice-preview-box').innerHTML = `
        <div style="font-family:monospace; line-height:1.4;">
            <h4 style="border-bottom:2px solid #333; padding-bottom:5px;">OFFICIAL STATEMENT OF ACCOUNT</h4>
            <p><strong>Billed To:</strong> ${client}</p>
            <p><strong>Description:</strong> ${service}</p>
            <p style="font-size:16px; margin-top:10px;"><strong>Total Amount Owed:</strong> <span style="color:#4f46e5;">${symbol}${parseFloat(cost).toFixed(2)}</span></p>
        </div>
    `;
};

window.exportInvoicePDF = function() {
    if(!activeInv) return alert("Please generate an invoice preview container first.");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("courier", "bold");
    doc.text("OFFICIAL STATEMENT OF ACCOUNT", 20, 20);
    doc.setFont("courier", "normal");
    doc.text(`Client Target Entity: ${activeInv.client}`, 20, 40);
    doc.text(`Service Manifested:   ${activeInv.service}`, 20, 50);
    doc.text(`Balance Due Total:    ${activeInv.symbol}${activeInv.cost}`, 20, 70);
    doc.save(`Invoice_${activeInv.client.replace(/\s+/g, '_')}.pdf`);
};

window.exportInvoiceWord = function() {
    if(!activeInv) return alert("Please generate an invoice preview container first.");
    const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://w3.org'>
        <head><title>Invoice</title><style>body{font-family:Arial;}</style></head>
        <body>
            <h2>INVOICE STATEMENT</h2>
            <p><b>Client:</b> ${activeInv.client}</p>
            <p><b>Service:</b> ${activeInv.service}</p>
            <h3>Total: ${activeInv.symbol}${activeInv.cost}</h3>
        </body>
        </html>
    `;
    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${activeInv.client.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

// Run core startup hooks
updateUI();
renderSnippets();
