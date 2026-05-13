import { useState, useEffect, useRef } from "react";

/* ── GLOBAL STYLES ─────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700;800;900&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');

:root {
  --ink:#05080f; --deep:#080e1c; --navy:#0c1528; --card:#0f1b30;
  --card2:#111f36; --gold:#e8a000; --gold2:#ffc340; --gold3:rgba(232,160,0,0.12);
  --em:#00c97a; --em2:rgba(0,201,122,0.13); --sky:#29a9ff; --sky2:rgba(41,169,255,0.12);
  --red:#ff3355; --red2:rgba(255,51,85,0.14); --white:#eef2ff; --muted:#6b82aa;
  --dim:#2a3a58; --border:rgba(255,255,255,0.07); --glass:rgba(255,255,255,0.035);
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{font-family:'Outfit',sans-serif;background:var(--ink);color:var(--white);overflow-x:hidden}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:var(--dim);border-radius:4px}

.wrap{min-height:100vh;background:var(--ink)}

/* ── TOP BAR ── */
.topbar{
  background:rgba(5,8,15,0.92);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);
  padding:0 20px;height:58px;
  display:flex;align-items:center;justify-content:space-between;
  position:sticky;top:0;z-index:100;
}
.logo{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--gold);display:flex;align-items:center;gap:8px}
.logo .sh{width:30px;height:30px;background:linear-gradient(135deg,var(--gold),var(--gold2));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 0 16px rgba(232,160,0,0.4)}
.logo em{color:var(--white);font-style:normal}
.view-tabs{display:flex;gap:3px;background:var(--glass);border:1px solid var(--border);border-radius:10px;padding:3px}
.vt{padding:6px 14px;border-radius:7px;border:none;font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;color:var(--muted);background:transparent;display:flex;align-items:center;gap:5px}
.vt.on{background:var(--gold);color:var(--ink);font-weight:700}
.vt:hover:not(.on){color:var(--white);background:rgba(255,255,255,0.05)}

/* ── LAYOUT ── */
.layout{display:grid;grid-template-columns:1fr 1fr;min-height:calc(100vh - 58px);gap:0}
.panel{padding:24px;overflow-y:auto;max-height:calc(100vh - 58px)}
.panel.driver-panel{background:linear-gradient(160deg,#0a0e00,#0d1400,#080e00);border-right:1px solid var(--border)}
.panel.parent-panel{background:linear-gradient(160deg,#050a18,#060d20,#04091a)}

.panel-header{display:flex;align-items:center;gap:12px;margin-bottom:22px;padding-bottom:16px;border-bottom:1px solid var(--border)}
.ph-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px}
.ph-icon.driver{background:rgba(232,160,0,0.12);border:1px solid rgba(232,160,0,0.2)}
.ph-icon.parent{background:rgba(41,169,255,0.12);border:1px solid rgba(41,169,255,0.2)}
.ph-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700}
.ph-sub{font-size:11px;color:var(--muted);margin-top:2px;font-family:'Noto Nastaliq Urdu',serif;direction:rtl}
.ph-badge{margin-left:auto;padding:5px 12px;border-radius:100px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:5px}
.pb-driver{background:var(--gold3);color:var(--gold);border:1px solid rgba(232,160,0,0.3)}
.pb-parent{background:var(--sky2);color:var(--sky);border:1px solid rgba(41,169,255,0.3)}

/* ── TRIP INFO BANNER ── */
.trip-banner{
  background:rgba(255,255,255,0.025);border:1px solid var(--border);
  border-radius:16px;padding:16px;margin-bottom:20px;
  display:flex;align-items:center;gap:14px;
}
.tb-van{width:46px;height:46px;border-radius:12px;background:rgba(232,160,0,0.1);border:1px solid rgba(232,160,0,0.2);display:flex;align-items:center;justify-content:center;font-size:24px}
.tb-info{}
.tb-route{font-size:13px;font-weight:700;margin-bottom:3px}
.tb-meta{font-size:11px;color:var(--muted)}
.tb-status{margin-left:auto;text-align:right}
.tb-time{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--gold)}
.tb-tlabel{font-size:10px;color:var(--muted)}

/* ── PROGRESS TRACKER ── */
.progress-track{
  background:rgba(255,255,255,0.02);border:1px solid var(--border);
  border-radius:16px;padding:18px;margin-bottom:20px;
}
.pt-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:14px}
.pt-steps{display:flex;align-items:center;gap:0}
.pt-step{
  flex:1;display:flex;flex-direction:column;align-items:center;
  position:relative;
}
.pt-step:not(:last-child)::after{
  content:'';position:absolute;
  top:16px;left:calc(50% + 16px);right:calc(-50% + 16px);
  height:2px;background:var(--dim);transition:background 0.5s;
  z-index:0;
}
.pt-step.done:not(:last-child)::after{background:var(--em)}
.pt-step.curr:not(:last-child)::after{background:linear-gradient(90deg,var(--gold),var(--dim))}
.pt-circle{
  width:32px;height:32px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:800;border:2px solid var(--dim);
  background:var(--ink);position:relative;z-index:1;
  transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
.pt-step.done .pt-circle{background:var(--em);border-color:var(--em);color:var(--ink);font-size:16px}
.pt-step.curr .pt-circle{background:var(--gold3);border-color:var(--gold);color:var(--gold);animation:stepGlow 1.8s ease infinite}
.pt-step.pend .pt-circle{color:var(--muted)}
@keyframes stepGlow{0%,100%{box-shadow:0 0 0 0 rgba(232,160,0,0.5)}60%{box-shadow:0 0 0 9px rgba(232,160,0,0)}}
.pt-name{font-size:9px;color:var(--muted);margin-top:6px;text-align:center;font-weight:600;letter-spacing:0.04em;text-transform:uppercase}
.pt-step.done .pt-name{color:var(--em)} .pt-step.curr .pt-name{color:var(--gold)}

/* ── PASSENGER LIST ── */
.pax-section{margin-bottom:20px}
.pax-section-title{
  font-size:12px;font-weight:700;color:var(--muted);
  text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;
  display:flex;align-items:center;justify-content:space-between;
}
.pax-count{
  background:var(--gold3);color:var(--gold);border:1px solid rgba(232,160,0,0.3);
  border-radius:100px;padding:3px 10px;font-size:10px;font-weight:800;
}

/* ── CHILD CHECK CARD (DRIVER) ── */
.child-check-card{
  background:var(--card);border:1px solid var(--border);
  border-radius:18px;padding:18px;margin-bottom:10px;
  transition:all 0.35s cubic-bezier(0.22,1,0.36,1);
  position:relative;overflow:hidden;
}
.child-check-card.checked-in{
  border-color:rgba(232,160,0,0.4);
  background:linear-gradient(135deg,rgba(232,160,0,0.06),rgba(232,160,0,0.02));
}
.child-check-card.dropped{
  border-color:rgba(0,201,122,0.4);
  background:linear-gradient(135deg,rgba(0,201,122,0.08),rgba(0,201,122,0.02));
}
.ccc-top{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.ccc-avatar{
  width:44px;height:44px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;font-size:22px;
  border:2px solid var(--dim);transition:border-color 0.3s;flex-shrink:0;
}
.child-check-card.checked-in .ccc-avatar{border-color:rgba(232,160,0,0.5);background:rgba(232,160,0,0.08)}
.child-check-card.dropped .ccc-avatar{border-color:rgba(0,201,122,0.5);background:rgba(0,201,122,0.08)}
.ccc-name{font-size:15px;font-weight:700}
.ccc-meta{font-size:11px;color:var(--muted);margin-top:2px}
.ccc-status-chip{
  margin-left:auto;padding:4px 10px;border-radius:100px;
  font-size:10px;font-weight:800;white-space:nowrap;
  transition:all 0.3s;
}
.sc-waiting{background:rgba(107,130,170,0.12);color:var(--muted);border:1px solid rgba(107,130,170,0.2)}
.sc-onboard{background:var(--gold3);color:var(--gold);border:1px solid rgba(232,160,0,0.35)}
.sc-dropped{background:var(--em2);color:var(--em);border:1px solid rgba(0,201,122,0.3)}

/* ── BIG CHECKBOXES ── */
.check-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.big-check-btn{
  padding:12px 10px;border-radius:14px;border:none;
  font-family:'Outfit',sans-serif;cursor:pointer;
  transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  display:flex;flex-direction:column;align-items:center;gap:5px;
  position:relative;overflow:hidden;
}
.big-check-btn::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(transparent,rgba(255,255,255,0.05));
  opacity:0;transition:opacity 0.3s;
}
.big-check-btn:hover::before{opacity:1}

/* BOARDING BUTTON */
.btn-board{
  background:rgba(232,160,0,0.08);
  border:1.5px solid rgba(232,160,0,0.25);
  color:var(--gold);
}
.btn-board:hover:not(:disabled){
  background:rgba(232,160,0,0.15);
  border-color:rgba(232,160,0,0.5);
  transform:translateY(-2px) scale(1.02);
}
.btn-board.active{
  background:linear-gradient(135deg,#c87800,#e8a000);
  border-color:var(--gold);color:var(--ink);
  box-shadow:0 6px 24px rgba(232,160,0,0.4);
  transform:scale(1.02);
}
.btn-board:disabled{opacity:0.35;cursor:not-allowed}

/* DROP OFF BUTTON */
.btn-drop{
  background:rgba(0,201,122,0.06);
  border:1.5px solid rgba(0,201,122,0.2);
  color:var(--em);
}
.btn-drop:hover:not(:disabled){
  background:rgba(0,201,122,0.13);
  border-color:rgba(0,201,122,0.45);
  transform:translateY(-2px) scale(1.02);
}
.btn-drop.active{
  background:linear-gradient(135deg,#009955,#00c97a);
  border-color:var(--em);color:var(--ink);
  box-shadow:0 6px 24px rgba(0,201,122,0.4);
  transform:scale(1.02);
}
.btn-drop:disabled{opacity:0.35;cursor:not-allowed}

.bcb-ico{font-size:22px;transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1)}
.big-check-btn:active .bcb-ico{transform:scale(1.4) rotate(-10deg)}
.bcb-label{font-size:12px;font-weight:700;line-height:1.2;text-align:center}
.bcb-urdu{font-family:'Noto Nastaliq Urdu',serif;font-size:10px;opacity:0.65;direction:rtl;font-weight:400}
.bcb-tick{
  position:absolute;top:8px;right:8px;
  width:18px;height:18px;border-radius:50%;
  background:rgba(255,255,255,0.9);
  display:flex;align-items:center;justify-content:center;
  font-size:10px;
  transition:all 0.3s;
  transform:scale(0);
}
.big-check-btn.active .bcb-tick{transform:scale(1)}

/* ── TIMESTAMP STRIP ── */
.ts-strip{
  display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;
}
.ts-item{
  display:flex;align-items:center;gap:5px;
  background:rgba(255,255,255,0.03);border:1px solid var(--border);
  border-radius:8px;padding:5px 10px;font-size:10px;color:var(--muted);
}
.ts-item .ts-ico{font-size:12px}
.ts-item strong{color:var(--white)}

/* ── PARENT VIEW CARDS ── */
.parent-child-card{
  background:var(--card);border:1px solid var(--border);
  border-radius:20px;padding:20px;margin-bottom:12px;
  transition:all 0.4s cubic-bezier(0.22,1,0.36,1);
  position:relative;overflow:hidden;
}
.parent-child-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  border-radius:3px 3px 0 0;background:var(--dim);transition:background 0.5s;
}
.parent-child-card.status-waiting::before{background:var(--dim)}
.parent-child-card.status-onboard::before{background:linear-gradient(90deg,var(--gold),var(--gold2))}
.parent-child-card.status-dropped::before{background:linear-gradient(90deg,var(--em),#00ff99)}

.pcc-header{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.pcc-avatar{
  width:54px;height:54px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;font-size:26px;
  border:3px solid var(--dim);transition:all 0.4s;
  position:relative;
}
.status-onboard .pcc-avatar{border-color:rgba(232,160,0,0.6);background:rgba(232,160,0,0.08)}
.status-dropped .pcc-avatar{border-color:rgba(0,201,122,0.6);background:rgba(0,201,122,0.08)}
.pcc-ring{
  position:absolute;inset:-5px;border-radius:50%;
  border:2px solid transparent;transition:all 0.4s;
}
.status-onboard .pcc-ring{border-color:rgba(232,160,0,0.4);animation:ringPulse 2s ease infinite}
.status-dropped .pcc-ring{border-color:rgba(0,201,122,0.4);animation:ringPulse 2s ease infinite}
@keyframes ringPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:0.5}}
.pcc-name{font-size:18px;font-weight:800}
.pcc-school{font-size:12px;color:var(--muted);margin-top:2px}
.pcc-big-status{
  margin-left:auto;text-align:center;
}
.pcc-status-icon{font-size:32px;margin-bottom:4px}
.pcc-status-text{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em}

/* ── STATUS DISPLAY BOX ── */
.status-box{
  border-radius:14px;padding:16px;
  display:flex;align-items:center;gap:14px;margin-bottom:14px;
  transition:all 0.5s cubic-bezier(0.22,1,0.36,1);
}
.sb-waiting{background:rgba(107,130,170,0.06);border:1px solid rgba(107,130,170,0.15)}
.sb-onboard{background:linear-gradient(135deg,rgba(232,160,0,0.1),rgba(232,160,0,0.04));border:1px solid rgba(232,160,0,0.3);animation:onboardGlow 3s ease infinite}
.sb-dropped{background:linear-gradient(135deg,rgba(0,201,122,0.1),rgba(0,201,122,0.04));border:1px solid rgba(0,201,122,0.3)}
@keyframes onboardGlow{0%,100%{box-shadow:none}50%{box-shadow:0 0 20px rgba(232,160,0,0.12)}}
.sb-ico{font-size:34px}
.sb-content{}
.sb-title{font-size:15px;font-weight:800;margin-bottom:3px}
.sb-waiting .sb-title{color:var(--muted)}
.sb-onboard .sb-title{color:var(--gold)}
.sb-dropped .sb-title{color:var(--em)}
.sb-desc{font-size:12px;color:var(--muted);line-height:1.5}
.sb-urdu{font-family:'Noto Nastaliq Urdu',serif;direction:rtl;font-size:13px;margin-top:4px}
.sb-waiting .sb-urdu{color:var(--muted)}
.sb-onboard .sb-urdu{color:rgba(232,160,0,0.8)}
.sb-dropped .sb-urdu{color:rgba(0,201,122,0.8)}

/* ── PARENT CONFIRM BUTTON ── */
.parent-confirm-section{margin-top:12px}
.confirm-header{font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px}
.parent-confirm-btn{
  width:100%;padding:16px;border-radius:16px;border:none;
  font-family:'Outfit',sans-serif;font-size:15px;font-weight:800;
  cursor:pointer;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  display:flex;align-items:center;justify-content:center;gap:10px;
}
.pcb-confirm{
  background:linear-gradient(135deg,rgba(0,201,122,0.12),rgba(0,201,122,0.06));
  border:2px solid rgba(0,201,122,0.35);color:var(--em);
}
.pcb-confirm:hover{
  background:linear-gradient(135deg,rgba(0,201,122,0.22),rgba(0,201,122,0.1));
  transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,201,122,0.2);
}
.pcb-confirmed{
  background:linear-gradient(135deg,var(--em),#00a862);
  color:var(--ink);box-shadow:0 6px 24px rgba(0,201,122,0.4);
  cursor:default;
}
.pcb-waiting{
  background:rgba(107,130,170,0.06);
  border:1px solid rgba(107,130,170,0.15);
  color:var(--muted);cursor:not-allowed;
}
.pcb-ico{font-size:20px}

/* ── PARENT CONFIRM COUNTER ── */
.dual-confirm-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
.dc-item{
  background:rgba(255,255,255,0.025);border:1px solid var(--border);
  border-radius:12px;padding:12px;text-align:center;
  transition:all 0.3s;
}
.dc-item.confirmed{background:var(--em2);border-color:rgba(0,201,122,0.3)}
.dc-who{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:5px;font-weight:700}
.dc-ico{font-size:20px;margin-bottom:3px}
.dc-status{font-size:11px;font-weight:700}
.dc-item.confirmed .dc-status{color:var(--em)}
.dc-time{font-size:10px;color:var(--muted);margin-top:2px}

/* ── NOTIFICATION TOAST ── */
.toast-container{
  position:fixed;top:70px;right:16px;
  display:flex;flex-direction:column;gap:8px;
  z-index:999;pointer-events:none;
}
.toast{
  background:var(--card2);border:1px solid var(--border);
  border-radius:14px;padding:14px 18px;
  display:flex;align-items:center;gap:12px;
  max-width:280px;
  animation:toastIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
  box-shadow:0 8px 32px rgba(0,0,0,0.5);
  pointer-events:all;
}
@keyframes toastIn{from{opacity:0;transform:translateX(40px) scale(0.95)}to{opacity:1;transform:translateX(0) scale(1)}}
.toast.out{animation:toastOut 0.3s ease both}
@keyframes toastOut{to{opacity:0;transform:translateX(40px) scale(0.95)}}
.toast-ico{font-size:22px;flex-shrink:0}
.toast-title{font-size:13px;font-weight:700;margin-bottom:2px}
.toast-body{font-size:11px;color:var(--muted);line-height:1.4}
.toast-urdu{font-family:'Noto Nastaliq Urdu',serif;direction:rtl;font-size:11px;color:var(--muted);margin-top:2px}
.toast.gold{border-color:rgba(232,160,0,0.4);background:linear-gradient(135deg,rgba(232,160,0,0.06),var(--card2))}
.toast.em{border-color:rgba(0,201,122,0.4);background:linear-gradient(135deg,rgba(0,201,122,0.06),var(--card2))}
.toast.sky{border-color:rgba(41,169,255,0.4);background:linear-gradient(135deg,rgba(41,169,255,0.06),var(--card2))}

/* ── EVENT LOG ── */
.event-log{
  background:rgba(255,255,255,0.02);border:1px solid var(--border);
  border-radius:14px;padding:14px;margin-top:16px;
}
.el-title{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.el-item{
  display:flex;gap:10px;padding:8px 0;
  border-bottom:1px solid rgba(255,255,255,0.04);
  animation:elIn 0.4s ease both;
}
@keyframes elIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.el-item:last-child{border-bottom:none;padding-bottom:0}
.el-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
.el-dot.em{background:var(--em)} .el-dot.gold{background:var(--gold)}
.el-dot.sky{background:var(--sky)} .el-dot.muted{background:var(--muted)}
.el-text{font-size:12px;flex:1;line-height:1.45}
.el-time{font-size:10px;color:var(--muted);flex-shrink:0;margin-top:1px}

/* ── SUMMARY CARD ── */
.summary-card{
  background:linear-gradient(135deg,rgba(0,201,122,0.1),rgba(0,201,122,0.04));
  border:1px solid rgba(0,201,122,0.3);
  border-radius:16px;padding:18px;margin-bottom:12px;
  animation:fadeIn 0.5s ease both;
}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.sc-title{font-size:13px;font-weight:800;color:var(--em);margin-bottom:12px;display:flex;align-items:center;gap:7px}
.sc-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(0,201,122,0.1);font-size:12px}
.sc-row:last-child{border-bottom:none;padding-bottom:0}
.sc-label{color:var(--muted)} .sc-val{font-weight:700;color:var(--em)}

/* ── RESET BTN ── */
.reset-btn{
  width:100%;padding:12px;border-radius:12px;
  border:1px solid var(--border);background:var(--glass);
  color:var(--muted);font-family:'Outfit',sans-serif;
  font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;
  margin-top:14px;display:flex;align-items:center;justify-content:center;gap:7px;
}
.reset-btn:hover{background:rgba(255,255,255,0.05);color:var(--white)}

/* ── HOW IT WORKS ── */
.how-card{
  background:rgba(255,255,255,0.02);border:1px solid var(--border);
  border-radius:14px;padding:14px;margin-bottom:16px;
}
.hw-title{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px}
.hw-step{display:flex;gap:10px;align-items:flex-start;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
.hw-step:last-child{border-bottom:none;padding-bottom:0}
.hw-num{width:22px;height:22px;border-radius:50%;background:var(--gold3);border:1px solid rgba(232,160,0,0.3);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:var(--gold);flex-shrink:0;margin-top:1px}
.hw-text{font-size:12px;line-height:1.5}
.hw-urdu{font-family:'Noto Nastaliq Urdu',serif;direction:rtl;font-size:11px;color:var(--muted)}

@media(max-width:800px){.layout{grid-template-columns:1fr}}
@media(max-width:500px){.check-actions{grid-template-columns:1fr}.dual-confirm-row{grid-template-columns:1fr}}
`;

/* ── CHILDREN DATA ── */
const CHILDREN = [
  { id: 1, name: "Zara Malik", school: "Beaconhouse DHA · Class 5", emoji: "👧", parent: "Amna Ji" },
  { id: 2, name: "Omar Sheikh", school: "Beaconhouse DHA · Class 3", emoji: "👦", parent: "Fatima Ji" },
  { id: 3, name: "Hana Tariq", school: "Beaconhouse DHA · Class 4", emoji: "👧", parent: "Sara Ji" },
];

const TRIP = { route: "Johar Town → Beaconhouse DHA", time: "7:28 AM", plate: "LHR-4821" };

function now() {
  const d = new Date();
  return d.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/* ── TOAST ── */
function ToastStack({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.color}`}>
          <div className="toast-ico">{t.ico}</div>
          <div>
            <div className="toast-title">{t.title}</div>
            <div className="toast-body">{t.body}</div>
            {t.urdu && <div className="toast-urdu">{t.urdu}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── PROGRESS TRACKER ── */
function ProgressTracker({ checkedIn, dropped, parentConfirmed }) {
  const allDone = checkedIn > 0 && dropped > 0 && parentConfirmed > 0;
  const steps = [
    { label: "Trip Start", state: "done" },
    { label: "Pick Up", state: checkedIn > 0 ? "done" : "curr" },
    { label: "En Route", state: checkedIn > 0 && dropped === 0 ? "curr" : checkedIn > 0 ? "done" : "pend" },
    { label: "Drop Off", state: dropped > 0 ? "done" : checkedIn > 0 ? "curr" : "pend" },
    { label: "Confirmed", state: allDone ? "done" : dropped > 0 ? "curr" : "pend" },
  ];
  return (
    <div className="progress-track">
      <div className="pt-label">Trip Progress · سفر کی پیشرفت</div>
      <div className="pt-steps">
        {steps.map((s, i) => (
          <div key={i} className={`pt-step ${s.state}`}>
            <div className="pt-circle">
              {s.state === "done" ? "✓" : s.state === "curr" ? "●" : i + 1}
            </div>
            <div className="pt-name">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── MAIN APP ── */
export default function AttendanceUI() {
  const [view, setView] = useState("split"); // split | driver | parent
  const [childStates, setChildStates] = useState(
    Object.fromEntries(CHILDREN.map(c => [c.id, {
      boardedAt: null, droppedAt: null,
      parentConfirmed: false, parentConfirmedAt: null,
    }]))
  );
  const [toasts, setToasts] = useState([]);
  const [logs, setLogs] = useState([
    { dot: "muted", text: "Trip started — Ahmad departed Johar Town", time: "7:15 AM" },
  ]);
  const toastId = useRef(0);

  /* Fire toast */
  const toast = (ico, title, body, urdu, color) => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, ico, title, body, urdu, color }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500);
  };

  /* Add log */
  const log = (dot, text) => {
    setLogs(l => [{ dot, text, time: now() }, ...l].slice(0, 12));
  };

  /* BOARD child */
  const handleBoard = (child) => {
    const t = now();
    setChildStates(s => ({ ...s, [child.id]: { ...s[child.id], boardedAt: t } }));
    toast("🚌", `${child.name} is on board!`, `Marked boarded at ${t}`, `${child.name.split(" ")[0]} گاڑی میں ہے`, "gold");
    log("gold", `✅ ${child.name} boarded the van — marked by Ahmad`);
  };

  /* DROP child */
  const handleDrop = (child) => {
    const t = now();
    setChildStates(s => ({ ...s, [child.id]: { ...s[child.id], droppedAt: t } }));
    toast("🏫", `${child.name} dropped at school!`, `Dropped safely at ${t}`, `${child.name.split(" ")[0]} اسکول پہنچ گئی`, "em");
    log("em", `🏫 ${child.name} dropped at Beaconhouse — marked by Ahmad`);
  };

  /* PARENT CONFIRM */
  const handleParentConfirm = (child) => {
    const t = now();
    setChildStates(s => ({ ...s, [child.id]: { ...s[child.id], parentConfirmed: true, parentConfirmedAt: t } }));
    toast("✅", "Confirmed!", `You confirmed ${child.name.split(" ")[0]} arrived safely`, "آپ نے تصدیق کر دی", "sky");
    log("sky", `${childStates[child.id]?.droppedAt ? "🔵" : "⬜"} ${child.name}'s parent (${child.parent}) confirmed safe arrival`);
  };

  /* RESET */
  const reset = () => {
    setChildStates(Object.fromEntries(CHILDREN.map(c => [c.id, {
      boardedAt: null, droppedAt: null, parentConfirmed: false, parentConfirmedAt: null
    }])));
    setLogs([{ dot: "muted", text: "Trip restarted — demonstration reset", time: now() }]);
    setToasts([]);
  };

  /* Derived counts */
  const boardedCount = CHILDREN.filter(c => childStates[c.id]?.boardedAt).length;
  const droppedCount = CHILDREN.filter(c => childStates[c.id]?.droppedAt).length;
  const confirmedCount = CHILDREN.filter(c => childStates[c.id]?.parentConfirmed).length;
  const allDropped = droppedCount === CHILDREN.length;
  const allConfirmed = confirmedCount === CHILDREN.length;

  const getStatus = (child) => {
    const s = childStates[child.id];
    if (s.droppedAt) return "dropped";
    if (s.boardedAt) return "checked-in";
    return "";
  };

  const getParentStatus = (child) => {
    const s = childStates[child.id];
    if (s.droppedAt) return "status-dropped";
    if (s.boardedAt) return "status-onboard";
    return "status-waiting";
  };

  const showDriver = view === "split" || view === "driver";
  const showParent = view === "split" || view === "parent";

  return (
    <>
      <style>{G}</style>
      <div className="wrap">

        {/* TOP BAR */}
        <div className="topbar">
          <div className="logo">
            <div className="sh">🛡️</div>
            Bahi<em>fazat</em>
            <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Outfit',sans-serif", fontWeight: 500, marginLeft: 4 }}>
              · Child Attendance System
            </span>
          </div>
          <div className="view-tabs">
            <button className={`vt ${view === "split" ? "on" : ""}`} onClick={() => setView("split")}>⚡ Both Views</button>
            <button className={`vt ${view === "driver" ? "on" : ""}`} onClick={() => setView("driver")}>🚐 Driver</button>
            <button className={`vt ${view === "parent" ? "on" : ""}`} onClick={() => setView("parent")}>👩 Parent</button>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>
            {boardedCount}/{CHILDREN.length} boarded · {droppedCount}/{CHILDREN.length} dropped · {confirmedCount}/{CHILDREN.length} confirmed
          </div>
        </div>

        <ToastStack toasts={toasts} />

        <div className="layout" style={view !== "split" ? { gridTemplateColumns: "1fr" } : {}}>

          {/* ══════ DRIVER PANEL ══════ */}
          {showDriver && (
            <div className="panel driver-panel">

              {/* Header */}
              <div className="panel-header">
                <div className="ph-icon driver">🚐</div>
                <div>
                  <div className="ph-title">Driver View — Ahmad Raza</div>
                  <div className="ph-sub">ڈرائیور احمد رضا کا پینل</div>
                </div>
                <div className="ph-badge pb-driver">🚗 LHR-4821</div>
              </div>

              {/* How it works — driver */}
              <div className="how-card">
                <div className="hw-title">How to Mark Attendance · حاضری کیسے لگائیں</div>
                {[
                  { n: "1", t: "Child boards → tap ✅ Board button", u: "بچہ بیٹھے → بورڈ دبائیں" },
                  { n: "2", t: "Parent gets instant notification on their phone", u: "والدین کو فوری اطلاع ملے گی" },
                  { n: "3", t: "At school → tap 🏫 Drop Off button", u: "اسکول پہنچیں → ڈراپ دبائیں" },
                ].map((s, i) => (
                  <div key={i} className="hw-step">
                    <div className="hw-num">{s.n}</div>
                    <div><div className="hw-text">{s.t}</div><div className="hw-urdu">{s.u}</div></div>
                  </div>
                ))}
              </div>

              {/* Trip banner */}
              <div className="trip-banner">
                <div className="tb-van">🚐</div>
                <div className="tb-info">
                  <div className="tb-route">{TRIP.route}</div>
                  <div className="tb-meta">3 children · Wednesday 22 Apr · LHR-4821</div>
                </div>
                <div className="tb-status">
                  <div className="tb-time">{TRIP.time}</div>
                  <div className="tb-tlabel">Departed</div>
                </div>
              </div>

              {/* Progress */}
              <ProgressTracker checkedIn={boardedCount} dropped={droppedCount} parentConfirmed={confirmedCount} />

              {/* Passenger checklist */}
              <div className="pax-section">
                <div className="pax-section-title">
                  Today's Children · آج کے بچے
                  <div className="pax-count">{boardedCount}/{CHILDREN.length} On Board</div>
                </div>

                {CHILDREN.map(child => {
                  const s = childStates[child.id];
                  const status = getStatus(child);
                  return (
                    <div key={child.id} className={`child-check-card ${status}`}>
                      <div className="ccc-top">
                        <div className="ccc-avatar">{child.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div className="ccc-name">{child.name}</div>
                          <div className="ccc-meta">{child.school}</div>
                        </div>
                        <div className={`ccc-status-chip ${!s.boardedAt ? "sc-waiting" : !s.droppedAt ? "sc-onboard" : "sc-dropped"}`}>
                          {!s.boardedAt ? "⏳ Waiting" : !s.droppedAt ? "🚌 On Board" : "✅ Dropped"}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="check-actions">
                        {/* BOARD */}
                        <button
                          className={`big-check-btn btn-board ${s.boardedAt ? "active" : ""}`}
                          onClick={() => !s.boardedAt && handleBoard(child)}
                          disabled={!!s.boardedAt}
                        >
                          <div className="bcb-tick">✓</div>
                          <span className="bcb-ico">{s.boardedAt ? "✅" : "🚌"}</span>
                          <span className="bcb-label">{s.boardedAt ? "Boarded ✓" : "Mark Boarded"}</span>
                          <span className="bcb-urdu">{s.boardedAt ? "گاڑی میں بیٹھ گیا" : "گاڑی میں بیٹھا دیں"}</span>
                        </button>
                        {/* DROP */}
                        <button
                          className={`big-check-btn btn-drop ${s.droppedAt ? "active" : ""}`}
                          onClick={() => s.boardedAt && !s.droppedAt && handleDrop(child)}
                          disabled={!s.boardedAt || !!s.droppedAt}
                          title={!s.boardedAt ? "Board first" : ""}
                        >
                          <div className="bcb-tick">✓</div>
                          <span className="bcb-ico">{s.droppedAt ? "🏫" : "🏫"}</span>
                          <span className="bcb-label">{s.droppedAt ? "Dropped ✓" : "Mark Dropped"}</span>
                          <span className="bcb-urdu">{s.droppedAt ? "اسکول پہنچا دیا" : "اسکول اتار دیں"}</span>
                        </button>
                      </div>

                      {/* Timestamps */}
                      {(s.boardedAt || s.droppedAt) && (
                        <div className="ts-strip">
                          {s.boardedAt && (
                            <div className="ts-item">
                              <span className="ts-ico">🚌</span> Boarded at <strong>{s.boardedAt}</strong>
                            </div>
                          )}
                          {s.droppedAt && (
                            <div className="ts-item">
                              <span className="ts-ico">🏫</span> Dropped at <strong>{s.droppedAt}</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* All dropped summary */}
              {allDropped && (
                <div className="summary-card">
                  <div className="sc-title">✅ All Children Dropped Safely!</div>
                  {CHILDREN.map(c => (
                    <div key={c.id} className="sc-row">
                      <span className="sc-label">{c.emoji} {c.name}</span>
                      <span className="sc-val">{childStates[c.id].droppedAt}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Event log */}
              <div className="event-log">
                <div className="el-title">📋 Trip Log · سفر نامہ</div>
                {logs.map((l, i) => (
                  <div key={i} className="el-item">
                    <div className={`el-dot ${l.dot}`} />
                    <div className="el-text">{l.text}</div>
                    <div className="el-time">{l.time}</div>
                  </div>
                ))}
              </div>

              <button className="reset-btn" onClick={reset}>🔄 Reset Demo · دوبارہ شروع</button>
            </div>
          )}

          {/* ══════ PARENT PANEL ══════ */}
          {showParent && (
            <div className="panel parent-panel">

              {/* Header */}
              <div className="panel-header">
                <div className="ph-icon parent">👩</div>
                <div>
                  <div className="ph-title">Parent View — Live Updates</div>
                  <div className="ph-sub">والدین کا پینل — لائیو اطلاعات</div>
                </div>
                <div className="ph-badge pb-parent">👁️ Live</div>
              </div>

              {/* How it works — parent */}
              <div className="how-card">
                <div className="hw-title">What You See · آپ کیا دیکھیں گے</div>
                {[
                  { n: "1", t: "Driver marks child boarded → you see 'On the Way'", u: "ڈرائیور نے نشان لگایا → آپ کو نظر آئے گا" },
                  { n: "2", t: "Driver marks dropped → you confirm your child arrived", u: "ڈرائیور نے ڈراپ کیا → آپ تصدیق کریں" },
                  { n: "3", t: "Both confirmations = Full safety record logged", u: "دونوں تصدیقیں = مکمل حاضری ریکارڈ" },
                ].map((s, i) => (
                  <div key={i} className="hw-step">
                    <div className="hw-num">{s.n}</div>
                    <div><div className="hw-text">{s.t}</div><div className="hw-urdu">{s.u}</div></div>
                  </div>
                ))}
              </div>

              {/* Children status */}
              {CHILDREN.map(child => {
                const s = childStates[child.id];
                const pStatus = getParentStatus(child);
                const sbClass = !s.boardedAt ? "sb-waiting" : !s.droppedAt ? "sb-onboard" : "sb-dropped";
                const canConfirm = !!s.droppedAt && !s.parentConfirmed;

                return (
                  <div key={child.id} className={`parent-child-card ${pStatus}`}>
                    <div className="pcc-header">
                      <div className="pcc-avatar">
                        <span style={{ fontSize: 28 }}>{child.emoji}</span>
                        <div className="pcc-ring" />
                      </div>
                      <div>
                        <div className="pcc-name">{child.name}</div>
                        <div className="pcc-school">{child.school}</div>
                      </div>
                      <div className="pcc-big-status">
                        <div className="pcc-status-icon">
                          {!s.boardedAt ? "⏳" : !s.droppedAt ? "🚌" : s.parentConfirmed ? "✅" : "🏫"}
                        </div>
                        <div className="pcc-status-text" style={{ color: !s.boardedAt ? "var(--muted)" : !s.droppedAt ? "var(--gold)" : "var(--em)" }}>
                          {!s.boardedAt ? "Waiting" : !s.droppedAt ? "On Way" : "At School"}
                        </div>
                      </div>
                    </div>

                    {/* Status box */}
                    <div className={`status-box ${sbClass}`}>
                      <div className="sb-ico">
                        {!s.boardedAt ? "🏠" : !s.droppedAt ? "🚌" : "🏫"}
                      </div>
                      <div className="sb-content">
                        <div className="sb-title">
                          {!s.boardedAt && "Waiting for pickup"}
                          {s.boardedAt && !s.droppedAt && `${child.name.split(" ")[0]} is on the van!`}
                          {s.droppedAt && `${child.name.split(" ")[0]} arrived at school!`}
                        </div>
                        <div className="sb-desc">
                          {!s.boardedAt && "Ahmad will pick up shortly · انتظار کریں"}
                          {s.boardedAt && !s.droppedAt && `Boarded at ${s.boardedAt} · En route to Beaconhouse`}
                          {s.droppedAt && `Dropped at ${s.droppedAt} · Please confirm below`}
                        </div>
                        <div className="sb-urdu">
                          {!s.boardedAt && "بچہ ابھی گھر پر ہے"}
                          {s.boardedAt && !s.droppedAt && "بچہ گاڑی میں ہے، اسکول جا رہا ہے 🚌"}
                          {s.droppedAt && "بچہ اسکول پہنچ گیا — تصدیق کریں ✅"}
                        </div>
                      </div>
                    </div>

                    {/* Parent confirm section */}
                    <div className="parent-confirm-section">
                      <div className="confirm-header">
                        {s.droppedAt ? "✋ Please confirm your child arrived · تصدیق کریں" : "Waiting for driver update..."}
                      </div>

                      <button
                        className={`parent-confirm-btn ${!s.droppedAt ? "pcb-waiting" : s.parentConfirmed ? "pcb-confirmed" : "pcb-confirm"}`}
                        onClick={() => canConfirm && handleParentConfirm(child)}
                        disabled={!canConfirm}
                      >
                        <span className="pcb-ico">
                          {!s.droppedAt ? "🔒" : s.parentConfirmed ? "✅" : "👆"}
                        </span>
                        {!s.droppedAt && "Waiting for driver to drop off · ڈرائیور کا انتظار"}
                        {s.droppedAt && !s.parentConfirmed && `Yes, ${child.name.split(" ")[0]} arrived safely — تصدیق`}
                        {s.parentConfirmed && `✅ Confirmed by ${child.parent} at ${s.parentConfirmedAt}`}
                      </button>

                      {/* Dual confirm status */}
                      {s.droppedAt && (
                        <div className="dual-confirm-row">
                          <div className={`dc-item ${s.droppedAt ? "confirmed" : ""}`}>
                            <div className="dc-who">🚐 Driver</div>
                            <div className="dc-ico">{s.droppedAt ? "✅" : "⏳"}</div>
                            <div className="dc-status">{s.droppedAt ? "Confirmed Drop" : "Not yet"}</div>
                            {s.droppedAt && <div className="dc-time">{s.droppedAt}</div>}
                          </div>
                          <div className={`dc-item ${s.parentConfirmed ? "confirmed" : ""}`}>
                            <div className="dc-who">👩 Parent</div>
                            <div className="dc-ico">{s.parentConfirmed ? "✅" : "⏳"}</div>
                            <div className="dc-status">{s.parentConfirmed ? "Confirmed Safe" : "Tap to confirm"}</div>
                            {s.parentConfirmedAt && <div className="dc-time">{s.parentConfirmedAt}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* All confirmed */}
              {allConfirmed && (
                <div className="summary-card">
                  <div className="sc-title">🎉 All Children Confirmed Safe!</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, fontFamily: "'Noto Nastaliq Urdu',serif", direction: "rtl" }}>
                    تمام بچے محفوظ پہنچ گئے — الحمدللہ
                  </div>
                  {CHILDREN.map(c => (
                    <div key={c.id} className="sc-row">
                      <span className="sc-label">{c.emoji} {c.name}</span>
                      <span className="sc-val">Both ✓ {childStates[c.id].parentConfirmedAt}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Event log on parent side */}
              <div className="event-log">
                <div className="el-title">📲 Your Notifications · اطلاعات</div>
                {logs.map((l, i) => (
                  <div key={i} className="el-item">
                    <div className={`el-dot ${l.dot}`} />
                    <div className="el-text">{l.text}</div>
                    <div className="el-time">{l.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
