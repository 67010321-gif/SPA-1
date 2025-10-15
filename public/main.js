async function load() {
  const res = await fetch('/api/notes');
  const notes = await res.json();
  const out = document.getElementById('notes');
  out.innerHTML = notes.map(n => `<li>${esc(n.text)} <small>${new Date(n.created_at).toLocaleString()}</small></li>`).join('');
}
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const input = document.getElementById('text');
  await fetch('/api/notes', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ text: input.value })
  });
  input.value = '';
  load();
});

load();
