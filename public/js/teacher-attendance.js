document.addEventListener('DOMContentLoaded', async () => {
  // DOM elements
  const markPresentBtn = document.getElementById('mark-present');
  const attendanceStatusEl = document.getElementById('attendance-status');
  const classSelectEl = document.getElementById('class-select');
  const attendanceDateEl = document.getElementById('attendance-date');
  const studentListEl = document.getElementById('student-attendance-list');
  const saveAttendanceBtn = document.getElementById('save-attendance');

  // Set today's date as default
  attendanceDateEl.valueAsDate = new Date();

  // Check teacher's current attendance status
  async function checkTeacherAttendance() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/attendance?date=${today}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const attendance = await res.json();

      if (attendance.length > 0) {
        attendanceStatusEl.innerHTML = `
          <span class="text-green-600">
            <i class="fas fa-check-circle mr-1"></i> Marked present today
          </span>
        `;
        markPresentBtn.disabled = true;
        markPresentBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
        markPresentBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
      }
    } catch (error) {
      console.error('Error checking attendance:', error);
    }
  }

  // Load teacher's classes
  async function loadClasses() {
    try {
      const res = await fetch('/api/classes/my-classes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const classes = await res.json();

      classSelectEl.innerHTML = '';
      classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls._id;
        option.textContent = cls.name;
        classSelectEl.appendChild(option);
      });

      if (classes.length > 0) {
        loadClassStudents(classes[0]._id);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  }

  // Load students for selected class
  async function loadClassStudents(classId) {
    try {
      const res = await fetch(`/api/classes/${classId}/students`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const students = await res.json();

      studentListEl.innerHTML = '';
      students.forEach(student => {
        const row = document.createElement('tr');
        row.className = 'border-b';
        row.innerHTML = `
          <td class="p-3">${student.name}</td>
          <td class="p-3">
            <select class="attendance-status border rounded p-1" data-student="${student._id}">
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="excused">Excused</option>
            </select>
          </td>
          <td class="p-3">
            <input type="text" class="attendance-notes border rounded p-1 w-full" 
                   data-student="${student._id}" placeholder="Notes">
          </td>
        `;
        studentListEl.appendChild(row);
      });
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }

  // Mark teacher as present
  markPresentBtn.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/attendance/teachers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'present'
        })
      });

      if (res.ok) {
        attendanceStatusEl.innerHTML = `
          <span class="text-green-600">
            <i class="fas fa-check-circle mr-1"></i> Marked present today
          </span>
        `;
        markPresentBtn.disabled = true;
        markPresentBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
        markPresentBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  });

  // Handle class selection change
  classSelectEl.addEventListener('change', (e) => {
    loadClassStudents(e.target.value);
  });

  // Save student attendance
  saveAttendanceBtn.addEventListener('click', async () => {
    try {
      const attendanceRecords = [];
      const statusSelects = document.querySelectorAll('.attendance-status');
      const noteInputs = document.querySelectorAll('.attendance-notes');

      statusSelects.forEach((select, index) => {
        attendanceRecords.push({
          student: select.dataset.student,
          class: classSelectEl.value,
          date: attendanceDateEl.value,
          status: select.value,
          notes: noteInputs[index].value
        });
      });

      const res = await fetch('/api/attendance/students', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendanceRecords)
      });

      if (res.ok) {
        alert('Attendance saved successfully!');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error saving attendance');
    }
  });

  // Initial load
  checkTeacherAttendance();
  loadClasses();
});
