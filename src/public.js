export const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>PiWatch - Pi Wallet Monitor</title>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0a12;color:#fff;font-family:'Segoe UI',system-ui,sans-serif;min-height:100vh}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:#2a2a4a;border-radius:4px}
input{color:#fff;font-family:monospace}
input::placeholder{color:#444}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
@keyframes fadeUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
const {useState,useEffect} = React;
const G = '#f0a500', DK = '#0a0a12', CD = '#12121f', BR = '#1e1e35';
const GR = '#00e87a', RD = '#ff4560', BL = '#4f8ef7', PU = '#a259ff';

function Tag({children,color=G}){
  return <span style={{background:color+'18',border:'1px solid '+color+'40',color,fontSize:11,borderRadius:6,padding:'2px 9px',fontFamily:'monospace',letterSpacing:1}}>{children}</span>
}

function AddModal({onClose,onAdd}){
  const [step,setStep]=useState(1);
  const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({label:'',address:'',telegramToken:'',chatId:''});
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const inp={background:'#0d0d1a',border:'1px solid '+BR,borderRadius:10,padding:'12px 16px',fontSize:13,outline:'none',width:'100%',color:'#fff'};
  const lbl={color:'#888',fontSize:11,marginBottom:6,letterSpacing:1,display:'block'};
  async function submit(){
    setLoading(true);
    await onAdd(form);
    setLoading(false);
  }
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:CD,border:'1px solid '+BR,borderRadius:20,width:440,maxWidth:'100%',padding:28,position:'relative',boxShadow:'0 0 60px '+G+'15'}}>
        <button onClick={onClose} style={{position:'absolute',top:14,right:16,background:'none',border:'none',color:'#666',fontSize:20,cursor:'pointer'}}>✕</button>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
          <div style={{width:38,height:38,borderRadius:10,background:G+'18',border:'1px solid '+G+'40',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontFamily:'serif'}}>π</div>
          <div>
            <div style={{fontWeight:700,fontSize:16,color:G}}>Add Wallet Monitor</div>
            <div style={{color:'#555',fontSize:12}}>Step {step} of 2</div>
          </div>
        </div>
        <div style={{display:'flex',gap:8,marginBottom:24}}>
          {[1,2].map(s=><div key={s} style={{flex:1,height:3,borderRadius:3,background:s<=step?G:BR,transition:'background 0.3s'}}/>)}
        </div>
        {step===1&&(
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div><label style={lbl}>WALLET LABEL (OPTIONAL)</label><input value={form.label} onChange={e=>set('label',e.target.value)} placeholder="e.g. Main Wallet" style={inp}/></div>
            <div><label style={lbl}>PI WALLET ADDRESS *</label><input value={form.address} onChange={e=>set('address',e.target.value)} placeholder="GDZOM3..." style={{...inp,color:G}}/></div>
            <div style={{background:'#0d0d1a',border:'1px solid '+G+'20',borderRadius:10,padding:12,fontSize:12,color:'#666',lineHeight:1.8}}>
              💡 Your Pi address starts with <span style={{color:G}}>G</span> — find it in Pi Browser under wallet settings.
            </div>
            <button onClick={()=>setStep(2)} disabled={!form.address} style={{background:form.address?G:'#222',color:form.address?'#000':'#555',border:'none',borderRadius:10,padding:13,fontWeight:700,fontSize:15,cursor:form.address?'pointer':'not-allowed'}}>Next →</button>
          </div>
        )}
        {step===2&&(
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div><label style={lbl}>TELEGRAM BOT TOKEN *</label><input value={form.telegramToken} onChange={e=>set('telegramToken',e.target.value)} placeholder="7412038xxxx:AAH..." style={inp}/></div>
            <div><label style={lbl}>TELEGRAM CHAT ID *</label><input value={form.chatId} onChange={e=>set('chatId',e.target.value)} placeholder="@channel or -100xxxxxxx" style={inp}/></div>
            <div style={{background:'#0d0d1a',border:'1px solid '+G+'20',borderRadius:10,padding:12,fontSize:12,color:'#666',lineHeight:1.9}}>
              💡 Open Telegram → <span style={{color:G}}>@BotFather</span> → /newbot → copy token<br/>
              Add bot to your group → get chat id from:<br/>
              <span style={{color:BL,fontSize:11}}>api.telegram.org/bot(TOKEN)/getUpdates</span>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setStep(1)} style={{flex:1,background:'none',color:'#888',border:'1px solid '+BR,borderRadius:10,padding:13,cursor:'pointer',fontSize:14}}>← Back</button>
              <button onClick={submit} disabled={!form.telegramToken||!form.chatId||loading} style={{flex:2,background:form.telegramToken&&form.chatId?G:'#222',color:form.telegramToken&&form.chatId?'#000':'#555',border:'none',borderRadius:10,padding:13,fontWeight:700,fontSize:15,cursor:'pointer'}}>
                {loading?'⏳ Activating...':'🚀 Activate Monitor'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WalletCard({w,onToggle,onDelete}){
  return(
    <div style={{background:CD,border:'1px solid '+(w.active?G+'30':BR),borderRadius:16,padding:'18px 22px',position:'relative',overflow:'hidden',marginBottom:12}}>
      {w.active&&<div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:'linear-gradient(180deg,'+G+','+GR+')',borderRadius:'3px 0 0 3px'}}/>}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div style={{flex:1,minWidth:200}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,flexWrap:'wrap'}}>
            <span style={{width:8,height:8,borderRadius:'50%',background:w.active?GR:'#444',boxShadow:w.active?'0 0 8px '+GR:'none',animation:w.active?'pulse 2s infinite':'none',display:'inline-block'}}/>
            <span style={{fontWeight:700,fontSize:15}}>{w.label||'Unnamed Wallet'}</span>
            <Tag color={w.active?GR:'#555'}>{w.active?'LIVE':'PAUSED'}</Tag>
          </div>
          <div style={{fontFamily:'monospace',fontSize:11,color:G,background:'#0d0d1a',padding:'7px 11px',borderRadius:8,marginBottom:10,wordBreak:'break-all'}}>{w.address}</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
            <Tag color={BL}>🤖 {w.chat_id}</Tag>
            <Tag color='#888'>📅 {new Date(w.created_at).toLocaleDateString()}</Tag>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
          <div style={{fontSize:11,color:'#555',textAlign:'right'}}>
            <div style={{color:'#777',marginBottom:2}}>Last TX</div>
            <div style={{fontFamily:'monospace',fontSize:10}}>{w.last_tx_id?w.last_tx_id.slice(0,14)+'...':'None yet'}</div>
          </div>
          <div style={{display:'flex',gap:7}}>
            <button onClick={()=>onToggle(w.id)} style={{background:w.active?'#0a1a0a':'#111',border:'1px solid '+(w.active?GR+'50':BR),color:w.active?GR:'#666',borderRadius:8,padding:'6px 13px',cursor:'pointer',fontSize:12,fontWeight:600}}>
              {w.active?'⏸ Pause':'▶ Resume'}
            </button>
            <button onClick={()=>{if(confirm('Remove wallet?'))onDelete(w.id)}} style={{background:'#1a0808',border:'1px solid '+RD+'40',color:RD,borderRadius:8,padding:'6px 11px',cursor:'pointer',fontSize:13}}>🗑</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TxRow({tx}){
  const isR=tx.type==='receive';
  return(
    <div style={{background:CD,border:'1px solid '+BR,borderRadius:12,padding:'14px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10,marginBottom:10}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:38,height:38,borderRadius:10,background:(isR?GR:RD)+'18',border:'1px solid '+(isR?GR:RD)+'30',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>
          {isR?'📥':'📤'}
        </div>
        <div>
          <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>
            {isR?'Received ':'Sent '}
            <span style={{color:isR?GR:RD}}>{parseFloat(tx.amount).toFixed(2)} π</span>
            {tx.label&&<span style={{color:'#555',fontWeight:400}}> · {tx.label}</span>}
          </div>
          <div style={{fontSize:11,color:'#555',fontFamily:'monospace'}}>
            {tx.from_address?tx.from_address.slice(0,8)+'...':''} → {tx.to_address?tx.to_address.slice(0,8)+'...':''}
          </div>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5}}>
        <div style={{fontSize:11,color:'#555'}}>{new Date(tx.timestamp).toLocaleString()}</div>
        <Tag color={GR}>✓ ALERT SENT</Tag>
      </div>
    </div>
  );
}

function App(){
  const [wallets,setWallets]=useState([]);
  const [txs,setTxs]=useState([]);
  const [tab,setTab]=useState('wallets');
  const [modal,setModal]=useState(false);
  const [toast,setToast]=useState(null);
  const [loading,setLoading]=useState(true);

  function showToast(msg,type='ok'){
    setToast({msg,type});
    setTimeout(()=>setToast(null),4000);
  }

  async function load(){
    try{
      const [w,t]=await Promise.all([fetch('/api/wallets').then(r=>r.json()),fetch('/api/transactions').then(r=>r.json())]);
      setWallets(Array.isArray(w)?w:[]);
      setTxs(Array.isArray(t)?t:[]);
    }catch(e){showToast('Load error','err')}
    setLoading(false);
  }

  useEffect(()=>{load();const i=setInterval(load,15000);return()=>clearInterval(i);},[]);

  async function addWallet(form){
    try{
      const r=await fetch('/api/wallets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const d=await r.json();
      if(!r.ok)throw new Error(d.error||'Failed');
      await load();
      showToast('✅ Wallet monitor activated!');
      setModal(false);
    }catch(e){showToast('❌ '+e.message,'err')}
  }

  async function toggleW(id){
    await fetch('/api/wallets/'+id+'/toggle',{method:'PATCH'});
    await load();
  }

  async function deleteW(id){
    await fetch('/api/wallets/'+id,{method:'DELETE'});
    await load();
    showToast('Wallet removed');
  }

  const active=wallets.filter(w=>w.active).length;

  return(
    <div style={{minHeight:'100vh',background:DK}}>
      {toast&&(
        <div style={{position:'fixed',top:20,right:20,zIndex:200,background:CD,border:'1px solid '+(toast.type==='err'?RD+'60':GR+'60'),borderRadius:12,padding:'14px 18px',minWidth:260,animation:'slideIn 0.4s ease',boxShadow:'0 8px 32px rgba(0,0,0,0.6)',fontSize:14,fontWeight:600}}>
          {toast.msg}
        </div>
      )}

      {modal&&<AddModal onClose={()=>setModal(false)} onAdd={addWallet}/>}

      <header style={{borderBottom:'1px solid '+BR,padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between',height:62,position:'sticky',top:0,background:DK+'ee',backdropFilter:'blur(12px)',zIndex:50}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:G+'18',border:'1px solid '+G+'40',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontFamily:'serif'}}>π</div>
          <div>
            <div style={{fontWeight:700,fontSize:18,color:G}}>PiWatch</div>
            <div style={{fontSize:9,color:'#555',letterSpacing:2}}>WALLET MONITOR</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'#777'}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:GR,boxShadow:'0 0 7px '+GR,display:'inline-block',animation:'pulse 2s infinite'}}/>
            {active} monitoring
          </div>
          <button onClick={()=>setModal(true)} style={{background:G,color:'#000',border:'none',borderRadius:9,padding:'8px 16px',fontWeight:700,fontSize:13,cursor:'pointer'}}>+ Add Wallet</button>
        </div>
      </header>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1,borderBottom:'1px solid '+BR,background:BR}}>
        {[
          {label:'Active',value:active,color:GR,icon:'📡'},
          {label:'Wallets',value:wallets.length,color:BL,icon:'👛'},
          {label:'Transactions',value:txs.length,color:G,icon:'📊'},
          {label:'Uptime',value:'24/7',color:PU,icon:'⚡'},
        ].map((s,i)=>(
          <div key={i} style={{background:CD,padding:'16px 18px'}}>
            <div style={{fontSize:10,color:'#555',marginBottom:5,letterSpacing:1}}>{s.icon} {s.label}</div>
            <div style={{fontSize:24,fontWeight:700,color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{maxWidth:1000,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'flex',gap:4,marginBottom:20,borderBottom:'1px solid '+BR}}>
          {['wallets','activity'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{background:'none',border:'none',color:tab===t?G:'#555',borderBottom:tab===t?'2px solid '+G:'2px solid transparent',padding:'9px 18px',cursor:'pointer',fontWeight:600,fontSize:12,letterSpacing:1,textTransform:'uppercase',marginBottom:-1}}>
              {t==='wallets'?'👛 Wallets ('+wallets.length+')':'📋 Activity ('+txs.length+')'}
            </button>
          ))}
        </div>

        {loading?(
          <div style={{textAlign:'center',padding:80,color:'#444'}}>
            <div style={{fontSize:32,marginBottom:12}}>⏳</div>Loading...
          </div>
        ):tab==='wallets'?(
          wallets.length===0?(
            <div style={{textAlign:'center',padding:'70px 20px',color:'#444'}}>
              <div style={{fontSize:44,marginBottom:14}}>👛</div>
              <div style={{color:'#666',marginBottom:6}}>No wallets added yet</div>
              <div style={{fontSize:12}}>Click "+ Add Wallet" to start monitoring</div>
            </div>
          ):(
            wallets.map(w=><WalletCard key={w.id} w={w} onToggle={toggleW} onDelete={deleteW}/>)
          )
        ):(
          txs.length===0?(
            <div style={{textAlign:'center',padding:'70px 20px',color:'#444'}}>
              <div style={{fontSize:44,marginBottom:14}}>📋</div>
              <div style={{color:'#666'}}>No transactions yet</div>
            </div>
          ):(
            txs.map(tx=><TxRow key={tx.id} tx={tx}/>)
          )
        )}
      </div>

      <div style={{textAlign:'center',padding:20,color:'#333',fontSize:11,borderTop:'1px solid '+BR}}>
        PiWatch · Running 24/7 · Pi Network Monitor <span style={{color:G}}>π</span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
</script>
</body>
</html>`;
