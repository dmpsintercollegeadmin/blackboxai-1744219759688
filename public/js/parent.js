document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch child information
    const childRes = await fetch('/api/parents/my-child', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const childData = await childRes.json();

    // Display child info
    const childInfoEl = document.getElementById('child-info');
    childInfoEl.innerHTML = `
      <div class="bg-blue-50 p-4 rounded-lg">
        <h4 class="font-medium text-blue-800">Basic Info</h4>
        <p class="mt-2">Name: ${childData.name}</p>
        <p>Grade: ${childData.currentClass?.name || 'N/A'}</p>
      </div>
      <div class="bg-blue-50 p-4 rounded-lg">
        <h4 class="font-medium text-blue-800">Contact</h4>
        <p class="mt-2">Email: ${childData.email}</p>
        <p>Phone: ${childData.phone || 'N/A'}</p>
      </div>
      <div class="bg-blue-50 p-4 rounded-lg">
        <h4 class="font-medium text-blue-800">Performance</h4>
        <p class="mt-2">Attendance: ${childData.attendanceRate || 'N/A'}%</p>
        <p>GPA: ${childData.gpa || 'N/A'}</p>
      </div>
    `;

    // Fetch attendance
    const attendanceRes = await fetch('/api/parents/attendance', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const attendanceData = await attendanceRes.json();

    // Display attendance
    const attendanceListEl = document.getElementById('attendance-list');
    attendanceData.forEach(record => {
      const row = document.createElement('tr');
      row.className = 'border-b';
      row.innerHTML = `
        <td class="p-3">${new Date(record.date).toLocaleDateString()}</td>
        <td class="p-3">${record.class?.name || 'N/A'}</td>
        <td class="p-3">
          <span class="px-2 py-1 rounded-full text-xs 
            ${record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
            ${record.status}
          </span>
        </td>
      `;
      attendanceListEl.appendChild(row);
    });

    // Fetch fees
    const feesRes = await fetch('/api/parents/fees', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const feesData = await feesRes.json();

    // Display fees
    const feeDetailsEl = document.getElementById('fee-details');
    feeDetailsEl.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-green-50 p-4 rounded-lg">
          <h4 class="font-medium text-green-800">Current Term</h4>
          <p class="mt-2 text-2xl font-bold">$${feesData.currentTerm?.amount || 0}</p>
          <p>Due: ${feesData.currentTerm?.dueDate ? new Date(feesData.currentTerm.dueDate).toLocaleDateString() : 'N/A'}</p>
          <p class="mt-2 ${feesData.currentTerm?.paid ? 'text-green-600' : 'text-red-600'}">
            ${feesData.currentTerm?.paid ? 'Paid' : 'Pending'}
          </p>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-medium text-blue-800">Annual Fees</h4>
          <p class="mt-2 text-2xl font-bold">$${feesData.annual?.amount || 0}</p>
          <p>Status: ${feesData.annual?.paid ? 'Paid' : 'Pending'}</p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <h4 class="font-medium text-purple-800">Other Charges</h4>
          <p class="mt-2 text-2xl font-bold">$${feesData.other?.amount || 0}</p>
          <p>Description: ${feesData.other?.description || 'N/A'}</p>
        </div>
      </div>
    `;

  } catch (error) {
    console.error('Error loading parent dashboard:', error);
    alert('Error loading data. Please try again.');
  }
});
