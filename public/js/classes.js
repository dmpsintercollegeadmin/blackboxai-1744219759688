document.addEventListener('DOMContentLoaded', () => {
  const classForm = document.getElementById('classForm');
  const classesTable = document.getElementById('classesTable').querySelector('tbody');

  // Load all classes
  async function loadClasses() {
    try {
      const response = await fetch('/api/classes');
      const classes = await response.json();
      renderClasses(classes);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  }

  // Format schedule for display
  function formatSchedule(schedule) {
    if (!schedule) return 'Not set';
    return `${schedule.days.join(', ')} ${schedule.time || ''}`.trim();
  }

  // Render classes to table
  function renderClasses(classes) {
    classesTable.innerHTML = '';
    classes.forEach(cls => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50';
      row.innerHTML = `
        <td class="py-2 px-4 border-b">${cls.className}</td>
        <td class="py-2 px-4 border-b">Grade ${cls.gradeLevel}</td>
        <td class="py-2 px-4 border-b">${cls.roomNumber || '-'}</td>
        <td class="py-2 px-4 border-b">${formatSchedule(cls.schedule)}</td>
        <td class="py-2 px-4 border-b">
          <button class="text-blue-500 hover:text-blue-700 mr-2 edit-btn" data-id="${cls._id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-red-500 hover:text-red-700 delete-btn" data-id="${cls._id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      classesTable.appendChild(row);
    });
  }

  // Add new class
  classForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(classForm);
    const classData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(classData)
      });
      const newClass = await response.json();
      classForm.reset();
      loadClasses();
    } catch (error) {
      console.error('Error adding class:', error);
    }
  });

  // Initial load
  loadClasses();
});
