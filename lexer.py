from flask import Flask, request, jsonify, render_template, send_file
import re
import os
from io import StringIO

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def tokenize(code):
    tokens = []
    errors = []
    line_num = 1
    
    patterns = {
        'KEYWORD': r'\b(if|else|while|for|return)\b',
        'IDENTIFIER': r'\b[a-zA-Z_][a-zA-Z0-9_]*\b',
        'OPERATOR': r'[+\-*/=<>!]',
        'NUMBER': r'\b\d+\b',
        'SYMBOL': r'[(){};,]',
        'WHITESPACE': r'\s+'
    }
    
    for line in code.split('\n'):
        remaining = line.strip()
        while remaining:
            matched = False
            for category, pattern in patterns.items():
                match = re.match(pattern, remaining)
                if match:
                    if category != 'WHITESPACE':
                        tokens.append({'type': category, 'value': match.group(), 'line': line_num})
                    remaining = remaining[match.end():].strip()
                    matched = True
                    break
            if not matched:
                errors.append(f"Error at line {line_num}: Invalid token '{remaining[0]}'")
                remaining = remaining[1:].strip()
        line_num += 1
    
    stats = {
        'total_tokens': len(tokens),
        'by_category': {}
    }
    for token in tokens:
        stats['by_category'][token['type']] = stats['by_category'].get(token['type'], 0) + 1
    
    return {'tokens': tokens, 'errors': errors, 'stats': stats}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' in request.files and request.files['file'].filename != '':
        file = request.files['file']
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        with open(filepath, 'r') as f:
            code = f.read()
        os.remove(filepath)
    else:
        data = request.form
        code = data.get('code', '')
    
    result = tokenize(code)
    return jsonify(result)

@app.route('/sample-code')
def sample_code():
    sample = "for (i = 0; i < 10; i++) { print(i); } #@"
    return jsonify({'code': sample})

@app.route('/download-stats')
def download_stats():
    stats = request.args.get('stats', '')
    buffer = StringIO()
    buffer.write(stats)
    buffer.seek(0)
    return send_file(
        StringIO(buffer.getvalue()),
        mimetype='text/plain',
        as_attachment=True,
        download_name='token_stats.txt'
    )

if __name__ == '__main__':
    app.run(debug=True)