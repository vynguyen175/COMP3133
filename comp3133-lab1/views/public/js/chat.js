const socket = io();

const rooms = [
  { name: 'devops', title: 'DevOps', subtitle: 'The architecture of flow', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHl1xnCU_gANFxoy7uTN6M1aT_kGHBU6YCHdP7y_LP-Zm_FBPbKhSHcCaL3Qcnfg4HBC5qPYWtqAWY7L0qhBK7SqN9EsXl5WnkT3Xu1si6fD2Dp9GYRUfNh7xXdcqMxaV4zETvkLDYyAeMCLjbrIZGa9cOu0ax7q0tZjv84UwGkIUQouZanYKgr8-9UBizbvYyBwbRlGZJXH1JdOI3EBl5neX9Q4mGtSwWaxHSThbc94AfMWoXtPC0gpq2CXgYZqKKPyD4djbBPR1c' },
  { name: 'cloud computing', title: 'Cloud Computing', subtitle: 'Distributed Intelligence', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKPwlrHvSsr3aIgKUVignniMW6OyTPInNwHc24JS0M1WuWxf5_ox0LZxPcyEDmuf8BS3z4asjAaxw-twYWOCyMF6EV_npsMZJg5KOtUPTw-Fp8lzlSeoS1rsEGGAh1Zi1GIyBkMJgG_cPgs4-bZmuhTJV6jO-mSn58avpaGSFaLUhOf6Mt40Ztv6pxi1skFhc-r4-90DMOjjS_75ajb3dNTNCNjbIm1frnquhIYP2Xk4gh-_QxCjGAjmoBBgrBE8fy3Lmc4XTMjjt0' },
  { name: 'covid19', title: 'Global Health', subtitle: 'Latest updates & research', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPXlSgx0EIqFWJlv6ULP4NKRWtfBCa_t3CA0ouwiuB4T9NvaIAvtMuunqz1tEBhkLXD5Sa9hCj32-sjhe8Icq2wx6HjpJINZUz-SeNlK1qQV6EPoB3dheeiCQci7bgO0kjJlZ_E9Zt5nMbVRFcsJ7K_eI6hf1cEWGcsXO2sXTrJXjI6nY3-y5BWM0iD6TRsiPLuXpagi2RGRyb7qSiPwh8p1IR6piGHH8-8c3XnVOZF3vhgxerU01jcMAluHvs6ldRBkvF5k9vPdpk' },
  { name: 'sports', title: 'Elite Sports', subtitle: 'The pursuit of excellence', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWd2PMhpxjQX0moa-7VF6PYTFhYSFRbulUprfr1C1b-BQEISkLLlbnQNxaDDyZfaL53QAd-6OOEZK9P7sPMMqR5SBM4Qgzd8xOutBArNGxqsam1861Nd489lzGVKLTGzgCVBZYYfRBvhALRvhu7xRiYYFrbqA2jA3cdiomWAl-_Xv_-BVo_jcAZCEiAZ7nzR9YchDWn_TEP1Kzi5rXPUP-NngYZqnL9hIZA4KljXzBwn5CMUcjBVZ58ugxK_oILAXkKi1bADs0hCRx' },
  { name: 'nodeJS', title: 'NodeJS', subtitle: 'Asynchronous masterclass', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH86SQYbtp8lZx76fno4Pa_M0dbcQD8mOm4ZwRDo5bJjguvGF9Vi-rEF5FenSPAWeeXQ2EDWxHY-FUm3VTtuukUaazzPYlcxBMDmSindGlROI9rg5iORCMgkE8F4551J_Fe-4HJ9wYR26aq4nRTxqRO4yh_4WVWX-_NKwhFIJm4E4L_XBC6T2wE0Uj5eBxweekqRCBC47HoAmujBcWyvHpfxL4ggmj2gdwyTZ8fiJmS5IQCbEak_AX37jWDRRJD9_jAN1QpMcfFrjQ' }
];
let currentRoom = null;
let currentUser = null;
let currentPrivateUser = null;
let typingTimeout = null;

// Check if user is logged in
window.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = '/login.html';
    return;
  }

  currentUser = username;
  document.getElementById('currentUser').textContent = `Ready to chat`;

  // Register user with server so they appear in online users list
  socket.emit('register_user', { username });

  initializeUI();
  socket.emit('get_online_users');

  // Add event listener for leave room button
  document.getElementById('leaveRoomBtn').addEventListener('click', leaveRoom);
});

function initializeUI() {
  // Populate room list with cozy cards
  const roomList = document.getElementById('roomList');
  roomList.innerHTML = '';

  rooms.forEach((roomData) => {
    const roomCard = document.createElement('div');
    const isSelected = currentRoom === roomData.name;
    roomCard.className = `room-card rounded-3xl p-4 transition-all ${
      isSelected
        ? 'bg-rose-300 border-2 border-mocha-700 shadow-lg'
        : 'bg-white/50 backdrop-blur-sm border border-rose-200 hover:shadow-lg hover:bg-white cursor-pointer'
    }`;

    const emoji = roomData.name === 'devops' ? '⚙️' : roomData.name === 'cloud computing' ? '☁️' : roomData.name === 'covid19' ? '🏥' : roomData.name === 'sports' ? '⚽' : '💻';

    roomCard.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-12 h-12 rounded-2xl ${isSelected ? 'bg-mocha-700' : 'bg-rose-200'} flex items-center justify-center flex-shrink-0 text-xl">
          ${emoji}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-bold text-mocha-700">${roomData.title}</h3>
          <p class="text-[12px] ${isSelected ? 'text-mocha-600' : 'text-mocha-500'} mt-1">${roomData.subtitle}</p>
          <div class="mt-3 flex gap-2">
            ${isSelected
              ? '<span class="px-3 py-1 bg-mocha-700 text-white text-xs font-semibold rounded-lg">✓ Joined</span>'
              : `<button class="px-3 py-1 bg-mocha-700 text-white text-xs font-semibold rounded-lg hover:bg-mocha-600 transition-colors">Join Room</button>`
            }
          </div>
        </div>
      </div>
    `;

    if (!isSelected) {
      const joinBtn = roomCard.querySelector('button');
      joinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        joinRoom(roomData.name);
      });
    }

    roomList.appendChild(roomCard);
  });
}

function joinRoom(room) {
  // If already in a room, leave it first
  if (currentRoom) {
    socket.emit('leave_room', { room: currentRoom, username: currentUser });
  }

  currentRoom = room;
  const roomTitle = rooms.find(r => r.name === room)?.title || room;
  document.getElementById('currentRoom').textContent = roomTitle;
  document.getElementById('currentUser').textContent = `Joined as ${currentUser}`;
  document.getElementById('messagesList').innerHTML = '';

  // Show leave room button
  document.getElementById('leaveRoomBtn').classList.remove('hidden');

  // Refresh room list to show selected room
  initializeUI();

  // Load previous messages
  loadRoomMessages(room);

  // Join the room via Socket.io
  socket.emit('join_room', { username: currentUser, room });
  console.log(`Joined room: ${room}`);
}

function leaveRoom() {
  // If in private chat, just go back
  if (currentPrivateUser) {
    currentPrivateUser = null;
    document.getElementById('currentRoom').textContent = 'Select a Room';
    document.getElementById('currentUser').textContent = 'Ready to chat';
    document.getElementById('messagesList').innerHTML = '';
    document.getElementById('noMessages').classList.remove('hidden');
    const leaveBtn = document.getElementById('leaveRoomBtn');
    leaveBtn.classList.add('hidden');
    leaveBtn.innerHTML = '<span class="material-symbols-outlined text-xl">logout</span><span>Leave Room</span>';
    return;
  }

  // If in a room, leave it
  if (!currentRoom) return;

  const room = currentRoom;
  socket.emit('leave_room', { room: currentRoom, username: currentUser });

  // Reset UI
  currentRoom = null;
  document.getElementById('currentRoom').textContent = 'Select a Room';
  document.getElementById('currentUser').textContent = 'Ready to chat';
  document.getElementById('messagesList').innerHTML = '';
  document.getElementById('noMessages').classList.remove('hidden');
  document.getElementById('leaveRoomBtn').classList.add('hidden');

  // Refresh room list
  initializeUI();

  console.log(`Left room: ${room}`);
}

async function loadRoomMessages(room) {
  try {
    const response = await fetch(`/api/messages/room/${room}`);
    const messages = await response.json();

    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';

    if (messages.length === 0) {
      document.getElementById('noMessages').classList.remove('hidden');
    } else {
      document.getElementById('noMessages').classList.add('hidden');
      messages.forEach((msg) => {
        displayMessage(msg.from_user, msg.message, msg.date_sent);
      });
    }
  } catch (err) {
    console.error('Error loading messages:', err);
  }
}

function displayMessage(sender, message, timestamp) {
  const messagesList = document.getElementById('messagesList');
  const messageDiv = document.createElement('div');
  messageDiv.className = sender === currentUser ? 'flex flex-col items-end gap-1 ml-auto max-w-[90%]' : 'flex items-end gap-3 max-w-[90%]';

  if (sender !== currentUser) {
    const avatar = document.createElement('div');
    avatar.className = 'w-9 h-9 rounded-2xl bg-rose-300 flex-shrink-0 overflow-hidden shadow-sm';
    avatar.style.transform = 'rotate(-4deg)';
    avatar.innerHTML = `<div class="w-full h-full bg-rose-400 flex items-center justify-center text-white font-bold">${sender.charAt(0).toUpperCase()}</div>`;
    messageDiv.appendChild(avatar);
  }

  const bubbleContainer = document.createElement('div');
  bubbleContainer.className = sender === currentUser ? '' : 'space-y-1 flex-1';

  if (sender !== currentUser) {
    const senderName = document.createElement('span');
    senderName.className = 'text-[11px] font-bold text-mocha-500 ml-2';
    senderName.textContent = sender;
    bubbleContainer.appendChild(senderName);
  }

  const bubble = document.createElement('div');
  bubble.className = sender === currentUser
    ? 'cozy-bubble-right bg-rose-400 text-white p-4 shadow-rose-200/50'
    : 'cozy-bubble-left bg-white text-mocha-700 p-4 border border-rose-100/50';

  const messageText = document.createElement('p');
  messageText.textContent = message;
  messageText.className = 'text-[15px] leading-relaxed font-medium';
  bubble.appendChild(messageText);

  bubbleContainer.appendChild(bubble);

  if (sender !== currentUser) {
    const timeSpan = document.createElement('span');
    timeSpan.className = 'text-[10px] text-mocha-500/40 ml-2';
    timeSpan.textContent = new Date(timestamp).toLocaleTimeString();
    bubbleContainer.appendChild(timeSpan);
  } else {
    const bottomGroup = document.createElement('div');
    bottomGroup.className = 'flex items-center gap-1.5 mr-2';

    const timeSpan = document.createElement('span');
    timeSpan.className = 'text-[10px] text-mocha-500/40';
    timeSpan.textContent = new Date(timestamp).toLocaleTimeString();
    bottomGroup.appendChild(timeSpan);

    const checkIcon = document.createElement('span');
    checkIcon.className = 'material-symbols-outlined text-[14px] text-rose-400';
    checkIcon.textContent = 'check_circle';
    bottomGroup.appendChild(checkIcon);

    messageDiv.appendChild(bottomGroup);
  }

  messageDiv.appendChild(bubbleContainer);
  messagesList.appendChild(messageDiv);

  // Remove no messages indicator
  const noMessages = document.getElementById('noMessages');
  if (noMessages) {
    noMessages.classList.add('hidden');
  }

  // Scroll to bottom
  document.getElementById('messagesContainer').scrollTop =
    document.getElementById('messagesContainer').scrollHeight;
}

// Send message
document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  // Check if sending private message or group message
  if (currentPrivateUser) {
    // Send private message
    socket.emit('send_private_message', {
      from_user: currentUser,
      to_user: currentPrivateUser,
      message,
    });
  } else if (currentRoom) {
    // Send group message
    socket.emit('send_group_message', {
      message,
      room: currentRoom,
      username: currentUser,
    });
  } else {
    alert('Please select a room or user to message');
    return;
  }

  messageInput.value = '';

  // Stop typing indicator
  if (currentRoom) {
    socket.emit('stop_typing', { room: currentRoom });
  }
}

// Handle typing indicator
document.getElementById('messageInput').addEventListener('input', () => {
  // Only show typing indicator in rooms, not private chats
  if (currentRoom) {
    socket.emit('typing', { username: currentUser, room: currentRoom });

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to stop typing
    typingTimeout = setTimeout(() => {
      socket.emit('stop_typing', { room: currentRoom });
    }, 2000);
  }
});

// Socket.io event listeners
socket.on('user_joined', (data) => {
  console.log(data.message);
});

socket.on('user_left', (data) => {
  console.log(data.message);
});

socket.on('receive_group_message', (data) => {
  displayMessage(data.from_user, data.message, data.date_sent);
});

socket.on('receive_private_message', (data) => {
  // Only display if we're viewing the relevant private chat
  const isRelevant =
    (data.from_user === currentPrivateUser && data.to_user === currentUser) ||
    (data.from_user === currentUser && data.to_user === currentPrivateUser);

  if (isRelevant) {
    displayMessage(data.from_user, data.message, data.date_sent);
  }
});

socket.on('user_typing', (data) => {
  const typingIndicator = document.getElementById('typingIndicator');
  const typingUser = document.getElementById('typingUser');
  typingUser.textContent = data.username;
  typingIndicator.classList.remove('hidden');
  typingIndicator.classList.add('flex');
});

socket.on('user_stop_typing', () => {
  const typingIndicator = document.getElementById('typingIndicator');
  typingIndicator.classList.add('hidden');
  typingIndicator.classList.remove('flex');
});

socket.on('online_users', (users) => {
  const onlineUsersList = document.getElementById('onlineUsers');
  onlineUsersList.innerHTML = '';

  const otherUsers = users.filter(user => user !== currentUser);

  if (otherUsers.length === 0) {
    const noUsers = document.createElement('div');
    noUsers.className = 'text-xs text-mocha-500 text-center py-3';
    noUsers.textContent = 'No other users online';
    onlineUsersList.appendChild(noUsers);
    return;
  }

  otherUsers.forEach((user) => {
    const userCard = document.createElement('div');
    userCard.className = 'bg-white/50 backdrop-blur-sm rounded-2xl p-3 border border-rose-200 hover:bg-white cursor-pointer hover:shadow-md transition-all';

    userCard.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center flex-shrink-0 text-sm font-bold">
          ${user.charAt(0).toUpperCase()}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-mocha-700 truncate">${user}</p>
          <p class="text-xs text-mocha-500">💬 Click to message</p>
        </div>
        <div class="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></div>
      </div>
    `;

    userCard.addEventListener('click', () => startPrivateChat(user));
    onlineUsersList.appendChild(userCard);
  });
});

function startPrivateChat(username) {
  currentRoom = null;
  currentPrivateUser = username;
  document.getElementById('currentRoom').textContent = `💭 ${username}`;
  document.getElementById('currentUser').textContent = `Direct message`;
  document.getElementById('messagesList').innerHTML = '';

  // Show leave room button as a "back" button when in private chat
  const leaveBtn = document.getElementById('leaveRoomBtn');
  leaveBtn.classList.remove('hidden');
  leaveBtn.innerHTML = '<span class="material-symbols-outlined text-xl">arrow_back</span><span>Back</span>';

  loadPrivateMessages(username);
}

async function loadPrivateMessages(username) {
  try {
    const response = await fetch(`/api/messages/private/${currentUser}`);
    const messages = await response.json();

    const filtered = messages.filter(
      (msg) =>
        (msg.from_user === username && msg.to_user === currentUser) ||
        (msg.from_user === currentUser && msg.to_user === username)
    );

    if (filtered.length === 0) {
      document.getElementById('noMessages').classList.remove('hidden');
    } else {
      document.getElementById('noMessages').classList.add('hidden');
      filtered.forEach((msg) => {
        displayMessage(msg.from_user, msg.message, msg.date_sent);
      });
    }
  } catch (err) {
    console.error('Error loading private messages:', err);
  }
}


// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
  // Show confirmation modal
  document.getElementById('logoutModal').classList.remove('hidden');
});

// Logout confirmation handlers
document.getElementById('confirmLogoutBtn').addEventListener('click', () => {
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  localStorage.removeItem('firstname');
  localStorage.removeItem('lastname');

  socket.disconnect();
  window.location.href = '/login.html';
});

document.getElementById('cancelLogoutBtn').addEventListener('click', () => {
  // Hide the modal
  document.getElementById('logoutModal').classList.add('hidden');
});

// Update room list periodically
setInterval(() => {
  socket.emit('get_online_users');
}, 5000);
