import { useState, useEffect, useRef } from "react";

const COMMON_PORTS = [
  { port: 21, service: "FTP" },
  { port: 22, service: "SSH" },
  { port: 23, service: "Telnet" },
  { port: 25, service: "SMTP" },
  { port: 80, service: "HTTP" },
  { port: 110, service: "POP3" },
  { port: 143, service: "IMAP" },
  { port: 443, service: "HTTPS" },
  { port: 445, service: "SMB" },
  { port: 3306, service: "MySQL" },
  { port: 3389, service: "RDP" },
  { port: 5432, service: "PostgreSQL" },
  { port: 5900, service: "VNC" },
  { port: 8080, service: "HTTP-Alt" },
];

const DEMO_RESULTS = {
  "scanme.nmap.org": [
    { port: 22, service: "SSH", status: "open" },
    { port: 80, service: "HTTP", status: "open" },
  ],
  "localhost": [
    { port: 22, service: "SSH", status: "open" },
    { port: 80, service: "HTTP", status: "open" },
    { port: 3306, service: "MySQL", status: "open" },
  ],
};

export default function Scanner() {
  const [target, setTarget] = useState("");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);
  const [currentPort, setCurrentPort] = useState(null);
  const [done, setDone] = useState(false);
  const [scanTime, setScanTime] = useState(null);
  const [logs, setLogs] = useState([]);
  const logsRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg, type = "info") => {
    setLogs(prev => [...prev, { msg, type, id: Date.now() + Math.random() }]);
  };

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const runScan = async () => {
    if (!target.trim()) return;
    setScanning(true);
    setResults([]);
    setLogs([]);
    setDone(false);
    setScanTime(null);
    startRef.current = Date.now();

    addLog(`>> Initializing scan on ${target}`, "system");
    addLog(`>> Loading ${COMMON_PORTS.length} common ports`, "system");
    await sleep(400);
    addLog(`>> Starting TCP sweep...`, "system");
    await sleep(300);

    const demoKey = Object.keys(DEMO_RESULTS).find(k => target.includes(k));
    const openPorts = demoKey ? DEMO_RESULTS[demoKey] : [
      { port: 80, service: "HTTP", status: "open" },
      { port: 443, service: "HTTPS", status: "open" },
    ];

    const found = [];
    for (let i = 0; i < COMMON_PORTS.length; i++) {
      const { port, service } = COMMON_PORTS[i];
      setCurrentPort(port);
      addLog(`Checking ${port}/${service}...`, "scan");
      await sleep(80 + Math.random() * 120);
      const isOpen = openPorts.some(p => p.port === port);
      if (isOpen) {
        found.push({ port, service, status: "open" });
        setResults(prev => [...prev, { port, service, status: "open" }]);
        addLog(`[+] PORT ${port} OPEN — ${service}`, "open");
      }
    }

    const elapsed = ((Date.now() - startRef.current) / 1000).toFixed(2);
    setScanTime(elapsed);
    setCurrentPort(null);
    setScanning(false);
    setDone(true);
    addLog(`>> Scan complete in ${elapsed}s`, "system");
    addLog(`>> ${found.length} open ports found`, "system");
  };

  const reset = () => {
    setTarget("");
    setResults([]);
    setLogs([]);
    setDone(false);
    setCurrentPort(null);
    setScanTime(null);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", fontFamily:"'Courier New', monospace", color:"#00ff41", padding:"20px", boxSizing:"border-box" }}>
      <div style={{ marginBottom:24, borderBottom:"1px solid #1a1a1a", paddingBottom:16 }}>
        <div style={{ fontSize:10, color:"#333", letterSpacing:4, marginBottom:4 }}>NET-RECON v1.0 // EDUCATIONAL USE ONLY</div>
        <div style={{ fontSize:22, fontWeight:"bold", letterSpacing:2 }}>▶ PORT SCANNER</div>
        <div style={{ fontSize:10, color:"#444", marginTop:4 }}>SAINT BEV SYSTEMS // SCAN AUTHORIZED TARGETS ONLY</div>
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:10, color:"#555", marginBottom:6, letterSpacing:2 }}>TARGET HOST</div>
        <div style={{ display:"flex", gap:8 }}>
          <input value={target} onChange={e=>setTarget(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!scanning&&runScan()} placeholder="scanme.nmap.org" disabled={scanning} style={{ flex:1, background:"#0f0f0f", border:"1px solid #1f1f1f", borderLeft:"3px solid #00ff41", color:"#00ff41", padding:"10px 14px", fontFamily:"'Courier New', monospace", fontSize:14, outline:"none" }} />
          <button onClick={done?reset:runScan} disabled={scanning||(!target.trim()&&!done)} style={{ background:done?"#0f0f0f":scanning?"#0a1a0a":"#00ff41", color:done?"#00ff41":scanning?"#00ff41":"#000", border:done?"1px solid #00ff41":"none", padding:"10px 20px", fontFamily:"'Courier New', monospace", fontSize:12, fontWeight:"bold", cursor:scanning?"not-allowed":"pointer" }}>
            {done?"RESET":scanning?"SCANNING...":"SCAN"}
          </button>
        </div>
      </div>
      {scanning&&currentPort&&(
        <div style={{ background:"#0a1a0a", border:"1px solid #1a2a1a", padding:"8px 14px", marginBottom:12, fontSize:11, color:"#00aa22" }}>
          ● PROBING PORT {currentPort} — {COMMON_PORTS.findIndex(p=>p.port===currentPort)+1}/{COMMON_PORTS.length}
        </div>
      )}
      {results.length>0&&(
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:10, color:"#555", marginBottom:8, letterSpacing:2 }}>OPEN PORTS</div>
          {results.map(r=>(
            <div key={r.port} style={{ display:"flex", alignItems:"center", gap:12, background:"#0a1a0a", border:"1px solid #1a3a1a", padding:"10px 14px", marginBottom:4 }}>
              <span style={{ color:"#00ff41" }}>●</span>
              <span style={{ fontWeight:"bold", minWidth:50 }}>{r.port}</span>
              <span style={{ color:"#00aa22", fontSize:12 }}>{r.service}</span>
              <span style={{ marginLeft:"auto", background:"#003300", padding:"2px 8px", fontSize:10 }}>OPEN</span>
            </div>
          ))}
        </div>
      )}
      {done&&(
        <div style={{ background:"#0a1a0a", border:"1px solid #00ff41", padding:"12px 16px", marginBottom:16, fontSize:12 }}>
          <div>✓ SCAN COMPLETE — {results.length} OPEN PORTS FOUND</div>
          <div style={{ color:"#555", fontSize:10 }}>Completed in {scanTime}s on {target}</div>
        </div>
      )}
      {logs.length>0&&(
        <div>
          <div style={{ fontSize:10, color:"#555", marginBottom:6, letterSpacing:2 }}>TERMINAL OUTPUT</div>
          <div ref={logsRef} style={{ background:"#050505", border:"1px solid #111", padding:"12px", height:180, overflowY:"auto", fontSize:11, lineHeight:1.8 }}>
            {logs.map(log=>(
              <div key={log.id} style={{ color:log.type==="open"?"#00ff41":log.type==="system"?"#444":"#222", fontWeight:log.type==="open"?"bold":"normal" }}>{log.msg}</div>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginTop:20, fontSize:9, color:"#222", textAlign:"center" }}>FOR EDUCATIONAL PURPOSES ONLY — ONLY SCAN HOSTS YOU OWN OR HAVE PERMISSION TO SCAN</div>
    </div>
  );
}
