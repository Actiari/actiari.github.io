import os
import re

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


def extract_csv_paths():
    apr_path = os.path.join(ROOT_DIR, 'APR.html')
    with open(apr_path, encoding='utf-8') as f:
        content = f.read()
    match = re.search(r"const subjectsToProcess = \[(.*?)\];", content, re.S)
    assert match, "subjectsToProcess array not found"
    section = match.group(1)
    return re.findall(r"csvFile: '([^']+)'", section)


def test_csv_files_exist():
    csv_paths = extract_csv_paths()
    assert csv_paths, 'No CSV paths found'
    for rel_path in csv_paths:
        csv_full_path = os.path.join(ROOT_DIR, rel_path)
        assert os.path.exists(csv_full_path), f"Missing CSV file: {rel_path}"
