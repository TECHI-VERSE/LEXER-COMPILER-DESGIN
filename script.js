// Debounce function to limit frequent calls
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

async function analyze() {
    const code = document.getElementById('codeInput').value;
    
    // Add loading states
    ['tokens', 'errors', 'stats'].forEach(id => {
        document.getElementById(id).classList.add('loading-shimmer');
    });

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            body: new FormData(document.getElementById('analyzeForm'))
        });
        const result = await response.json();

        // Tokens
        let tokenHtml = '<table class="w-full"><tr><th>Type</th><th>Value</th><th>Line</th></tr>';
        result.tokens.forEach(token => {
            tokenHtml += `<tr><td>${token.type}</td><td>${token.value}</td><td>${token.line}</td></tr>`;
        });
        tokenHtml += '</table>';
        document.getElementById('tokens').innerHTML = tokenHtml;

        // Errors
        if (result.errors.length > 0) {
            document.getElementById('errors').innerHTML = result.errors.join('<br>');
        } else {
            document.getElementById('errors').innerHTML = '<p class="text-green-300">No errors found!</p>';
        }

        // Stats
        let statsHtml = `<p>Total Tokens: ${result.stats.total_tokens}</p>`;
        statsHtml += '<ul>';
        let statsText = `Total Tokens: ${result.stats.total_tokens}\n`;
        for (let [category, count] of Object.entries(result.stats.by_category)) {
            statsHtml += `<li>${category}: ${count}</li>`;
            statsText += `${category}: ${count}\n`;
        }
        statsHtml += '</ul>';
        document.getElementById('stats').innerHTML = statsHtml;

        // Download Stats Link
        const downloadLink = document.getElementById('downloadStats');
        downloadLink.href = `/download-stats?stats=${encodeURIComponent(statsText)}`;

        // Syntax Highlighting (only if text input is used)
        if (!fileInput) {
            Prism.highlightElement(document.getElementById('codeInput'));
        }
    } finally {
        // Remove loading states
        ['tokens', 'errors', 'stats'].forEach(id => {
            document.getElementById(id).classList.remove('loading-shimmer');
        });
    }
}

// Debounced version of analyze
const debouncedAnalyze = debounce(analyze, 300);

async function loadSampleCode() {
    const response = await fetch('/sample-code');
    const data = await response.json();
    document.getElementById('codeInput').value = data.code;
    document.getElementById('fileInput').value = ''; // Clear file input
    debouncedAnalyze(); // Trigger analysis after loading sample
}

function clearAll() {
    document.getElementById('codeInput').value = '';
    document.getElementById('fileInput').value = '';
    document.getElementById('tokens').innerHTML = '';
    document.getElementById('errors').innerHTML = '';
    document.getElementById('stats').innerHTML = '';
    document.getElementById('downloadStats').href = '#';
}

// Attach debounced analyze to global scope for HTML events
window.analyze = debouncedAnalyze;