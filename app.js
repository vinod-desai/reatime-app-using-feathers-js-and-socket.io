// Socket.io setup
const socket = io('http://localhost:3400');
// Init feathers app
const app = feathers();
// Register socket.io to talk to server
app.configure(feathers.socketio(socket));
document.getElementById('form').addEventListener('submit', registerUser);
async function registerUser(e) {
  e.preventDefault();
  const name = document.getElementById('userName');
  const company = document.getElementById('userCompany');
  const position = document.getElementById('userPosition');
  
  app.service('users').create({
    userName: name.value,
    company: company.value,
    position: position.value
  });
  
  name.value = '';
  company.value = '';
  position.value = '';
}
function renderUser(user) {
  document.getElementById(
    'users'
  ).innerHTML += `<div class="card bg-secondary my-3">
        <div class="card-body">
          <p class="lead">
            ${user.userName} <strong>${user.position}</strong> <strong>@${user.company}</strong>
            <br />
            <small>Registered on: ${user.time}</small>
          </p>
        </div>
      </div>`;
}
async function init() {
  const users = await app.service('users').find();
  users.forEach(renderUser);
  app.service('users').on('created', renderUser);
}
init();