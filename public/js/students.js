document.addEventListener('DOMContentLoaded', () => {
  const studentForm = document.getElementById('studentForm');
  const studentsTable = document.getElementById('studentsTable').querySelector('tbody');

  // Load all students
  async function loadStudents() {
    try {
      const response = await fetch('/api/students');
      const students = await response.json();
      renderStudents(students);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }

  // Render students to table
  function renderStudents(students) {
    studentsTable.innerHTML = '';
    students.forEach(student => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50';
      row.innerHTML = `
        <td class="py-2 px-4 border-b">${student.firstName} ${student.lastName}</td>
        <td class="py-2 px-4 border-b">${student.email}</td>
        <td class="py-2 px-4 border-b">${student.phone}</td>
        <td class="py-2 px-4 border-b">
          <button class="text-blue-500 hover:text-blue-700 mr-2 edit-btn" data-id="${student._id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-red-500 hover:text-red-700 delete-btn" data-id="${student._id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      studentsTable.appendChild(row);
    });
  }

  // Add new student
  studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(studentForm);
    const studentData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });
      const newStudent = await response.json();
      studentForm.reset();
      loadStudents();
    } catch (error) {
      console.error('Error adding student:', error);
    }
  });

  // Initial load
  loadStudents();
});
