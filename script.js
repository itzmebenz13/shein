const users = {
  "admin": {
    password: "pass123",
    ips: []
  },
  "hacker1": {
    password: "1337",
    ips: []
  }
};

let currentUser = localStorage.getItem("user");

async function getIP() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (users[user] && users[user].password === pass) {
    localStorage.setItem("user", user);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid login");
  }
}

async function loadDashboard() {
  if (!currentUser || !users[currentUser]) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("displayUser").textContent = currentUser;

  const ip = await getIP();
  document.getElementById("currentIP").textContent = ip;

  const ipList = document.getElementById("ipList");
  ipList.innerHTML = "";
  users[currentUser].ips.forEach(ip => {
    const li = document.createElement("li");
    li.textContent = ip;
    ipList.appendChild(li);
  });
}

async function addIP() {
  const ip = document.getElementById("newIP").value.trim();
  const status = document.getElementById("status");

  if (!ip) {
    status.textContent = "Please enter a valid IP.";
    return;
  }

  const user = users[currentUser];
  if (user.ips.includes(ip)) {
    status.textContent = "IP already added.";
    return;
  }

  if (user.ips.length >= 3) {
    status.textContent = "Limit reached. Contact admin to remove IPs.";
    return;
  }

  user.ips.push(ip);
  document.getElementById("newIP").value = "";
  loadDashboard();
  status.textContent = "IP added successfully.";
}

async function proceed() {
  const ip = await getIP();
  const user = users[currentUser];

  if (user.ips.includes(ip)) {
    window.location.href = "https://hchejes.itzmebenz13.workers.dev";
  } else {
    alert("Your IP is not whitelisted. Contact admin.");
  }
}

if (window.location.pathname.includes("dashboard.html")) {
  loadDashboard();
}
