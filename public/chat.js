const socket = io();

// grab division from ?division=… and username from localStorage
const params = new URLSearchParams(window.location.search);
const division = params.get("division");
const username = localStorage.getItem("username") || "Anonymous";

// show which division you’re in
document.getElementById("division-title").innerText = `Division ${division}`;

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

// New elements for file upload
const fileInput = document.getElementById("file-input");
const sendFileBtn = document.getElementById("send-file-btn");

// send regular chat message
sendBtn.onclick = () => {
  const message = messageInput.value.trim();
  if (!message) return;
  socket.emit("chat message", { username, message, division });
  messageInput.value = "";
};

// handle file uploads
sendFileBtn.onclick = () => {
  const file = fileInput.files[0];
  if (!file) return alert("Choose a file first");

  const reader = new FileReader();
  reader.onload = () => {
    socket.emit("file message", {
      username,
      division,
      fileName: file.name,
      fileData: reader.result  // base64 Data URL
    });
    fileInput.value = "";  // reset file input
  };
  reader.readAsDataURL(file);
};

// listen for incoming chat messages
socket.on("chat message", (data) => {
  const div = document.createElement("div");
  const time = new Date(data.time || Date.now()).toLocaleTimeString();
  div.innerText = `[${time}] ${data.username}: ${data.message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// listen for incoming file messages
socket.on("file message", (data) => {
  const div = document.createElement("div");
  const time = new Date(data.time || Date.now()).toLocaleTimeString();

  // Check if the file is an image
  if (data.fileName.match(/\.(jpe?g|png|gif)$/i)) {
    div.innerHTML = `[${time}] ${data.username} sent <strong>${data.fileName}</strong><br>
                     <img src="${data.fileData}" style="max-width:200px;"/>`;
  } else {
    div.innerHTML = `[${time}] ${data.username} sent <strong>${data.fileName}</strong>:
                     <a href="${data.fileData}" download="${data.fileName}">Download</a>`;
  }
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});

function markAttendance() {
  alert("Attendance marked! (Feature coming soon)");
}

function createPoll() {
  alert("Poll created! (Feature coming soon)");
}
