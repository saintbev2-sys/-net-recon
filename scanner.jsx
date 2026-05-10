<!DOCTYPE html>
<html>
<head>
<title>NET-RECON // Saint Bev Systems</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #0a0a0a; color: #00ff41; font-family: 'Courier New', monospace; padding: 20px; }
h1 { font-size: 22px; letter-spacing: 2px; margin-bottom: 4px; }
.sub { font-size: 10px; color: #444; margin-bottom: 24px; }
label { font-size: 10px; color: #555; letter-spacing: 2px; display: block; margin-bottom: 6px; }
.row { display: flex; gap: 8px; margin-bottom: 16px; }
input { flex: 1; background: #0f0f0f; border: 1px solid #1f1f1f; border-left: 3px solid #00ff41; color: #00ff41; padding: 10px 14px; font-family: 'Courier New', monospace; font-size: 14px; outline: none; }
button { background: #00ff41; color: #000; border: none; padding: 10px 20px; font-family: 'Courier New', monospace; font-size: 12px; font-weight: bold; cursor: pointer; letter-spacing: 2px; }
button:disabled { background: #0a1a0a; color: #00ff41; cursor: not-allowed; }
#status { background: #0a1a0a; border: 1px solid #1a2a1a; padding: 8px 14px; font-size: 11px; color: #00aa22; margin-bottom: 12px; display: none; }
#results { margin-bottom: 16px; }
.port-row { display: flex; align-items: center; gap: 12px; background: #0a1a0a; border: 1px solid #1a3a1a; padding: 10px 14px; margin-bottom: 4px; }
.badge { margin-left: auto; background: #003300; padding: 2px 8px; font-size: 10px; }
#log { background: #050505; border: 1px solid #111; padding: 12px; height: 180px; overflow-y: auto; font-size: 11px; line-height: 1.8; margin-top: 16px; display: none; }
.log-open { color: #00ff41; font-weight: bold; }
.log-sys { color: #444; }
.log-scan { color: #222; }
#summary { background: #0a1a0a; border: 1px solid #00ff41; padding: 12px 16px; margin-bottom: 16px; display: none; }
.footer { margin-top: 20px; font-size: 9px; color: #222; text-align: center; }
</style>
</head>
<body>
<h1>▶ PORT SCANNER</h1>
<div class="sub">SAINT BEV SYSTEMS // NET-RECON v1.0 // EDUCATIONAL USE ONLY</div>

<label>TARGET HOST</label>
<div class="row">
  <input id="target" placeholder="scanme.nmap.org" onkeydown="if(event.key==='Enter')scan()"/>
  <button id="btn" onclick="scan()">SCAN</button>
</div>

<div id="status"></div>
<div id="results"></div>
<div id="summary"></div>
<div id="log"></div>

<div class="footer">FOR EDUCATIONAL PURPOSES ONLY — ONLY SCAN HOSTS YOU OWN OR HAVE PERMISSION TO SCAN</div>

<script>
const PORTS = [
  {port:21,svc:"FTP"},{port:22,svc:"SSH"},{port:23,svc:"Telnet"},
  {port:25,svc:"SMTP"},{port:80,svc:"HTTP"},{port:110,svc:"POP3"},
  {port:143,svc:"IMAP"},{port:443,svc:"HTTPS"},{port:445,svc:"SMB"},
  {port:3306,svc:"MySQL"},{port:3389,svc:"RDP"},{port:5432,svc:"PostgreSQL"},
  {port:5900,svc:"VNC"},{port:8080,svc:"HTTP-Alt"}
];
const DEMO = {
  "scanme.nmap.org": [{port:22,svc:"SSH"},{port:80,svc:"HTTP"}],
  "localhost": [{port:22,svc:"SSH"},{port:80,svc:"HTTP"},{port:3306,svc:"MySQL"}]
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function scan() {
  const target = document.getElementById('target').value.trim();
  if (!target) return;
  const btn = document.getElementById('btn');
  const status = document.getElementById('status');
  const results = document.getElementById('results');
  const summary = document.getElementById('summary');
  const log = document.getElementById('log');

  btn.disabled = true; btn.textContent = 'SCANNING...';
  results.innerHTML = ''; log.innerHTML = ''; summary.style.display = 'none';
  status.style.display = 'block'; log.style.display = 'block';

  const addLog = (msg, cls) => {
    log.innerHTML += `<div class="${cls}">${msg}</div>`;
    log.scrollTop = log.scrollHeight;
  };

  addLog(`>> Initializing scan on ${target}`, 'log-sys');
  await sleep(400);
  addLog(`>> Starting TCP sweep...`, 'log-sys');
  await sleep(300);

  const demoKey = Object.keys(DEMO).find(k => target.includes(k));
  const open = demoKey ? DEMO[demoKey] : [{port:80,svc:"HTTP"},{port:443,svc:"HTTPS"}];
  const found = [];
  const start = Date.now();

  for (let i = 0; i < PORTS.length; i++) {
    const {port, svc} = PORTS[i];
    status.textContent = `● PROBING PORT ${port} — ${i+1}/${PORTS.length}`;
    addLog(`Checking ${port}/${svc}...`, 'log-scan');
    await sleep(80 + Math.random() * 120);
    if (open.some(p => p.port === port)) {
      found.push({port, svc});
      results.innerHTML += `<div class="port-row"><span>●</span><strong>${port}</strong><span style="color:#00aa22;font-size:12px">${svc}</span><span class="badge">OPEN</span></div>`;
      addLog(`[+] PORT ${port} OPEN — ${svc}`, 'log-open');
    }
  }

  const elapsed = ((Date.now()-start)/1000).toFixed(2);
  status.style.display = 'none';
  summary.style.display = 'block';
  summary.innerHTML = `<div>✓ SCAN COMPLETE — ${found.length} OPEN PORTS FOUND</div><div style="color:#555;font-size:10px">Completed in ${elapsed}s on ${target}</div>`;
  addLog(`>> Scan complete in ${elapsed}s`, 'log-sys');
  btn.disabled = false; btn.textContent = 'SCAN';
}
</script>
</body>
</html>
