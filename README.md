# Lexical Analyzer Web Application

A web-based Lexical Analyzer that allows users to analyze code by either pasting it directly or uploading a file. The analyzer provides detailed token information and syntax highlighting for better code understanding.

## Technologies Used

- **Backend**: Python with Flask framework
- **Frontend**: HTML, JavaScript, Tailwind CSS
- **Syntax Highlighting**: Prism.js

## Prerequisites

- Python 3.x
- pip (Python package installer)

## Installation

1. Clone the repository or download the source code

2. Navigate to the project directory

3. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # On Windows
   ```

4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. Make sure you're in the project directory and your virtual environment is activated

2. Start the Flask application:
   ```bash
   python lexer.py
   ```

3. Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

1. You can analyze code in two ways:
   - Paste your code directly into the text area
   - Upload a code file using the file upload button

2. The analysis results will be displayed automatically

3. You can download the analysis statistics using the "Download Stats" button

## Project Structure

- `lexer.py`: Main application file containing the lexical analyzer logic
- `templates/`: Contains HTML templates
  - `index.html`: Main page template
- `static/`: Static files (CSS, JavaScript)
  - `script.js`: Frontend functionality
  - `style.css`: Custom styles
- `uploads/`: Temporary storage for uploaded files

## Features

- Real-time code analysis
- File upload support
- Syntax highlighting
- Token identification and classification
- Statistics download capability
- Responsive design
