document.addEventListener('DOMContentLoaded', () => {
  const teacherForm = document.getElementById('teacherForm');
  const teachersTable = document.getElementById('teachersTable').querySelector('tbody');

  // Load all teachers
  async function loadTeachers() {
    try {
      const response = await fetch('/api/teachers');
      const teachers = await response.json();
      renderTeachers(teachers);
    } catch (error) {
      console.error('Error loading teachers:', error);
    }
  }

  // Render teachers to table
  function renderTeachers(teachers) {
    teachersTable.innerHTML = '';
    teachers.forEach(teacher => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50';
      row.innerHTML = `
        <td class="py-2 px-4 border-b">${teacher.firstName} ${teacher.lastName}</td>
        <td class="py-2 px-4 border-b">${teacher.email}</td>
        <td class="py-2 px-4 border-b">${teacher.qualification}</td>
        <td class="py-2 px-4 border-b">
          <button class="text-blue-500 hover:text-blue-700 mr-2 edit-btn" data-id="${teacher._id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-red-500 hover:text-red-700 delete-btn" data-id="${teacher._id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      teachersTable.appendChild(row);
    });
  }

  // Add new teacher
  teacherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(teacherForm);
    const teacherData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(teacherData)
      });
      const newTeacher = await response.json();
      teacherForm.reset();
      loadTeachers();
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  });

  // Initial load
  loadTeachers();
});
