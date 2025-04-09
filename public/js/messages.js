document.addEventListener('DOMContentLoaded', async () => {
  // DOM elements
  const messageListEl = document.getElementById('message-list');
  const messageViewEl = document.getElementById('message-view');
  const newMessageFormEl = document.getElementById('new-message-form');
  const newMessageBtn = document.getElementById('new-message-btn');
  const backBtn = document.getElementById('back-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const messageForm = document.getElementById('message-form');
  const recipientsSelect = document.getElementById('recipients');

  // Load messages
  async function loadMessages() {
    try {
      const res = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const messages = await res.json();

      messageListEl.innerHTML = '';
      messages.forEach(msg => {
        const messageEl = document.createElement('div');
        messageEl.className = `p-4 hover:bg-gray-50 cursor-pointer ${!msg.readBy.includes(localStorage.getItem('userId')) ? 'bg-blue-50' : ''}`;
        messageEl.innerHTML = `
          <div class="flex justify-between">
            <h4 class="font-medium">${msg.subject}</h4>
            <span class="text-sm text-gray-500">${new Date(msg.createdAt).toLocaleDateString()}</span>
          </div>
          <p class="text-gray-600 truncate">${msg.content.substring(0, 100)}...</p>
          <div class="flex items-center mt-2 text-sm text-gray-500">
            <span>From: ${msg.sender.name}</span>
            ${msg.attachments.length > 0 ? 
              `<span class="ml-2"><i class="fas fa-paperclip"></i> ${msg.attachments.length}</span>` : ''}
          </div>
        `;
        messageEl.addEventListener('click', () => viewMessage(msg._id));
        messageListEl.appendChild(messageEl);
      });
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  // View a single message
  async function viewMessage(messageId) {
    try {
      const res = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const message = await res.json();

      // Display message
      document.getElementById('message-subject').textContent = message.subject;
      document.getElementById('message-sender').innerHTML = `
        From: <span class="font-medium">${message.sender.name}</span>
      `;
      document.getElementById('message-date').textContent = new Date(message.createdAt).toLocaleString();
      document.getElementById('message-content').textContent = message.content;

      // Display attachments
      const attachmentsEl = document.getElementById('message-attachments');
      attachmentsEl.innerHTML = '';
      if (message.attachments.length > 0) {
        const attachmentsTitle = document.createElement('h4');
        attachmentsTitle.className = 'font-medium mb-2';
        attachmentsTitle.textContent = 'Attachments:';
        attachmentsEl.appendChild(attachmentsTitle);

        message.attachments.forEach(attachment => {
          const attachmentEl = document.createElement('div');
          attachmentEl.className = 'flex items-center p-2 border rounded-lg mb-2';
          attachmentEl.innerHTML = `
            <i class="fas fa-paperclip mr-2 text-gray-500"></i>
            <span class="flex-1">${attachment.filename}</span>
            <a href="/${attachment.path}" download class="text-indigo-600 hover:text-indigo-800">
              <i class="fas fa-download"></i>
            </a>
          `;
          attachmentsEl.appendChild(attachmentEl);
        });
      }

      // Show message view and hide list
      messageListEl.parentElement.classList.add('hidden');
      messageViewEl.classList.remove('hidden');
    } catch (error) {
      console.error('Error viewing message:', error);
    }
  }

  // Load recipients for new message
  async function loadRecipients() {
    try {
      const res = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const users = await res.json();

      recipientsSelect.innerHTML = '';
      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user._id;
        option.textContent = `${user.name} (${user.role})`;
        recipientsSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error loading recipients:', error);
    }
  }

  // Event listeners
  newMessageBtn.addEventListener('click', async () => {
    await loadRecipients();
    messageListEl.parentElement.classList.add('hidden');
    messageViewEl.classList.add('hidden');
    newMessageFormEl.classList.remove('hidden');
  });

  backBtn.addEventListener('click', () => {
    messageListEl.parentElement.classList.remove('hidden');
    messageViewEl.classList.add('hidden');
    newMessageFormEl.classList.add('hidden');
  });

  cancelBtn.addEventListener('click', () => {
    messageListEl.parentElement.classList.remove('hidden');
    newMessageFormEl.classList.add('hidden');
    messageForm.reset();
  });

  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('recipients', JSON.stringify(
      Array.from(recipientsSelect.selectedOptions).map(opt => ({
        recipientId: opt.value,
        recipientModel: opt.text.includes('teacher') ? 'Teacher' : 'Parent'
      }))
    ));
    formData.append('subject', document.getElementById('subject').value);
    formData.append('content', document.getElementById('content').value);
    formData.append('isBroadcast', false);

    const files = document.getElementById('attachments').files;
    for (let i = 0; i < files.length; i++) {
      formData.append('attachments', files[i]);
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (res.ok) {
        messageForm.reset();
        newMessageFormEl.classList.add('hidden');
        messageListEl.parentElement.classList.remove('hidden');
        await loadMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Initial load
  await loadMessages();
});
