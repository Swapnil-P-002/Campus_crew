function enterDivision(division) {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("You must login first!");
    window.location.href = "/login.html";
    return;
  }
  window.location.href = `/chat.html?division=${division}`;
}
