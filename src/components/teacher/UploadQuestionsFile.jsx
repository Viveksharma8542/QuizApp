// src/components/teacher/UploadQuestionsFile.jsx
import { useState } from 'react';
import { Upload, FileText, Download, AlertCircle } from 'lucide-react';

const UploadQuestionsFile = ({ onAddQuestions }) => {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      if (fileExtension === 'csv' || fileExtension === 'json') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a CSV or JSON file');
        setFile(null);
      }
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const questions = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= 7) {
        questions.push({
          id: Date.now().toString() + i,
          question: values[0],
          options: [values[1], values[2], values[3], values[4]],
          correctAnswer: parseInt(values[5]),
          subject: values[6],
          difficulty: values[7] || 'medium'
        });
      }
    }
    return questions;
  };

  const parseJSON = (text) => {
    try {
      const data = JSON.parse(text);
      return data.map((q, index) => ({
        id: Date.now().toString() + index,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        subject: q.subject,
        difficulty: q.difficulty || 'medium'
      }));
    } catch (e) {
      throw new Error('Invalid JSON format');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setParsing(true);
    setError('');

    try {
      const text = await file.text();
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      let questions;
      if (fileExtension === 'csv') {
        questions = parseCSV(text);
      } else if (fileExtension === 'json') {
        questions = parseJSON(text);
      }

      if (questions.length === 0) {
        setError('No valid questions found in the file');
      } else {
        onAddQuestions(questions);
        setFile(null);
        // Reset file input
        document.getElementById('file-input').value = '';
      }
    } catch (err) {
      setError('Error parsing file: ' + err.message);
    } finally {
      setParsing(false);
    }
  };

  const downloadTemplate = (type) => {
    let content, filename, mimeType;

    if (type === 'csv') {
      content = 'Question,Option A,Option B,Option C,Option D,Correct Answer (0-3),Subject,Difficulty\n' +
        'What is 2+2?,2,3,4,5,2,Mathematics,easy\n' +
        'What is the capital of France?,London,Paris,Berlin,Madrid,1,Geography,medium';
      filename = 'question_template.csv';
      mimeType = 'text/csv';
    } else {
      content = JSON.stringify([
        {
          question: "What is 2+2?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 2,
          subject: "Mathematics",
          difficulty: "easy"
        },
        {
          question: "What is the capital of France?",
          options: ["London", "Paris", "Berlin", "Madrid"],
          correctAnswer: 1,
          subject: "Geography",
          difficulty: "medium"
        }
      ], null, 2);
      filename = 'question_template.json';
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
          <FileText size={18} className="mr-2" />
          File Format Instructions
        </h3>
        <p className="text-sm text-blue-700 mb-3">
          Upload a CSV or JSON file with the following format:
        </p>
        <div className="text-xs text-blue-600 space-y-1 ml-4">
          <p>• <strong>CSV:</strong> Question, Option A, Option B, Option C, Option D, Correct Answer (0-3), Subject, Difficulty</p>
          <p>• <strong>JSON:</strong> Array of objects with question, options (array), correctAnswer (0-3), subject, difficulty</p>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => downloadTemplate('csv')}
            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center"
          >
            <Download size={14} className="mr-1" />
            CSV Template
          </button>
          <button
            onClick={() => downloadTemplate('json')}
            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center"
          >
            <Download size={14} className="mr-1" />
            JSON Template
          </button>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600 mb-4">
          {file ? file.name : 'Choose a CSV or JSON file'}
        </p>
        <input
          id="file-input"
          type="file"
          accept=".csv,.json"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="file-input"
          className="inline-block px-6 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition"
        >
          Select File
        </label>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="text-red-500 mr-2 flex-shrink-0" size={20} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || parsing}
        className={`w-full mt-4 py-3 rounded-lg font-semibold transition ${
          file && !parsing
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {parsing ? 'Processing...' : 'Upload Questions'}
      </button>
    </div>
  );
};

export default UploadQuestionsFile;