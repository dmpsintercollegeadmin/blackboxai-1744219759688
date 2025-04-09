document.addEventListener('DOMContentLoaded', async () => {
  // Initialize charts
  const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
  const classCtx = document.getElementById('classChart').getContext('2d');

  // Load dashboard data
  async function loadDashboardData() {
    try {
      const [statsRes, attendanceRes, classesRes, activityRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('/api/admin/attendance-trend', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('/api/admin/class-distribution', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('/api/admin/recent-activity', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      const stats = await statsRes.json();
      const attendanceTrend = await attendanceRes.json();
      const classDistribution = await classesRes.json();
      const recentActivity = await activityRes.json();

      // Update stats cards
      document.getElementById('total-students').textContent = stats.totalStudents;
      document.getElementById('total-teachers').textContent = stats.totalTeachers;
      document.getElementById('today-attendance').textContent = `${stats.todayAttendance}%`;
      document.getElementById('active-classes').textContent = stats.activeClasses;

      // Create attendance trend chart
      new Chart(attendanceCtx, {
        type: 'line',
        data: {
          labels: attendanceTrend.labels,
          datasets: [{
            label: 'Attendance Rate (%)',
            data: attendanceTrend.data,
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.1,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });

      // Create class distribution chart
      new Chart(classCtx, {
        type: 'doughnut',
        data: {
          labels: classDistribution.labels,
          datasets: [{
            data: classDistribution.data,
            backgroundColor: [
              'rgba(79, 70, 229, 0.7)',
              'rgba(99, 102, 241, 0.7)',
              'rgba(129, 140, 248, 0.7)',
              'rgba(165, 180, 252, 0.7)'
            ],
            borderColor: [
              'rgba(79, 70, 229, 1)',
              'rgba(99, 102, 241, 1)',
              'rgba(129, 140, 248, 1)',
              'rgba(165, 180, 252, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            }
          }
        }
      });

      // Display recent activity
      const activityEl = document.getElementById('recent-activity');
      activityEl.innerHTML = '';
      recentActivity.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'flex items-start';
        activityItem.innerHTML = `
          <div class="flex-shrink-0 mt-1">
            <div class="bg-indigo-100 p-2 rounded-full">
              <i class="fas ${getActivityIcon(activity.type)} text-indigo-600"></i>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">${activity.description}</p>
            <p class="text-sm text-gray-500">${new Date(activity.timestamp).toLocaleString()}</p>
          </div>
        `;
        activityEl.appendChild(activityItem);
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  // Helper function to get icon for activity type
  function getActivityIcon(type) {
    const icons = {
      'login': 'fa-sign-in-alt',
      'attendance': 'fa-calendar-check',
      'message': 'fa-envelope',
      'registration': 'fa-user-plus',
      'update': 'fa-edit'
    };
    return icons[type] || 'fa-info-circle';
  }

  // Initial load
  await loadDashboardData();
});
