// src/components/teacher/AssignQuiz.jsx
import { useState, useEffect } from 'react';
import { X, Search, CheckCircle, Users } from 'lucide-react';

const AssignQuiz = ({ quiz, onClose, onAssign }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Load already assigned students
    if (quiz && quiz.assignedStudents) {
      setSelectedStudents(quiz.assignedStudents);
    }
  }, [quiz]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, students]);

  const fetchStudents = () => {
    // Get all registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Get default mock students
    const defaultStudents = [
      { id: '3', name: 'Alice Johnson', email: 'alice@example.com', rollNo: 'S001', department: 'Science' },
      { id: '4', name: 'Bob Wilson', email: 'bob@example.com', rollNo: 'S002', department: 'Arts' },
      { id: '6', name: 'Diana Prince', email: 'diana@example.com', rollNo: 'S003', department: 'Science' }
    ];
    
    // Filter only students from registered users
    const registeredStudents = registeredUsers.filter(user => user.role === 'student');
    
    // Combine default and registered students
    const allStudents = [...defaultStudents, ...registeredStudents];
    
    setStudents(allStudents);
    setFilteredStudents(allStudents);
  };

  const applyFilters = () => {
    let filtered = [...students];

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredStudents(filtered);
  };

  const toggleStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const toggleAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const handleAssign = () => {
    onAssign(selectedStudents);
    onClose();
  };

  if (!quiz) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Users className="mr-3 text-blue-500" size={24} />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Assign Students</h2>
              <p className="text-sm text-gray-600">{quiz.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search and Select All */}
        <div className="p-6 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search students by name, email, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={toggleAll}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <input
                type="checkbox"
                checked={selectedStudents.length === students.length && students.length > 0}
                onChange={toggleAll}
                className="mr-2"
              />
              Select All Students ({students.length})
            </button>
            <span className="text-sm text-gray-600">
              {selectedStudents.length} selected
            </span>
          </div>
        </div>

        {/* Students List */}
        <div className="p-6 overflow-y-auto max-h-96">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No students found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student) => {
                const isSelected = selectedStudents.includes(student.id);
                return (
                  <div
                    key={student.id}
                    onClick={() => toggleStudent(student.id)}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800">{student.name}</p>
                          {student.rollNo && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                              {student.rollNo}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        {student.department && (
                          <p className="text-xs text-gray-500">{student.department}</p>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="text-blue-500 flex-shrink-0 ml-2" size={20} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{selectedStudents.length}</span> student(s) selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={selectedStudents.length === 0}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                selectedStudents.length > 0
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit & Assign to {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignQuiz;