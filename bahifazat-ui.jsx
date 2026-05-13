import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700;800&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');

:root {
  --ink:     #05080f;
  --deep:    #080e1c;
  --navy:    #0c1528;
  --card:    #0f1b30;
  --card2:   #111f36;
  --gold:    #e8a000;
  --gold2:   #ffc340;
  --gold3:   rgba(232,160,0,0.12);
  --emerald: #00c97a;
  --em2:     rgba(0,201,122,0.13);
  --sky:     #29a9ff;
  --sky2:    rgba(41,169,255,0.12);
  --red:     #ff3355;
  --red2:    rgba(255,51,85,0.14);
  --white:   #eef2ff;
  --muted:   #6b82aa;
  --dim:     #2a3a58;
  --border:  rgba(255,255,255,0.07);
  --glass:   rgba(255,255,255,0.035);
}

*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}

html{scroll-behavior:smooth}

body{
  font-family:'Outfit',sans-serif;
  background:var(--ink);
  color:var(--white);
  overflow-x:hidden;
  min-height:100vh;
}

/* ─── SCROLLBAR ─── */
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--deep)}
::-webkit-scrollbar-thumb{background:var(--dim);border-radius:4px}

/* ─── NAV ─── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:200;
  height:64px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 28px;
  background:rgba(5,8,15,0.75);
  backdrop-filter:blur(24px);
  border-bottom:1px solid var(--border);
  transition:background 0.3s;
}
.nav-logo{
  font-family:'Cormorant Garamond',serif;
  font-size:26px;font-weight:700;
  color:var(--gold);
  display:flex;align-items:center;gap:10px;
  cursor:pointer;
  letter-spacing:-0.02em;
}
.nav-logo em{color:var(--white);font-style:normal}
.nav-logo .shield{
  width:34px;height:34px;
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  font-size:17px;
  box-shadow:0 0 20px rgba(232,160,0,0.4);
  animation:shieldGlow 3s ease infinite;
}
@keyframes shieldGlow{
  0%,100%{box-shadow:0 0 20px rgba(232,160,0,0.4);}
  50%{box-shadow:0 0 35px rgba(232,160,0,0.7);}
}

.nav-pills{
  display:flex;gap:3px;
  background:rgba(255,255,255,0.04);
  border:1px solid var(--border);
  border-radius:14px;padding:4px;
}
.np{
  padding:8px 18px;border-radius:10px;border:none;
  font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;
  cursor:pointer;transition:all 0.25s;
  color:var(--muted);background:transparent;
  display:flex;align-items:center;gap:6px;
}
.np:hover{color:var(--white);background:rgba(255,255,255,0.06)}
.np.on{background:var(--gold);color:var(--ink);font-weight:700;box-shadow:0 2px 14px rgba(232,160,0,0.35)}

.nav-actions{display:flex;gap:8px}
.btn-ghost{
  padding:9px 18px;border-radius:10px;
  border:1px solid var(--border);background:var(--glass);
  color:var(--white);font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;
  cursor:pointer;transition:all 0.2s;
}
.btn-ghost:hover{background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.15)}
.btn-gold{
  padding:9px 20px;border-radius:10px;border:none;
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  color:var(--ink);font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;
  cursor:pointer;transition:all 0.25s;
  box-shadow:0 4px 20px rgba(232,160,0,0.3);
}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(232,160,0,0.45)}
.btn-gold:active{transform:translateY(0)}

/* ─── PAGE TRANSITIONS ─── */
.page{
  padding-top:64px;min-height:100vh;
  animation:pageIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes pageIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}

/* ─── LANDING ─── */
.landing{padding-top:0}

.hero{
  min-height:100vh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:100px 24px 60px;
  position:relative;overflow:hidden;
  text-align:center;
}

#three-canvas{
  position:absolute;inset:0;
  z-index:0;
  pointer-events:none;
}

.hero-content{position:relative;z-index:1}

.hero-pill{
  display:inline-flex;align-items:center;gap:9px;
  background:rgba(232,160,0,0.1);
  border:1px solid rgba(232,160,0,0.3);
  border-radius:100px;padding:7px 18px;
  font-size:12px;font-weight:700;color:var(--gold);
  letter-spacing:0.07em;text-transform:uppercase;
  margin-bottom:32px;
  animation:fadeUp 0.7s 0.1s ease both;
}
.live-dot{
  width:7px;height:7px;border-radius:50%;background:var(--emerald);
  animation:livePulse 1.4s infinite;
}
@keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.6)}}

.hero-title{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(48px,8vw,96px);
  font-weight:700;line-height:1.02;
  margin-bottom:16px;
  animation:fadeUp 0.7s 0.2s ease both;
  letter-spacing:-0.02em;
}
.hero-title .g{
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.hero-title .w{color:var(--white)}
.hero-title .sub{
  display:block;
  font-size:0.52em;color:var(--muted);
  font-weight:600;margin-top:6px;
  font-family:'Outfit',sans-serif;
  letter-spacing:0;
}

.hero-urdu{
  font-family:'Noto Nastaliq Urdu',serif;
  font-size:clamp(18px,3vw,26px);
  color:rgba(232,160,0,0.7);
  direction:rtl;margin-bottom:20px;
  animation:fadeUp 0.7s 0.3s ease both;
}

.hero-desc{
  font-size:clamp(15px,2vw,18px);
  color:var(--muted);max-width:540px;line-height:1.8;
  margin:0 auto 44px;
  animation:fadeUp 0.7s 0.4s ease both;
}

.hero-btns{
  display:flex;gap:14px;flex-wrap:wrap;justify-content:center;
  animation:fadeUp 0.7s 0.5s ease both;
  margin-bottom:64px;
}

.hbtn{
  display:flex;flex-direction:column;align-items:center;gap:6px;
  padding:20px 36px;border-radius:20px;border:none;
  cursor:pointer;transition:all 0.3s;
  font-family:'Outfit',sans-serif;
  position:relative;overflow:hidden;
  min-width:160px;
}
.hbtn::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(transparent,rgba(255,255,255,0.06));
  opacity:0;transition:opacity 0.3s;
}
.hbtn:hover::before{opacity:1}
.hbtn-icon{font-size:32px;margin-bottom:2px}
.hbtn-text{font-size:16px;font-weight:700}
.hbtn-sub{font-size:11px;opacity:0.7;font-weight:400}
.hbtn.parent{
  background:linear-gradient(135deg,#0d2040,#162d55);
  border:2px solid rgba(41,169,255,0.35);
  box-shadow:0 8px 32px rgba(41,169,255,0.15);
  color:var(--white);
}
.hbtn.parent:hover{transform:translateY(-4px) scale(1.02);box-shadow:0 16px 44px rgba(41,169,255,0.25)}
.hbtn.driver{
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  color:var(--ink);
  box-shadow:0 8px 32px rgba(232,160,0,0.3);
}
.hbtn.driver:hover{transform:translateY(-4px) scale(1.02);box-shadow:0 16px 44px rgba(232,160,0,0.45)}
.hbtn.admin{
  background:linear-gradient(135deg,#0a1f15,#0f2d1e);
  border:2px solid rgba(0,201,122,0.3);
  color:var(--white);
  box-shadow:0 8px 32px rgba(0,201,122,0.12);
}
.hbtn.admin:hover{transform:translateY(-4px) scale(1.02);box-shadow:0 16px 44px rgba(0,201,122,0.22)}

/* Stats bar */
.stats-bar{
  display:flex;
  background:rgba(255,255,255,0.03);
  border:1px solid var(--border);
  border-radius:20px;overflow:hidden;
  animation:fadeUp 0.7s 0.6s ease both;
}
.sbar-item{
  flex:1;padding:22px 24px;
  border-right:1px solid var(--border);
  text-align:center;
  position:relative;overflow:hidden;
  transition:background 0.25s;
  cursor:default;
}
.sbar-item:last-child{border-right:none}
.sbar-item:hover{background:rgba(255,255,255,0.03)}
.sbar-item::before{
  content:'';position:absolute;
  top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--gold),var(--gold2));
  transform:scaleX(0);transform-origin:left;
  transition:transform 0.4s ease;
}
.sbar-item:hover::before{transform:scaleX(1)}
.sbar-num{
  font-family:'Cormorant Garamond',serif;
  font-size:30px;font-weight:700;
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.sbar-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-top:4px}

/* Features */
.section{padding:88px 24px;max-width:1160px;margin:0 auto}
.sec-kicker{
  font-size:11px;font-weight:700;letter-spacing:0.14em;
  text-transform:uppercase;color:var(--gold);
  margin-bottom:12px;display:flex;align-items:center;gap:10px;
}
.sec-kicker::before{content:'';width:28px;height:2px;background:var(--gold);border-radius:2px}
.sec-h{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(30px,4vw,48px);font-weight:700;
  margin-bottom:52px;max-width:520px;line-height:1.1;
}

.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.feat-card{
  background:var(--card);border:1px solid var(--border);
  border-radius:24px;padding:30px;
  transition:all 0.35s cubic-bezier(0.22,1,0.36,1);
  cursor:default;position:relative;overflow:hidden;
  group:true;
}
.feat-card::after{
  content:'';position:absolute;inset:0;border-radius:24px;
  background:radial-gradient(circle at 50% 0%,rgba(232,160,0,0.07),transparent 65%);
  opacity:0;transition:opacity 0.35s;
}
.feat-card:hover{
  border-color:rgba(232,160,0,0.22);
  transform:translateY(-6px);
  box-shadow:0 20px 60px rgba(0,0,0,0.4);
}
.feat-card:hover::after{opacity:1}
.feat-ico{
  width:56px;height:56px;border-radius:16px;
  display:flex;align-items:center;justify-content:center;
  font-size:26px;margin-bottom:22px;
  position:relative;z-index:1;
  transition:transform 0.3s;
}
.feat-card:hover .feat-ico{transform:scale(1.1) rotate(-3deg)}
.ico-g{background:var(--gold3)} .ico-e{background:var(--em2)}
.ico-s{background:var(--sky2)} .ico-r{background:var(--red2)}
.feat-title{font-size:18px;font-weight:700;margin-bottom:8px;position:relative;z-index:1}
.feat-desc{font-size:13.5px;color:var(--muted);line-height:1.7;position:relative;z-index:1}

/* How it works */
.how-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0}
.how-step{
  padding:36px 28px;position:relative;
  border-right:1px solid var(--border);
  transition:background 0.3s;
}
.how-step:last-child{border-right:none}
.how-step:hover{background:rgba(255,255,255,0.02)}
.how-num{
  font-family:'Cormorant Garamond',serif;
  font-size:72px;font-weight:700;
  color:rgba(232,160,0,0.08);
  line-height:1;margin-bottom:16px;
}
.how-ico{font-size:36px;margin-bottom:14px}
.how-title{font-size:17px;font-weight:700;margin-bottom:8px}
.how-desc{font-size:13px;color:var(--muted);line-height:1.65}
.how-connector{
  position:absolute;right:-12px;top:50%;
  transform:translateY(-50%);
  width:24px;height:24px;border-radius:50%;
  background:var(--gold3);border:1px solid rgba(232,160,0,0.3);
  display:flex;align-items:center;justify-content:center;
  font-size:10px;color:var(--gold);z-index:1;
}

@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}

/* ─── PARENT DASHBOARD ─── */
.p-dash{display:grid;grid-template-columns:72px 1fr;min-height:calc(100vh - 64px)}

/* Icon sidebar */
.icon-rail{
  background:var(--deep);
  border-right:1px solid var(--border);
  display:flex;flex-direction:column;align-items:center;
  padding:16px 0;gap:4px;
}
.rail-item{
  width:52px;height:52px;border-radius:14px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;cursor:pointer;transition:all 0.2s;border:none;background:transparent;
  position:relative;
}
.rail-item:hover{background:var(--glass)}
.rail-item.on{background:var(--gold3);color:var(--gold)}
.rail-item.on .ri-ico{color:var(--gold)}
.ri-ico{font-size:20px;line-height:1}
.ri-label{font-size:8px;color:var(--muted);font-weight:600;letter-spacing:0.04em;font-family:'Outfit',sans-serif}
.rail-item.on .ri-label{color:var(--gold)}
.rail-badge{
  position:absolute;top:6px;right:6px;
  width:16px;height:16px;border-radius:50%;
  background:var(--red);color:white;
  font-size:9px;font-weight:800;
  display:flex;align-items:center;justify-content:center;
  border:2px solid var(--deep);
}

.dash-body{padding:24px;overflow-y:auto;max-height:calc(100vh - 64px)}

.dash-top{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:24px;
  background:var(--card);border:1px solid var(--border);
  border-radius:20px;padding:20px 24px;
  animation:fadeUp 0.5s ease both;
}
.dash-greet-big{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(22px,3vw,30px);font-weight:700;
}
.dash-greet-big span{color:var(--gold)}
.dash-date{font-size:12px;color:var(--muted);margin-top:3px}
.dash-top-right{display:flex;gap:10px;align-items:center}
.icon-btn{
  width:44px;height:44px;border-radius:12px;
  background:var(--glass);border:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;
  font-size:18px;cursor:pointer;transition:all 0.2s;
  position:relative;
}
.icon-btn:hover{background:rgba(255,255,255,0.07)}
.ibadge{position:absolute;top:7px;right:7px;width:7px;height:7px;border-radius:50%;background:var(--red);border:2px solid var(--deep)}

/* Child hero card */
.child-hero{
  background:linear-gradient(135deg,#0d2040 0%,#0c1a35 100%);
  border:1px solid rgba(41,169,255,0.2);
  border-radius:24px;padding:24px;
  margin-bottom:18px;
  display:flex;align-items:center;gap:20px;
  position:relative;overflow:hidden;
  animation:fadeUp 0.5s 0.1s ease both;
}
.child-hero::before{
  content:'';position:absolute;
  right:-40px;top:-40px;
  width:200px;height:200px;
  background:radial-gradient(circle,rgba(41,169,255,0.08),transparent 70%);
}
.child-avatar-wrap{position:relative}
.child-avatar-big{
  width:72px;height:72px;border-radius:50%;
  background:linear-gradient(135deg,#1e3a70,#0f2050);
  border:3px solid rgba(41,169,255,0.4);
  display:flex;align-items:center;justify-content:center;font-size:32px;
  position:relative;z-index:1;
}
.child-status-ring{
  position:absolute;inset:-4px;border-radius:50%;
  border:2px solid var(--emerald);
  animation:statusRing 2s ease infinite;
}
@keyframes statusRing{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.05)}}
.child-name-big{font-size:20px;font-weight:700;margin-bottom:4px}
.child-school{font-size:13px;color:var(--muted);margin-bottom:10px}
.child-chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{
  padding:5px 12px;border-radius:100px;font-size:11px;font-weight:700;
  display:flex;align-items:center;gap:5px;
}
.chip.em{background:var(--em2);color:var(--emerald);border:1px solid rgba(0,201,122,0.3)}
.chip.sk{background:var(--sky2);color:var(--sky);border:1px solid rgba(41,169,255,0.3)}
.chip.gd{background:var(--gold3);color:var(--gold);border:1px solid rgba(232,160,0,0.3)}

/* Big stat cards */
.stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px;animation:fadeUp 0.5s 0.2s ease both}
.big-stat{
  border-radius:20px;padding:22px;
  border:1px solid var(--border);
  position:relative;overflow:hidden;
  transition:all 0.3s;cursor:default;
}
.big-stat:hover{transform:translateY(-3px)}
.big-stat.trip{background:linear-gradient(135deg,rgba(0,201,122,0.12),rgba(0,201,122,0.05));border-color:rgba(0,201,122,0.25)}
.big-stat.eta{background:var(--card);} 
.big-stat.pay{background:linear-gradient(135deg,rgba(232,160,0,0.1),rgba(232,160,0,0.04));border-color:rgba(232,160,0,0.22)}
.bstat-ico{font-size:28px;margin-bottom:10px}
.bstat-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em}
.bstat-val{
  font-family:'Cormorant Garamond',serif;
  font-size:30px;font-weight:700;margin:4px 0 2px;
}
.big-stat.trip .bstat-val{color:var(--emerald)}
.big-stat.pay .bstat-val{color:var(--gold)}
.bstat-sub{font-size:11px;color:var(--muted)}
.bstat-badge{
  position:absolute;top:14px;right:14px;
  padding:4px 10px;border-radius:100px;font-size:10px;font-weight:700;
}
.bb-em{background:var(--em2);color:var(--emerald)}
.bb-gd{background:var(--gold3);color:var(--gold)}

/* Two-col layout */
.two-col{display:grid;grid-template-columns:1fr 320px;gap:16px;animation:fadeUp 0.5s 0.3s ease both}
.col-left,.col-right{display:flex;flex-direction:column;gap:16px}

/* Map card */
.map-card{
  background:var(--card);border:1px solid var(--border);
  border-radius:24px;overflow:hidden;
  box-shadow:0 8px 40px rgba(0,0,0,0.3);
}
.map-header{
  padding:16px 20px;display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid var(--border);
  background:var(--card2);
}
.map-title-row{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:700}
.live-chip{
  display:flex;align-items:center;gap:5px;
  background:var(--em2);border:1px solid rgba(0,201,122,0.35);
  border-radius:100px;padding:3px 10px;font-size:10px;font-weight:800;color:var(--emerald);
  letter-spacing:0.06em;
}
.map-area{height:280px;position:relative;background:#060e1a;overflow:hidden}

/* Map road grid */
.mr{position:absolute;background:rgba(255,255,255,0.045)}
.mr.h{left:0;right:0;height:1px}
.mr.v{top:0;bottom:0;width:1px}
.mr.thick{height:2px;background:rgba(255,255,255,0.08)}
.mr.thickv{width:2px;background:rgba(255,255,255,0.08)}
.map-glow{
  position:absolute;inset:0;
  background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(41,169,255,0.05),transparent 70%);
}
.mlb{
  position:absolute;font-size:8px;color:rgba(255,255,255,0.15);
  font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
  font-family:'Outfit',sans-serif;
}
.route-path{
  position:absolute;pointer-events:none;
  border-top:2px dashed rgba(0,201,122,0.4);
  transform-origin:left;
}

/* Markers */
.mkr{
  position:absolute;transform:translate(-50%,-50%);
  display:flex;flex-direction:column;align-items:center;
  transition:left 2.8s cubic-bezier(0.22,1,0.36,1),top 2.8s cubic-bezier(0.22,1,0.36,1);
}
.van-bubble{
  width:40px;height:40px;border-radius:50%;
  background:linear-gradient(135deg,var(--emerald),#00a862);
  border:3px solid rgba(255,255,255,0.9);
  display:flex;align-items:center;justify-content:center;font-size:18px;
  box-shadow:0 4px 20px rgba(0,201,122,0.5);
  animation:vanPulse 2s ease infinite;
}
@keyframes vanPulse{
  0%,100%{box-shadow:0 4px 20px rgba(0,201,122,0.5),0 0 0 0 rgba(0,201,122,0.4)}
  50%{box-shadow:0 4px 20px rgba(0,201,122,0.5),0 0 0 16px rgba(0,201,122,0)}
}
.home-bubble{
  width:32px;height:32px;border-radius:10px;
  background:linear-gradient(135deg,var(--sky),#1a8cd8);
  border:2px solid rgba(255,255,255,0.8);
  display:flex;align-items:center;justify-content:center;font-size:14px;
  box-shadow:0 4px 14px rgba(41,169,255,0.4);
}
.school-bubble{
  width:32px;height:32px;border-radius:10px;
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  border:2px solid rgba(255,255,255,0.8);
  display:flex;align-items:center;justify-content:center;font-size:14px;
  box-shadow:0 4px 14px rgba(232,160,0,0.4);
}
.mkr-tag{
  margin-top:5px;
  background:rgba(5,8,15,0.85);
  border:1px solid var(--border);backdrop-filter:blur(8px);
  border-radius:7px;padding:3px 9px;
  font-size:9px;font-weight:700;white-space:nowrap;
  font-family:'Outfit',sans-serif;
}
.map-bar{
  padding:14px 20px;display:flex;gap:20px;
  border-top:1px solid var(--border);background:var(--card2);
  flex-wrap:wrap;
}
.mbar-i{font-size:12px;color:var(--muted);display:flex;align-items:center;gap:6px}
.mbar-i strong{color:var(--white)}
.mbar-i .em{color:var(--emerald)}

/* Trip timeline */
.timeline-card{
  background:var(--card);border:1px solid var(--border);
  border-radius:24px;padding:22px;
}
.tl-title{font-size:14px;font-weight:700;margin-bottom:18px;display:flex;align-items:center;gap:8px}
.tl-step{display:flex;align-items:flex-start;gap:14px;padding:11px 0;position:relative}
.tl-step:not(:last-child)::after{
  content:'';position:absolute;left:15px;top:38px;width:2px;
  height:calc(100% - 14px);
}
.tl-step.done::after{background:linear-gradient(to bottom,var(--emerald),rgba(0,201,122,0.3))}
.tl-step.curr::after{background:linear-gradient(to bottom,var(--gold),rgba(232,160,0,0.15))}
.tl-step.pend::after{background:var(--dim)}
.tl-circle{
  width:30px;height:30px;border-radius:50%;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-size:12px;
  font-weight:800;border:2px solid var(--dim);
}
.tl-step.done .tl-circle{background:var(--emerald);border-color:var(--emerald);color:var(--ink);font-size:14px}
.tl-step.curr .tl-circle{
  background:var(--gold3);border-color:var(--gold);color:var(--gold);
  animation:currGlow 1.6s ease infinite;
}
@keyframes currGlow{0%,100%{box-shadow:0 0 0 0 rgba(232,160,0,0.4)}60%{box-shadow:0 0 0 8px rgba(232,160,0,0)}}
.tl-step.pend .tl-circle{background:transparent;color:var(--muted)}
.tl-info{flex:1}
.tl-name{font-size:13px;font-weight:700}
.tl-step.done .tl-name{color:var(--emerald)}
.tl-step.curr .tl-name{color:var(--gold)}
.tl-step.pend .tl-name{color:var(--muted)}
.tl-time{font-size:11px;color:var(--muted);margin-top:2px}

/* Driver card */
.driver-card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:22px}
.drv-row{display:flex;align-items:center;gap:16px;margin-bottom:16px}
.drv-av{
  width:56px;height:56px;border-radius:50%;
  background:linear-gradient(135deg,#1e3a6e,#0f2050);
  border:2px solid rgba(41,169,255,0.35);
  display:flex;align-items:center;justify-content:center;font-size:24px;
}
.drv-name{font-size:16px;font-weight:700}
.drv-vehicle{font-size:11px;color:var(--muted);margin-top:3px}
.drv-rating{
  margin-left:auto;
  background:var(--gold3);border:1px solid rgba(232,160,0,0.3);
  padding:5px 12px;border-radius:100px;
  font-size:14px;font-weight:800;color:var(--gold);
}
.drv-badges{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.drv-badge{
  padding:5px 11px;border-radius:8px;font-size:11px;font-weight:700;
  display:flex;align-items:center;gap:5px;
}
.db-em{background:var(--em2);color:var(--emerald);border:1px solid rgba(0,201,122,0.25)}
.db-gd{background:var(--gold3);color:var(--gold);border:1px solid rgba(232,160,0,0.25)}
.drv-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.dact{
  padding:12px 8px;border-radius:14px;border:1px solid var(--border);
  background:var(--glass);color:var(--white);font-family:'Outfit',sans-serif;
  font-size:12px;font-weight:700;cursor:pointer;transition:all 0.25s;
  display:flex;flex-direction:column;align-items:center;gap:5px;
}
.dact-ico{font-size:20px}
.dact:hover{background:var(--card2);transform:translateY(-2px)}
.dact.call{border-color:rgba(0,201,122,0.3)}
.dact.call:hover{background:var(--em2);color:var(--emerald)}

/* BIG SOS */
.sos-card{
  background:linear-gradient(135deg,rgba(255,51,85,0.12),rgba(255,51,85,0.06));
  border:1px solid rgba(255,51,85,0.25);
  border-radius:24px;padding:22px;
  text-align:center;
}
.sos-mega{
  width:100%;padding:22px;border-radius:18px;border:none;
  background:linear-gradient(135deg,#cc0022,#ff1840);
  color:white;font-family:'Outfit',sans-serif;
  font-size:22px;font-weight:900;
  cursor:pointer;transition:all 0.25s;
  display:flex;align-items:center;justify-content:center;gap:12px;
  box-shadow:0 6px 32px rgba(255,51,85,0.45);
  animation:sosMegaPulse 2.5s ease infinite;
  letter-spacing:0.02em;
  position:relative;overflow:hidden;
}
.sos-mega::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(to right,transparent,rgba(255,255,255,0.08),transparent);
  transform:translateX(-100%);
  transition:transform 0s;
}
.sos-mega:hover::before{transform:translateX(100%);transition:transform 0.5s}
@keyframes sosMegaPulse{
  0%,100%{box-shadow:0 6px 32px rgba(255,51,85,0.45)}
  50%{box-shadow:0 6px 50px rgba(255,51,85,0.7)}
}
.sos-mega:hover{transform:scale(1.03)}
.sos-mega:active{transform:scale(0.98)}
.sos-icon-big{font-size:32px}
.sos-urdu{
  font-family:'Noto Nastaliq Urdu',serif;
  font-size:12px;color:rgba(255,100,120,0.7);
  direction:rtl;margin-top:10px;
}
.sos-info{font-size:11px;color:var(--muted);margin-top:6px}

/* Notifs */
.notif-card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:20px}
.ncard-title{font-size:13px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:7px}
.nitem{
  display:flex;gap:12px;padding:11px 0;
  border-bottom:1px solid var(--border);
}
.nitem:last-child{border-bottom:none;padding-bottom:0}
.nitem-ico{
  width:36px;height:36px;border-radius:10px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-size:16px;
}
.nitem-text{font-size:12px;font-weight:600;line-height:1.4}
.nitem-time{font-size:10px;color:var(--muted);margin-top:2px}

/* ─── DRIVER DASHBOARD ─── */
.drv-dash{min-height:calc(100vh - 64px)}
.drv-hero-bar{
  background:linear-gradient(135deg,#100f00,#1a1600);
  border-bottom:1px solid rgba(232,160,0,0.12);
  padding:24px 32px;
  display:flex;align-items:center;justify-content:space-between;
}
.drv-hero-left{}
.drv-name-big{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700}
.drv-name-big span{color:var(--gold)}
.drv-sub{font-size:12px;color:var(--muted);margin-top:4px}
.online-tog{
  display:flex;align-items:center;gap:10px;
  background:var(--glass);border:1px solid var(--border);
  border-radius:100px;padding:10px 20px;
  cursor:pointer;transition:all 0.3s;font-size:14px;font-weight:700;
  user-select:none;
}
.online-tog:hover{background:rgba(255,255,255,0.07)}
.online-tog.on{border-color:rgba(0,201,122,0.4);background:var(--em2);color:var(--emerald)}
.tog-indicator{width:10px;height:10px;border-radius:50%;transition:all 0.3s}
.tog-indicator.on{background:var(--emerald);box-shadow:0 0 10px rgba(0,201,122,0.7)}
.tog-indicator.off{background:var(--muted)}

.drv-content{padding:24px 28px;display:grid;grid-template-columns:1fr 300px;gap:18px}
.drv-left,.drv-right{display:flex;flex-direction:column;gap:16px}

/* Earnings card */
.earn-card{
  background:linear-gradient(135deg,#0f0c00,#1a1500);
  border:1px solid rgba(232,160,0,0.2);
  border-radius:24px;padding:28px;
  display:flex;justify-content:space-between;align-items:flex-end;
}
.earn-lbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px}
.earn-amount{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(36px,5vw,48px);font-weight:700;
  color:var(--gold);line-height:1;
}
.earn-pkr{font-size:18px;font-weight:600;margin-right:3px}
.earn-meta{font-size:12px;color:var(--muted);margin-top:6px}
.earn-meta span{color:var(--emerald)}
.bars-wrap{display:flex;align-items:flex-end;gap:5px;height:48px}
.bar-col{
  width:11px;border-radius:3px 3px 0 0;
  background:rgba(232,160,0,0.2);
  cursor:pointer;transition:all 0.25s;
  position:relative;
}
.bar-col:hover,.bar-col.peak{background:rgba(232,160,0,0.65)}
.bar-col::after{
  content:attr(data-val);position:absolute;
  top:-18px;left:50%;transform:translateX(-50%);
  font-size:8px;color:var(--gold);font-weight:700;
  opacity:0;transition:opacity 0.2s;white-space:nowrap;
}
.bar-col:hover::after{opacity:1}

/* Booking request card */
.req-card{
  background:var(--card);border:2px solid rgba(232,160,0,0.3);
  border-radius:24px;padding:24px;
  animation:reqIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
  position:relative;overflow:hidden;
}
.req-card::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(232,160,0,0.06),transparent 65%);
}
@keyframes reqIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
.req-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;position:relative;z-index:1}
.req-new{
  display:flex;align-items:center;gap:6px;
  background:var(--gold3);border:1px solid rgba(232,160,0,0.4);
  border-radius:100px;padding:5px 12px;
  font-size:11px;font-weight:800;color:var(--gold);
  animation:newPulse 1.2s ease infinite;
}
@keyframes newPulse{0%,100%{opacity:1}50%{opacity:0.65}}
.req-price-big{
  font-family:'Cormorant Garamond',serif;
  font-size:26px;font-weight:700;color:var(--gold);
}
.req-price-big span{font-size:14px;color:var(--muted);font-weight:400;font-family:'Outfit',sans-serif}
.req-parent{
  display:flex;align-items:center;gap:12px;padding:14px;
  background:rgba(255,255,255,0.03);border-radius:14px;
  margin-bottom:14px;position:relative;z-index:1;
}
.req-p-av{
  width:44px;height:44px;border-radius:50%;
  background:linear-gradient(135deg,#162a5c,#0d1a40);
  border:2px solid rgba(41,169,255,0.3);
  display:flex;align-items:center;justify-content:center;font-size:20px;
}
.req-p-name{font-size:14px;font-weight:700}
.req-p-info{font-size:11px;color:var(--muted);margin-top:2px}
.req-route{
  background:rgba(255,255,255,0.025);border-radius:14px;
  padding:14px;margin-bottom:16px;
  display:flex;flex-direction:column;gap:10px;
  position:relative;z-index:1;
}
.req-rt-line{
  position:absolute;left:22px;top:30px;bottom:28px;width:2px;
  background:linear-gradient(to bottom,var(--sky),var(--gold));
  opacity:0.4;
}
.req-rt{display:flex;align-items:center;gap:12px;font-size:13px;position:relative}
.rt-dot{
  width:10px;height:10px;border-radius:50%;flex-shrink:0;
  position:relative;z-index:1;
}
.rt-dot.p{background:var(--sky);box-shadow:0 0 8px rgba(41,169,255,0.6)}
.rt-dot.d{background:var(--gold);box-shadow:0 0 8px rgba(232,160,0,0.6)}
.req-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;position:relative;z-index:1}
.btn-accept{
  padding:16px;border-radius:16px;border:none;
  background:linear-gradient(135deg,var(--emerald),#00a862);
  color:var(--ink);font-family:'Outfit',sans-serif;
  font-size:15px;font-weight:800;cursor:pointer;transition:all 0.25s;
  display:flex;flex-direction:column;align-items:center;gap:3px;
}
.btn-accept:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,201,122,0.4)}
.btn-accept:active{transform:translateY(0)}
.btn-counter{
  padding:16px;border-radius:16px;
  border:1px solid rgba(232,160,0,0.4);
  background:var(--gold3);color:var(--gold);
  font-family:'Outfit',sans-serif;font-size:15px;font-weight:800;
  cursor:pointer;transition:all 0.25s;
  display:flex;flex-direction:column;align-items:center;gap:3px;
}
.btn-counter:hover{background:rgba(232,160,0,0.2);transform:translateY(-3px)}
.btn-counter:active{transform:translateY(0)}
.ba-ico{font-size:20px}
.ba-label{font-size:11px;opacity:0.7;font-weight:500}

/* Counter panel */
.counter-panel{
  background:rgba(255,255,255,0.025);border-radius:16px;padding:18px;
  margin-bottom:16px;position:relative;z-index:1;
}
.counter-row{display:flex;gap:10px;align-items:center}
.cnt-minus,.cnt-plus{
  width:44px;height:44px;border-radius:12px;
  border:1px solid var(--border);background:var(--glass);
  color:var(--white);font-size:22px;font-weight:300;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:all 0.2s;flex-shrink:0;
}
.cnt-minus:hover,.cnt-plus:hover{background:var(--card2);transform:scale(1.05)}
.cnt-display{
  flex:1;background:var(--card);border:1px solid rgba(232,160,0,0.3);
  border-radius:12px;padding:12px;text-align:center;
}
.cnt-display .val{
  font-family:'Cormorant Garamond',serif;
  font-size:26px;font-weight:700;color:var(--gold);
}
.cnt-display .lbl{font-size:10px;color:var(--muted)}

/* Trip control */
.trip-ctrl-card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:22px}
.trip-ctrl-hdr{display:flex;align-items:center;gap:12px;margin-bottom:20px}
.trip-status-ico{font-size:30px}
.trip-status-txt{font-size:16px;font-weight:700}
.trip-status-sub{font-size:12px;color:var(--muted);margin-top:2px}
.pax-list{
  background:rgba(255,255,255,0.025);border-radius:16px;
  padding:14px;margin-bottom:16px;
}
.pax-hdr{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;font-weight:700}
.pax-item{
  display:flex;align-items:center;gap:11px;
  padding:9px 0;border-bottom:1px solid var(--border);
}
.pax-item:last-child{border-bottom:none;padding-bottom:0}
.pax-av{
  width:34px;height:34px;border-radius:50%;
  background:linear-gradient(135deg,#1a2e5c,#0f1e40);
  display:flex;align-items:center;justify-content:center;font-size:15px;
}
.pax-name{font-size:13px;font-weight:600;flex:1}
.pax-status{
  padding:4px 10px;border-radius:100px;font-size:10px;font-weight:800;
  background:var(--em2);color:var(--emerald);
}
.trip-big-btn{
  width:100%;padding:18px;border-radius:18px;border:none;
  font-family:'Outfit',sans-serif;font-size:17px;font-weight:800;
  cursor:pointer;transition:all 0.25s;
  display:flex;align-items:center;justify-content:center;gap:10px;
}
.trip-big-btn.complete{
  background:linear-gradient(135deg,var(--emerald),#00a862);
  color:var(--ink);
  box-shadow:0 6px 24px rgba(0,201,122,0.35);
}
.trip-big-btn.complete:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(0,201,122,0.5)}

/* Stats small col */
.stats-sm{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:20px}
.stats-sm-title{font-size:13px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:7px}
.sm-stat{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)}
.sm-stat:last-child{border-bottom:none;padding-bottom:0}
.sm-stat-label{font-size:12px;color:var(--muted)}
.sm-stat-val{font-size:13px;font-weight:700}

/* ─── ADMIN DASHBOARD ─── */
.adm-dash{min-height:calc(100vh - 64px)}
.adm-bar{
  background:linear-gradient(135deg,#080f10,#0a1812);
  border-bottom:1px solid rgba(0,201,122,0.1);
  padding:22px 32px;display:flex;align-items:center;justify-content:space-between;
}
.adm-title-big{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700}
.adm-title-big span{color:var(--emerald)}
.adm-body{padding:22px 28px;display:flex;flex-direction:column;gap:18px}

.adm-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.kpi{
  background:var(--card);border:1px solid var(--border);
  border-radius:20px;padding:22px;
  transition:all 0.3s;cursor:default;position:relative;overflow:hidden;
}
.kpi:hover{transform:translateY(-3px)}
.kpi::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  border-radius:3px 3px 0 0;
}
.kpi.em::before{background:linear-gradient(90deg,var(--emerald),transparent)}
.kpi.gd::before{background:linear-gradient(90deg,var(--gold),transparent)}
.kpi.sk::before{background:linear-gradient(90deg,var(--sky),transparent)}
.kpi.rd::before{background:linear-gradient(90deg,var(--red),transparent)}
.kpi-num{
  font-family:'Cormorant Garamond',serif;
  font-size:38px;font-weight:700;line-height:1;margin-bottom:6px;
}
.kpi.em .kpi-num{color:var(--emerald)} .kpi.gd .kpi-num{color:var(--gold)}
.kpi.sk .kpi-num{color:var(--sky)} .kpi.rd .kpi-num{color:var(--red)}
.kpi-label{font-size:11px;color:var(--muted);font-weight:600}
.kpi-change{font-size:12px;font-weight:700;margin-top:7px}
.kpi.em .kpi-change{color:var(--emerald)} .kpi.gd .kpi-change{color:var(--gold)}
.kpi.sk .kpi-change{color:var(--sky)} .kpi.rd .kpi-change{color:var(--red)}

.sos-alert-mega{
  background:rgba(255,51,85,0.07);
  border:1.5px solid rgba(255,51,85,0.4);
  border-radius:20px;padding:20px 24px;
  display:flex;align-items:center;gap:18px;
  animation:megaAlert 2s ease infinite;
}
@keyframes megaAlert{0%,100%{border-color:rgba(255,51,85,0.4)}50%{border-color:rgba(255,51,85,0.8)}}
.sos-siren{font-size:36px;animation:sirenShake 0.5s ease infinite}
@keyframes sirenShake{0%,100%{transform:rotate(0)}25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}}
.sos-alert-info{flex:1}
.sos-title{font-size:17px;font-weight:800;color:var(--red);margin-bottom:4px}
.sos-detail{font-size:12px;color:var(--muted)}
.btn-respond{
  padding:14px 28px;border-radius:14px;border:none;
  background:linear-gradient(135deg,var(--red),#cc0022);
  color:white;font-family:'Outfit',sans-serif;font-size:15px;font-weight:800;
  cursor:pointer;transition:all 0.25s;
  box-shadow:0 4px 20px rgba(255,51,85,0.4);
  white-space:nowrap;
}
.btn-respond:hover{transform:translateY(-2px) scale(1.05);box-shadow:0 8px 28px rgba(255,51,85,0.6)}

.adm-two{display:grid;grid-template-columns:1fr 320px;gap:16px}
.adm-left,.adm-right{display:flex;flex-direction:column;gap:16px}

/* City map */
.city-card{background:var(--card);border:1px solid var(--border);border-radius:24px;overflow:hidden}
.city-hdr{padding:16px 20px;border-bottom:1px solid var(--border);background:var(--card2);display:flex;align-items:center;justify-content:space-between}
.city-hdr-title{font-size:14px;font-weight:700;display:flex;align-items:center;gap:8px}
.city-map-body{height:240px;position:relative;background:#040a14;overflow:hidden}
.van-node{
  position:absolute;transform:translate(-50%,-50%);
  width:11px;height:11px;border-radius:50%;
  background:var(--emerald);border:2px solid rgba(0,201,122,0.5);
  animation:vanNode 3.5s ease infinite;
  cursor:pointer;transition:transform 0.2s;
}
.van-node:hover{transform:translate(-50%,-50%) scale(1.6)}
@keyframes vanNode{0%,100%{box-shadow:0 0 0 0 rgba(0,201,122,0.5)}60%{box-shadow:0 0 0 9px rgba(0,201,122,0)}}
.sos-node{
  position:absolute;transform:translate(-50%,-50%);
  width:14px;height:14px;border-radius:50%;
  background:var(--red);
  animation:sosNode 0.9s ease infinite;
  cursor:pointer;
}
@keyframes sosNode{0%,100%{box-shadow:0 0 0 0 rgba(255,51,85,0.7)}50%{box-shadow:0 0 0 12px rgba(255,51,85,0)}}
.city-legend{
  position:absolute;bottom:10px;right:10px;
  background:rgba(4,10,20,0.85);backdrop-filter:blur(8px);
  border:1px solid var(--border);border-radius:10px;padding:8px 12px;
  display:flex;flex-direction:column;gap:5px;font-size:9px;
}
.legend-item{display:flex;align-items:center;gap:6px}
.legend-dot{width:8px;height:8px;border-radius:50%}

/* Revenue */
.rev-card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:20px}
.rev-title{font-size:13px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:7px}
.rev-item{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border)}
.rev-item:last-child{border-bottom:none;padding-bottom:0}
.rev-label{font-size:12px;color:var(--muted)}
.rev-val{font-size:13px;font-weight:700}

/* Users table */
.users-card{background:var(--card);border:1px solid var(--border);border-radius:24px;overflow:hidden}
.users-hdr{
  padding:16px 20px;border-bottom:1px solid var(--border);
  background:var(--card2);display:flex;align-items:center;justify-content:space-between;
}
.users-hdr-title{font-size:14px;font-weight:700}
.search-bar{
  background:rgba(255,255,255,0.04);border:1px solid var(--border);
  border-radius:10px;padding:8px 14px;color:var(--white);
  font-family:'Outfit',sans-serif;font-size:12px;outline:none;width:200px;
}
.search-bar::placeholder{color:var(--muted)}
.search-bar:focus{border-color:rgba(0,201,122,0.3)}
.tbl-head{
  display:grid;grid-template-columns:44px 1fr 110px 100px 80px;
  gap:12px;padding:10px 20px;border-bottom:1px solid var(--border);
  font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;font-weight:700;
}
.tbl-row{
  display:grid;grid-template-columns:44px 1fr 110px 100px 80px;
  gap:12px;padding:13px 20px;border-bottom:1px solid var(--border);
  font-size:12px;transition:background 0.2s;align-items:center;cursor:default;
}
.tbl-row:hover{background:rgba(255,255,255,0.02)}
.tbl-row:last-child{border-bottom:none}
.row-av{
  width:36px;height:36px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:800;
}
.badge{padding:4px 10px;border-radius:100px;font-size:10px;font-weight:700;display:inline-block}
.b-parent{background:var(--sky2);color:var(--sky);border:1px solid rgba(41,169,255,0.25)}
.b-driver{background:var(--gold3);color:var(--gold);border:1px solid rgba(232,160,0,0.25)}
.b-verified{background:var(--em2);color:var(--emerald);border:1px solid rgba(0,201,122,0.25)}
.b-pending{background:rgba(255,200,0,0.1);color:#ffcc00;border:1px solid rgba(255,200,0,0.25)}

/* ─── UTILITIES ─── */
.glass-card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:20px}
.section-header{font-size:13px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:7px}

@media(max-width:920px){
  .p-dash,.two-col,.drv-content,.adm-two{grid-template-columns:1fr}
  .icon-rail{display:none}
  .adm-kpis{grid-template-columns:repeat(2,1fr)}
  .stat-row{grid-template-columns:1fr 1fr}
  .nav-actions{display:none}
  .stats-bar{flex-wrap:wrap}
  .drv-hero-bar,.adm-bar{flex-direction:column;gap:14px;align-items:flex-start}
}
`;

/* ─── THREE.JS BACKGROUND ─── */
function ThreeBackground() {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 2000);
    camera.position.set(0, 0, 180);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    /* Particles */
    const count = 280;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const goldc = new THREE.Color("#e8a000");
    const bluec = new THREE.Color("#29a9ff");
    const greenc = new THREE.Color("#00c97a");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 320;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
      const choice = Math.random();
      const c = choice < 0.5 ? goldc : choice < 0.75 ? bluec : greenc;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: 1.6, vertexColors: true, transparent: true, opacity: 0.7 });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* Connection lines */
    const lineMat = new THREE.LineBasicMaterial({ color: 0xe8a000, transparent: true, opacity: 0.06 });
    for (let i = 0; i < 40; i++) {
      const a = Math.floor(Math.random() * count);
      const b = Math.floor(Math.random() * count);
      const lg = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2]),
        new THREE.Vector3(positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]),
      ]);
      scene.add(new THREE.Line(lg, lineMat));
    }

    /* Floating rings */
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(20 + i * 18, 0.3, 8, 60),
        new THREE.MeshBasicMaterial({ color: i === 0 ? 0xe8a000 : i === 1 ? 0x29a9ff : 0x00c97a, transparent: true, opacity: 0.12 + i * 0.04 })
      );
      ring.rotation.x = Math.PI * (0.3 + i * 0.2);
      ring.rotation.y = Math.PI * i * 0.15;
      ring.position.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 50, -60);
      scene.add(ring);
    }

    let t = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.003;
      points.rotation.y = t * 0.08;
      points.rotation.x = Math.sin(t * 0.04) * 0.1;
      mat.opacity = 0.55 + Math.sin(t) * 0.15;
      scene.children.forEach((obj, idx) => {
        if (obj.type === "Mesh") {
          obj.rotation.y += 0.002 + idx * 0.0005;
          obj.rotation.z += 0.001;
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const W2 = canvas.offsetWidth, H2 = canvas.offsetHeight;
      camera.aspect = W2 / H2; camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="three-canvas" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

/* ─── VAN POSITIONS ─── */
const VAN_POS = [{ x: 32, y: 56 }, { x: 47, y: 46 }, { x: 61, y: 54 }, { x: 44, y: 38 }];

/* ─── MAIN APP ─── */
export default function Bahifazat() {
  const [page, setPage] = useState("home");
  const [vanPos, setVanPos] = useState(VAN_POS[0]);
  const [online, setOnline] = useState(true);
  const [sosActive, setSosActive] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [counterVal, setCounterVal] = useState(3200);
  const [pageKey, setPageKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setVanPos(p => {
        const idx = (VAN_POS.indexOf(p) + 1) % VAN_POS.length;
        return VAN_POS[idx];
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const goTo = useCallback((p) => {
    setPage(p);
    setPageKey(k => k + 1);
  }, []);

  const NAV_TABS = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "parent", label: "Parent", icon: "👩" },
    { id: "driver", label: "Driver", icon: "🚐" },
    { id: "admin", label: "Admin", icon: "⚙️" },
  ];

  const TRIP_STEPS = [
    { name: "Driver assigned", time: "7:05 AM", urdu: "ڈرائیور مل گیا", state: "done" },
    { name: "Driver en route to you", time: "7:20 AM", urdu: "آپ کی طرف آ رہا ہے", state: "done" },
    { name: "Zara picked up ✓", time: "7:35 AM", urdu: "بچہ اٹھا لیا", state: "curr" },
    { name: "On the way to school", time: "Est. 7:52 AM", urdu: "اسکول جا رہے ہیں", state: "pend" },
    { name: "Arrived at school", time: "Est. 8:02 AM", urdu: "اسکول پہنچ گئے", state: "pend" },
  ];

  return (
    <>
      <style>{G}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => goTo("home")}>
          <div className="shield">🛡️</div>
          Bahi<em>fazat</em>
        </div>
        <div className="nav-pills">
          {NAV_TABS.map(t => (
            <button key={t.id} className={`np ${page === t.id ? "on" : ""}`} onClick={() => goTo(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div className="nav-actions">
          <button className="btn-ghost">Login</button>
          <button className="btn-gold">شروع کریں →</button>
        </div>
      </nav>

      {/* ══════════════════ HOME PAGE ══════════════════ */}
      {page === "home" && (
        <div key={`home-${pageKey}`} className="page landing">
          <section className="hero">
            <ThreeBackground />
            <div className="hero-content">
              <div className="hero-pill"><div className="live-dot" /> Live in Lahore · 500+ Families Protected</div>
              <h1 className="hero-title">
                <span className="g">بچوں کی حفاظت</span>
                <span className="w"> — always</span>
                <span className="sub">Pakistan's safest school transport platform</span>
              </h1>
              <p className="hero-urdu">آپ کی فکر، ہماری ذمہ داری</p>
              <p className="hero-desc">
                Real-time van tracking · Verified drivers only · Pay with JazzCash<br />
                Works in any browser — no download needed
              </p>
              <div className="hero-btns">
                <button className="hbtn parent" onClick={() => goTo("parent")}>
                  <span className="hbtn-icon">👩</span>
                  <span className="hbtn-text">I'm a Parent</span>
                  <span className="hbtn-sub">والدین کیلئے</span>
                </button>
                <button className="hbtn driver" onClick={() => goTo("driver")}>
                  <span className="hbtn-icon">🚐</span>
                  <span className="hbtn-text">I'm a Driver</span>
                  <span className="hbtn-sub">ڈرائیور کیلئے</span>
                </button>
                <button className="hbtn admin" onClick={() => goTo("admin")}>
                  <span className="hbtn-icon">⚙️</span>
                  <span className="hbtn-text">Admin Panel</span>
                  <span className="hbtn-sub">انتظامیہ</span>
                </button>
              </div>
              <div className="stats-bar">
                {[["500+","Active Families"],["98%","On-Time Rate"],["4.9 ★","Avg Rating"],["< 3s","SOS Response"]].map(([n,l],i) => (
                  <div key={i} className="sbar-item">
                    <div className="sbar-num">{n}</div>
                    <div className="sbar-label">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section className="section">
            <div className="sec-kicker">Core Features</div>
            <h2 className="sec-h">Everything you need to feel safe</h2>
            <div className="feat-grid">
              {[
                { ico:"📍", col:"ico-e", t:"Live GPS Tracking", d:"Watch the van move on a real-time map. AES-encrypted so only you can see it. Updates every 4 seconds.", u:"لائیو گاڑی ٹریکنگ" },
                { ico:"💬", col:"ico-s", t:"Price Negotiation", d:"Set your budget. Driver counters. Agree in seconds. Fair, transparent, logged forever.", u:"قیمت پر بات چیت" },
                { ico:"💳", col:"ico-g", t:"JazzCash & EasyPaisa", d:"Pay monthly, daily, or one-time using Pakistan's most trusted mobile wallets.", u:"آسان موبائل ادائیگی" },
                { ico:"🚨", col:"ico-r", t:"One-Tap SOS", d:"Single big button for emergencies. Admin and driver notified in under 3 seconds. Auto route-anomaly detection.", u:"ہنگامی بٹن" },
                { ico:"🛡️", col:"ico-g", t:"Verified Drivers Only", d:"CNIC checked · License verified · Background cleared. Every driver trusted before joining.", u:"قابل اعتماد ڈرائیور" },
                { ico:"📱", col:"ico-e", t:"No App Download", d:"Opens in Chrome on any Android phone. Nothing to install. Always up to date automatically.", u:"کوئی ڈاؤنلوڈ نہیں" },
              ].map((f,i) => (
                <div key={i} className="feat-card">
                  <div className={`feat-ico ${f.col}`}>{f.ico}</div>
                  <div className="feat-title">{f.t}</div>
                  <div style={{fontSize:11,color:"var(--gold)",marginBottom:6,fontFamily:"'Noto Nastaliq Urdu',serif",direction:"rtl"}}>{f.u}</div>
                  <div className="feat-desc">{f.d}</div>
                </div>
              ))}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="section" style={{paddingTop:0}}>
            <div className="sec-kicker">How It Works</div>
            <h2 className="sec-h">3 easy steps — کام کیسے کرتا ہے</h2>
            <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:24,overflow:"hidden"}}>
              <div className="how-grid">
                {[
                  { n:"1", ico:"📲", t:"Sign Up in 30 seconds", d:"Enter your phone number. Receive OTP. Done. No email, no password needed.", u:"30 سیکنڈ میں رجسٹریشن" },
                  { n:"2", ico:"🔍", t:"Find Your Driver", d:"Browse verified drivers in your area. See their rating, vehicle, and monthly rate.", u:"اپنا ڈرائیور تلاش کریں" },
                  { n:"3", ico:"🤝", t:"Agree & Pay", d:"Negotiate the price, confirm, pay via JazzCash. Booking is live instantly.", u:"قیمت طے کریں اور ادائیگی کریں" },
                  { n:"4", ico:"🗺️", t:"Track Every Day", d:"Open Bahifazat every morning. Watch your child's van live. Get notified on arrival.", u:"ہر روز لائیو ٹریکنگ" },
                ].map((s,i,arr) => (
                  <div key={i} className="how-step">
                    <div className="how-num">{s.n}</div>
                    <div className="how-ico">{s.ico}</div>
                    <div className="how-title">{s.t}</div>
                    <div style={{fontSize:11,color:"var(--gold)",marginBottom:6,fontFamily:"'Noto Nastaliq Urdu',serif",direction:"rtl"}}>{s.u}</div>
                    <div className="how-desc">{s.d}</div>
                    {i < arr.length - 1 && <div className="how-connector">›</div>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ══════════════════ PARENT DASHBOARD ══════════════════ */}
      {page === "parent" && (
        <div key={`parent-${pageKey}`} className="page">
          <div className="p-dash">
            {/* Icon Rail */}
            <aside className="icon-rail">
              {[
                { ico:"🏠", label:"Home", on:true },
                { ico:"🗺️", label:"Track" },
                { ico:"📋", label:"Book" },
                { ico:"👧", label:"Child" },
                { ico:"💳", label:"Pay" },
                { ico:"🔔", label:"Alerts", badge:3 },
                { ico:"⭐", label:"Rate" },
                { ico:"👤", label:"Me" },
              ].map((item,i) => (
                <div key={i} className={`rail-item ${item.on ? "on" : ""}`}>
                  <div className="ri-ico">{item.ico}</div>
                  <div className="ri-label">{item.label}</div>
                  {item.badge && <div className="rail-badge">{item.badge}</div>}
                </div>
              ))}
            </aside>

            <div className="dash-body">
              {/* Header */}
              <div className="dash-top">
                <div>
                  <div className="dash-greet-big">Good morning, <span>Amna Ji! 👋</span></div>
                  <div className="dash-date">Wednesday · 22 April 2026 · School is today</div>
                </div>
                <div className="dash-top-right">
                  <div className="icon-btn">🔔<div className="ibadge" /></div>
                  <div className="icon-btn">👤</div>
                </div>
              </div>

              {/* Child hero */}
              <div className="child-hero">
                <div className="child-avatar-wrap">
                  <div className="child-avatar-big">👧</div>
                  <div className="child-status-ring" />
                </div>
                <div>
                  <div className="child-name-big">Zara Malik</div>
                  <div className="child-school">🏫 Beaconhouse DHA · Class 5 · Age 10</div>
                  <div className="child-chips">
                    <div className="chip em">✅ On the Van</div>
                    <div className="chip sk">📡 GPS Active</div>
                    <div className="chip gd">⏱️ ETA 8:02 AM</div>
                  </div>
                </div>
                <div style={{marginLeft:"auto",textAlign:"right",display:"flex",flexDirection:"column",gap:6}}>
                  <div style={{fontFamily:"'Noto Nastaliq Urdu',serif",fontSize:14,color:"var(--gold)",direction:"rtl"}}>زارہ گاڑی میں ہے</div>
                  <div style={{fontSize:11,color:"var(--muted)"}}>بالکل محفوظ ہے ✓</div>
                </div>
              </div>

              {/* Stat row */}
              <div className="stat-row">
                <div className="big-stat trip">
                  <div className="bstat-ico">🚐</div>
                  <div className="bstat-label">Trip Status</div>
                  <div className="bstat-val">Active</div>
                  <div className="bstat-sub">Child is on board</div>
                  <div className="bstat-badge bb-em">✅ Live</div>
                </div>
                <div className="big-stat eta">
                  <div className="bstat-ico">⏱️</div>
                  <div className="bstat-label">Arrives School In</div>
                  <div className="bstat-val" style={{color:"var(--sky)"}}>12 min</div>
                  <div className="bstat-sub">Est. 8:02 AM</div>
                </div>
                <div className="big-stat pay">
                  <div className="bstat-ico">💳</div>
                  <div className="bstat-label">April Payment</div>
                  <div className="bstat-val">3,000</div>
                  <div className="bstat-sub">PKR · Paid</div>
                  <div className="bstat-badge bb-gd">✓ Done</div>
                </div>
              </div>

              <div className="two-col">
                <div className="col-left">
                  {/* LIVE MAP */}
                  <div className="map-card">
                    <div className="map-header">
                      <div className="map-title-row">
                        🗺️ Live Tracking
                        <div className="live-chip"><div className="live-dot" /> LIVE</div>
                      </div>
                      <div style={{fontSize:11,color:"var(--muted)"}}>Updates every 4 seconds</div>
                    </div>
                    <div className="map-area">
                      {/* Road grid */}
                      <div className="map-glow" />
                      {[18,36,54,72,90].map(p => <div key={p} className="mr h" style={{top:`${p}%`}} />)}
                      {[15,30,45,60,75,90].map(p => <div key={p} className="mr v" style={{left:`${p}%`}} />)}
                      <div className="mr thick" style={{top:"50%"}} />
                      <div className="mr thickv" style={{left:"40%"}} />
                      <div className="mlb" style={{top:"35%",left:"20%"}}>Shadman</div>
                      <div className="mlb" style={{top:"15%",left:"60%"}}>DHA Ph-5</div>
                      <div className="mlb" style={{bottom:"14%",left:"42%"}}>Gulberg</div>
                      {/* Route */}
                      <div className="route-path" style={{bottom:"33%",left:"16%",width:"58%",transform:"rotate(-10deg)"}} />
                      {/* Home */}
                      <div className="mkr" style={{left:"16%",top:"70%"}}>
                        <div className="home-bubble">🏠</div>
                        <div className="mkr-tag" style={{color:"var(--sky)"}}>Zara's Home</div>
                      </div>
                      {/* School */}
                      <div className="mkr" style={{left:"76%",top:"20%"}}>
                        <div className="school-bubble">🏫</div>
                        <div className="mkr-tag" style={{color:"var(--gold)"}}>Beaconhouse</div>
                      </div>
                      {/* Van */}
                      <div className="mkr" style={{left:`${vanPos.x}%`,top:`${vanPos.y}%`}}>
                        <div className="van-bubble">🚐</div>
                        <div className="mkr-tag" style={{color:"var(--emerald)"}}>Ahmad (38 km/h)</div>
                      </div>
                    </div>
                    <div className="map-bar">
                      <div className="mbar-i">📍 <strong>Shadman Chowk</strong> · last position</div>
                      <div className="mbar-i">🏎️ <strong>38 km/h</strong></div>
                      <div className="mbar-i">📡 <strong className="em">Strong signal</strong></div>
                    </div>
                  </div>

                  {/* TRIP TIMELINE */}
                  <div className="timeline-card">
                    <div className="tl-title">🛣️ Today's Journey</div>
                    {TRIP_STEPS.map((s, i) => (
                      <div key={i} className={`tl-step ${s.state}`}>
                        <div className="tl-circle">{s.state === "done" ? "✓" : s.state === "curr" ? "●" : i + 1}</div>
                        <div className="tl-info">
                          <div className="tl-name">{s.name}</div>
                          <div style={{fontSize:11,fontFamily:"'Noto Nastaliq Urdu',serif",color:"var(--muted)",direction:"rtl",margin:"2px 0"}}>{s.urdu}</div>
                          <div className="tl-time">{s.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-right">
                  {/* Driver card */}
                  <div className="driver-card">
                    <div className="drv-row">
                      <div className="drv-av">👨</div>
                      <div className="drv-name-wrap">
                        <div className="drv-name">Ahmad Raza</div>
                        <div className="drv-vehicle">🚐 Toyota HiAce · White · LHR-4821</div>
                      </div>
                      <div className="drv-rating">⭐ 4.9</div>
                    </div>
                    <div className="drv-badges">
                      <div className="drv-badge db-em">✅ CNIC Verified</div>
                      <div className="drv-badge db-gd">🛡️ Background Clear</div>
                      <div className="drv-badge" style={{background:"var(--sky2)",color:"var(--sky)",border:"1px solid rgba(41,169,255,0.25)"}}>📋 Licensed</div>
                    </div>
                    <div className="drv-actions">
                      <button className="dact call"><div className="dact-ico">📞</div>Call</button>
                      <button className="dact"><div className="dact-ico">💬</div>Chat</button>
                      <button className="dact"><div className="dact-ico">👤</div>Profile</button>
                    </div>
                  </div>

                  {/* SOS */}
                  <div className="sos-card">
                    <div style={{fontSize:12,fontWeight:700,color:"var(--red)",marginBottom:14,display:"flex",alignItems:"center",gap:7}}>
                      🚨 Emergency Button · ہنگامی بٹن
                    </div>
                    <button
                      className="sos-mega"
                      onClick={() => { setSosActive(true); setTimeout(() => setSosActive(false), 3500); }}
                      style={sosActive ? {background:"linear-gradient(135deg,#660011,#990022)",animation:"none"} : {}}
                    >
                      <span className="sos-icon-big">{sosActive ? "📢" : "🚨"}</span>
                      {sosActive ? "SOS SENT! Admin Notified" : "SOS — Emergency"}
                    </button>
                    <div className="sos-urdu">صرف ہنگامی صورت میں دبائیں</div>
                    <div className="sos-info">Admin responds in under 3 seconds · ایڈمن 3 سیکنڈ میں جواب دے گا</div>
                  </div>

                  {/* Notifications */}
                  <div className="notif-card">
                    <div className="ncard-title">🔔 Recent Alerts</div>
                    {[
                      { ico:"✅", bg:"var(--em2)", txt:"Zara picked up at DHA Colony", time:"7:32 AM · Today" },
                      { ico:"🚐", bg:"var(--sky2)", txt:"Ahmad started the trip", time:"7:18 AM · Today" },
                      { ico:"💳", bg:"var(--gold3)", txt:"April payment confirmed", time:"Yesterday" },
                      { ico:"⭐", bg:"rgba(255,220,0,0.1)", txt:"You rated Ahmad 5 stars", time:"Last Friday" },
                    ].map((n,i) => (
                      <div key={i} className="nitem">
                        <div className="nitem-ico" style={{background:n.bg}}>{n.ico}</div>
                        <div>
                          <div className="nitem-text">{n.txt}</div>
                          <div className="nitem-time">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ DRIVER DASHBOARD ══════════════════ */}
      {page === "driver" && (
        <div key={`driver-${pageKey}`} className="page">
          <div className="drv-dash">
            <div className="drv-hero-bar">
              <div>
                <div className="drv-name-big">Welcome, <span>Ahmad Sahib!</span> 🚐</div>
                <div className="drv-sub">Wednesday · 7:38 AM · Lahore City</div>
              </div>
              <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                <div
                  className={`online-tog ${online ? "on" : ""}`}
                  onClick={() => setOnline(v => !v)}
                >
                  <div className={`tog-indicator ${online ? "on" : "off"}`} />
                  {online ? "🟢 Online — قابل رسائی" : "⚫ Offline"}
                </div>
                <div className="icon-btn" style={{width:44,height:44}}>🔔<div className="ibadge"/></div>
              </div>
            </div>

            <div className="drv-content">
              <div className="drv-left">
                {/* Earnings */}
                <div className="earn-card">
                  <div>
                    <div className="earn-lbl">April 2026 Earnings · اس ماہ کمائی</div>
                    <div className="earn-amount"><span className="earn-pkr">PKR</span>42,000</div>
                    <div className="earn-meta"><span>↑ 18% more</span> than last month · 14 active bookings</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div className="bars-wrap">
                      {[30,50,40,70,55,85,60,90,75,100,80,95].map((h,i) => (
                        <div key={i} className={`bar-col ${h > 80 ? "peak" : ""}`} style={{height:`${h}%`}} data-val={`${Math.round(h*420)}pk`}/>
                      ))}
                    </div>
                    <div style={{fontSize:9,color:"var(--muted)",marginTop:5}}>Daily earnings this month</div>
                  </div>
                </div>

                {/* Booking Request */}
                <div className="req-card">
                  <div className="req-top">
                    <div className="req-new">⚡ New Booking Request · نئی درخواست</div>
                    <div className="req-price-big">PKR 3,000<span>/month</span></div>
                  </div>

                  <div className="req-parent">
                    <div className="req-p-av">👩</div>
                    <div>
                      <div className="req-p-name">Fatima Zahra</div>
                      <div className="req-p-info">⭐ 4.8 · Member since Jan 2026 · 1 child</div>
                    </div>
                    <div style={{marginLeft:"auto"}}>
                      <div className="chip em" style={{fontSize:10}}>✅ Verified</div>
                    </div>
                  </div>

                  <div className="req-route" style={{position:"relative"}}>
                    <div className="req-rt-line" />
                    <div className="req-rt">
                      <div className="rt-dot p" />
                      <div>
                        <div style={{fontWeight:700,fontSize:13}}>Pickup: Johar Town, Block E2</div>
                        <div style={{fontSize:11,color:"var(--muted)"}}>پک اپ · صبح 7:30</div>
                      </div>
                    </div>
                    <div className="req-rt">
                      <div className="rt-dot d" />
                      <div>
                        <div style={{fontWeight:700,fontSize:13}}>Drop: City School, Model Town</div>
                        <div style={{fontSize:11,color:"var(--muted)"}}>ڈراپ آف · 4.2 km route · Est. 15 min</div>
                      </div>
                    </div>
                  </div>

                  <div style={{display:"flex",gap:12,marginBottom:16,fontSize:12,color:"var(--muted)",position:"relative",zIndex:1}}>
                    <span>📅 Monthly · Starting May 1</span>
                    <span>🏫 1 child (Class 3)</span>
                    <span>💺 1 seat needed</span>
                  </div>

                  {showCounter && (
                    <div className="counter-panel">
                      <div style={{fontSize:12,color:"var(--muted)",marginBottom:10}}>
                        Parent offered: <strong style={{color:"var(--white)"}}>PKR 3,000</strong> · Your counter offer: اپنی قیمت لگائیں
                      </div>
                      <div className="counter-row">
                        <button className="cnt-minus" onClick={() => setCounterVal(v => Math.max(2000, v - 100))}>−</button>
                        <div className="cnt-display">
                          <div className="val">PKR {counterVal.toLocaleString()}</div>
                          <div className="lbl">per month · ہر مہینہ</div>
                        </div>
                        <button className="cnt-plus" onClick={() => setCounterVal(v => Math.min(6000, v + 100))}>+</button>
                      </div>
                    </div>
                  )}

                  <div className="req-actions">
                    <button className="btn-accept">
                      <span className="ba-ico">✅</span>
                      <span>{showCounter ? `Accept PKR 3,000` : "Accept Offer"}</span>
                      <span className="ba-label">قبول کریں</span>
                    </button>
                    <button className="btn-counter" onClick={() => setShowCounter(v => !v)}>
                      <span className="ba-ico">💬</span>
                      <span>{showCounter ? "Hide Counter" : "Counter Offer"}</span>
                      <span className="ba-label">اپنی قیمت لگائیں</span>
                    </button>
                  </div>
                </div>

                {/* Active Trip Controls */}
                <div className="trip-ctrl-card">
                  <div className="trip-ctrl-hdr">
                    <div className="trip-status-ico">🟡</div>
                    <div>
                      <div className="trip-status-txt">Active Trip — On the way to Beaconhouse</div>
                      <div className="trip-status-sub" style={{fontFamily:"'Noto Nastaliq Urdu',serif",direction:"rtl"}}>اسکول جا رہے ہیں · 3.1 km باقی</div>
                    </div>
                  </div>

                  <div className="pax-list">
                    <div className="pax-hdr">Today's Passengers · آج کے بچے</div>
                    {[
                      { name:"Zara Malik", av:"👧", school:"Beaconhouse DHA" },
                      { name:"Omar Sheikh", av:"👦", school:"Beaconhouse DHA" },
                      { name:"Hana Tariq", av:"👧", school:"Beaconhouse DHA" },
                    ].map((p,i) => (
                      <div key={i} className="pax-item">
                        <div className="pax-av">{p.av}</div>
                        <div className="pax-name">{p.name}<div style={{fontSize:10,color:"var(--muted)"}}>{p.school}</div></div>
                        <div className="pax-status">✅ Picked</div>
                      </div>
                    ))}
                  </div>

                  <button className="trip-big-btn complete">
                    ✅ Mark Trip Complete · سفر مکمل
                  </button>
                </div>
              </div>

              <div className="drv-right">
                <div className="stats-sm">
                  <div className="stats-sm-title">📊 Today · آج</div>
                  {[
                    { l:"Trips completed", v:"2 / 3", c:"var(--emerald)" },
                    { l:"Distance driven", v:"18.4 km", c:"" },
                    { l:"Children safe", v:"7 kids", c:"var(--sky)" },
                    { l:"Today's earning", v:"PKR 1,400", c:"var(--gold)" },
                    { l:"Active bookings", v:"14 total", c:"" },
                    { l:"Avg rating", v:"⭐ 4.9", c:"var(--gold)" },
                  ].map((s,i) => (
                    <div key={i} className="sm-stat">
                      <div className="sm-stat-label">{s.l}</div>
                      <div className="sm-stat-val" style={{color:s.c||"var(--white)"}}>{s.v}</div>
                    </div>
                  ))}
                </div>

                <div className="glass-card">
                  <div className="section-header">📋 Pending Requests · نئی درخواستیں</div>
                  {[
                    { n:"Sara's Mama", a:"Gulberg III", p:2800, d:"May 1" },
                    { n:"Bilal's Abu", a:"Model Town", p:3500, d:"May 1" },
                    { n:"Hira's Mama", a:"Johar Town", p:3200, d:"Jun 1" },
                  ].map((r,i) => (
                    <div key={i} style={{padding:"11px 0",borderBottom:i<2?"1px solid var(--border)":"none"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <div style={{fontSize:13,fontWeight:700}}>{r.n}</div>
                        <div style={{fontSize:14,fontWeight:800,color:"var(--gold)"}}>PKR {r.p}</div>
                      </div>
                      <div style={{fontSize:11,color:"var(--muted)"}}>📍 {r.a} · 📅 From {r.d}</div>
                    </div>
                  ))}
                </div>

                <div style={{background:"linear-gradient(135deg,#0f0c00,#1a1500)",border:"1px solid rgba(232,160,0,0.2)",borderRadius:24,padding:20}}>
                  <div className="section-header" style={{color:"var(--gold)"}}>💰 Next Payout · اگلی ادائیگی</div>
                  <div style={{fontSize:28,fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:"var(--gold)",marginBottom:8}}>PKR 14,000</div>
                  <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.8}}>
                    Date: <strong style={{color:"var(--white)"}}>May 1, 2026</strong><br/>
                    Via: <strong style={{color:"var(--white)"}}>JazzCash</strong><br/>
                    <span style={{fontFamily:"'Noto Nastaliq Urdu',serif",direction:"rtl",display:"block",marginTop:4}}>یکم مئی کو جاز کیش سے ملے گا</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ ADMIN DASHBOARD ══════════════════ */}
      {page === "admin" && (
        <div key={`admin-${pageKey}`} className="page">
          <div className="adm-dash">
            <div className="adm-bar">
              <div>
                <div className="adm-title-big">⚙️ Bahifazat Admin — <span>Lahore City</span></div>
                <div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Wednesday 22 Apr 2026 · 7:38 AM · 14 vans active now</div>
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button className="btn-ghost" style={{fontSize:13}}>📊 Reports</button>
                <button className="btn-ghost" style={{fontSize:13}}>📤 Export</button>
                <button className="btn-gold" style={{fontSize:13}}>+ Add Driver</button>
              </div>
            </div>

            <div className="adm-body">
              {/* KPIs */}
              <div className="adm-kpis">
                {[
                  { n:"523", l:"Active Parents", c:"em", ch:"↑ +12 this week" },
                  { n:"68", l:"Verified Drivers", c:"gd", ch:"↑ +3 this week" },
                  { n:"14", l:"Vans On Trip Now", c:"sk", ch:"🔴 Live tracking" },
                  { n:"1", l:"Open SOS Alerts", c:"rd", ch:"⚠️ Needs attention" },
                ].map((k,i) => (
                  <div key={i} className={`kpi ${k.c}`}>
                    <div className="kpi-num">{k.n}</div>
                    <div className="kpi-label">{k.l}</div>
                    <div className="kpi-change">{k.ch}</div>
                  </div>
                ))}
              </div>

              {/* SOS Alert */}
              <div className="sos-alert-mega">
                <div className="sos-siren">🚨</div>
                <div className="sos-alert-info">
                  <div className="sos-title">ACTIVE SOS — Child Missing · گمشدہ بچہ</div>
                  <div className="sos-detail">
                    Parent: Amna Malik → Van LHR-4821 · Driver: Ahmad Raza · Gulberg Area · Reported: 7:31 AM (7 min ago)
                  </div>
                </div>
                <button className="btn-respond">🔴 Respond Now</button>
              </div>

              <div className="adm-two">
                <div className="adm-left">
                  {/* City map */}
                  <div className="city-card">
                    <div className="city-hdr">
                      <div className="city-hdr-title">🏙️ Lahore Live Fleet Map</div>
                      <div style={{fontSize:11,color:"var(--muted)"}}>14 active vans · 1 SOS</div>
                    </div>
                    <div className="city-map-body">
                      {[20,40,60,80].map(p=><div key={p} className="mr h" style={{top:`${p}%`}}/>)}
                      {[20,40,60,80].map(p=><div key={p} className="mr v" style={{left:`${p}%`}}/>)}
                      {/* Van dots */}
                      {[[18,28],[33,52],[49,38],[63,24],[74,58],[43,68],[79,38],[28,70],[58,48],[13,54],[53,23],[68,74],[38,18],[83,28]].map(([x,y],i)=>(
                        <div key={i} className="van-node" style={{left:`${x}%`,top:`${y}%`}}/>
                      ))}
                      {/* SOS node */}
                      <div className="sos-node" style={{left:"33%",top:"52%"}}/>
                      <div className="mlb" style={{top:"8%",left:"10%"}}>Cantt</div>
                      <div className="mlb" style={{top:"8%",right:"8%"}}>DHA</div>
                      <div className="mlb" style={{bottom:"8%",left:"36%"}}>Gulberg</div>
                      <div className="mlb" style={{top:"42%",left:"44%"}}>Model Town</div>
                      <div className="city-legend">
                        <div className="legend-item"><div className="legend-dot" style={{background:"var(--emerald)"}}/>Active Van</div>
                        <div className="legend-item"><div className="legend-dot" style={{background:"var(--red)"}}/>SOS Alert</div>
                      </div>
                    </div>
                  </div>

                  {/* Users table */}
                  <div className="users-card">
                    <div className="users-hdr">
                      <div className="users-hdr-title">👥 Recent Users</div>
                      <input className="search-bar" placeholder="🔍 Search users..." />
                    </div>
                    <div className="tbl-head">
                      <div></div><div>Name</div><div>Role</div><div>Status</div><div>Joined</div>
                    </div>
                    {[
                      { init:"AM", bg:"var(--sky2)", name:"Amna Malik", ph:"+92 321 4567890", role:"parent", st:"verified", j:"Jan 2026" },
                      { init:"AR", bg:"var(--gold3)", name:"Ahmad Raza", ph:"+92 333 9876543", role:"driver", st:"verified", j:"Feb 2026" },
                      { init:"FZ", bg:"var(--sky2)", name:"Fatima Zahra", ph:"+92 312 1234567", role:"parent", st:"verified", j:"Mar 2026" },
                      { init:"KA", bg:"var(--gold3)", name:"Kamran Ali", ph:"+92 345 6543210", role:"driver", st:"pending", j:"Apr 2026" },
                      { init:"SB", bg:"var(--sky2)", name:"Sara Begum", ph:"+92 321 7890123", role:"parent", st:"verified", j:"Apr 2026" },
                    ].map((u,i)=>(
                      <div key={i} className="tbl-row">
                        <div className="row-av" style={{background:u.bg}}>{u.init}</div>
                        <div>
                          <div style={{fontWeight:700,fontSize:13}}>{u.name}</div>
                          <div style={{fontSize:10,color:"var(--muted)"}}>{u.ph}</div>
                        </div>
                        <div><span className={`badge b-${u.role}`}>{u.role}</span></div>
                        <div><span className={`badge b-${u.st}`}>{u.st}</span></div>
                        <div style={{fontSize:11,color:"var(--muted)"}}>{u.j}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="adm-right">
                  <div className="rev-card">
                    <div className="rev-title">💰 Revenue Today</div>
                    {[
                      { l:"Total bookings paid", v:"PKR 45,600", c:"var(--emerald)" },
                      { l:"Platform fee (12%)", v:"PKR 5,472", c:"var(--gold)" },
                      { l:"Driver payouts", v:"PKR 40,128", c:"var(--sky)" },
                      { l:"Pending payments", v:"PKR 12,000", c:"var(--red)" },
                    ].map((r,i)=>(
                      <div key={i} className="rev-item">
                        <div className="rev-label">{r.l}</div>
                        <div className="rev-val" style={{color:r.c}}>{r.v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="glass-card">
                    <div className="section-header">📋 Pending Actions</div>
                    {[
                      { ico:"🆔", t:"3 driver verifications", c:"var(--gold)", u:"3 ڈرائیور تصدیق باقی" },
                      { ico:"⭐", t:"8 reviews to moderate", c:"var(--sky)", u:"8 ریویوز" },
                      { ico:"💬", t:"2 disputes open", c:"var(--red)", u:"2 تنازعات" },
                      { ico:"🔔", t:"1 SOS active", c:"var(--red)", u:"ہنگامی صورتحال" },
                    ].map((a,i)=>(
                      <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:i<3?"1px solid var(--border)":"none",cursor:"pointer",transition:"all 0.2s"}}>
                        <div style={{width:36,height:36,borderRadius:10,background:"var(--glass)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{a.ico}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:700,color:a.c}}>{a.t}</div>
                          <div style={{fontSize:10,color:"var(--muted)",fontFamily:"'Noto Nastaliq Urdu',serif",direction:"rtl"}}>{a.u}</div>
                        </div>
                        <div style={{color:"var(--muted)",fontSize:16}}>→</div>
                      </div>
                    ))}
                  </div>

                  <div className="glass-card" style={{background:"linear-gradient(135deg,#080f10,#0c1812)",border:"1px solid rgba(0,201,122,0.15)"}}>
                    <div className="section-header" style={{color:"var(--emerald)"}}>📈 Platform Health</div>
                    {[
                      { l:"Uptime", v:"99.97%", c:"var(--emerald)" },
                      { l:"Avg response time", v:"1.2s", c:"var(--sky)" },
                      { l:"Active WebSockets", v:"47", c:"var(--white)" },
                      { l:"DB size", v:"128 MB", c:"var(--white)" },
                    ].map((m,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:i<3?"1px solid var(--border)":"none",fontSize:12}}>
                        <span style={{color:"var(--muted)"}}>{m.l}</span>
                        <strong style={{color:m.c}}>{m.v}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
