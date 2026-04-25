
// --- CUSTOMIZER & SHARING LOGIC ---

let cardData = {
    theme: 'teal',
    music: '1',
    guestName: 'Guest', // NEW: Personalized guest name
    groomName: 'Groom Name',
    brideName: 'Bride Name',
    targetDate: "April 24, 2026 14:00:00",
    event1: { title: 'سہرا بندی', date: '23rd April, 2026', time: 'At 1:00 AM' },
    event2: { title: 'بارات', date: '23rd April, 2026', time: 'At 2:00 AM' },
    event3: { title: 'ولیمہ', date: '24th April, 2026', time: 'At 2:00 AM', location: 'Shadi Hall / Marquee Name', mapUrl: '' },
    host1: { label: 'زیرِ اہتمام', name: 'Host Name' },
    host2: { label: 'خصوصی شرکت (والدِ عروس)', name: 'Special Guest Name' },
    hostWhatsapp: '+920000000000' // NEW: For RSVP
};

let isMusicPlaying = false;

function toggleMusic() {
    const music = document.getElementById('bg-music');
    const btn = document.getElementById('music-toggle');
    if (!music || !btn) return;
    if (isMusicPlaying) { music.pause(); btn.classList.remove('playing'); } 
    else { music.play(); btn.classList.add('playing'); }
    isMusicPlaying = !isMusicPlaying;
}

function openCard() {
    const cover = document.getElementById('card-cover');
    const inside = document.getElementById('card-inside');
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');
    if (cover && inside) { cover.style.display = 'none'; inside.classList.remove('hidden'); inside.classList.add('show'); }
    if (music && !isMusicPlaying) {
        music.src = `music${cardData.music}.mp3`;
        music.play().then(() => { isMusicPlaying = true; if (musicBtn) musicBtn.classList.add('playing'); }).catch(e => console.log("Autoplay prevented:", e));
    }
}

const DATA_KEYS = [
    'theme', 'music', 'guestName', 'groomName', 'brideName', 'targetDate',
    'event1.title', 'event1.date', 'event1.time',
    'event2.title', 'event2.date', 'event2.time',
    'event3.title', 'event3.date', 'event3.time', 'event3.location', 'event3.mapUrl',
    'host1.label', 'host1.name', 'host2.label', 'host2.name', 'hostWhatsapp'
];

function initApp() {
    const hash = window.location.hash;
    if (hash.startsWith('#v2-')) {
        try {
            const encodedData = hash.substring(4);
            const decodedStr = decodeURIComponent(escape(atob(encodedData)));
            const parts = decodedStr.split('|');
            cardData.theme = parts[0] || cardData.theme;
            cardData.music = parts[1] || cardData.music;
            cardData.guestName = parts[2] || cardData.guestName;
            cardData.groomName = parts[3] || cardData.groomName;
            cardData.brideName = parts[4] || cardData.brideName;
            cardData.targetDate = parts[5] || cardData.targetDate;
            cardData.event1 = { title: parts[6], date: parts[7], time: parts[8] };
            cardData.event2 = { title: parts[9], date: parts[10], time: parts[11] };
            cardData.event3 = { title: parts[12], date: parts[13], time: parts[14], location: parts[15], mapUrl: parts[16] };
            cardData.host1 = { label: parts[17], name: parts[18] };
            cardData.host2 = { label: parts[19], name: parts[20] };
            cardData.hostWhatsapp = parts[21] || cardData.hostWhatsapp;
            document.body.classList.add('guest-mode');
        } catch (e) { console.error("Failed to decode guest link", e); }
    } else { document.body.classList.remove('guest-mode'); loadHostInputs(); }
    applyCardData();
    initBackground();
}

function applyCardData() {
    Array.from(document.body.classList).forEach(cls => { if (cls.startsWith('theme-')) document.body.classList.remove(cls); });
    if (cardData.theme && cardData.theme !== 'teal') document.body.classList.add(`theme-${cardData.theme}`);
    
    // Welcome message
    const welcomeEl = document.getElementById('guest-welcome');
    if (welcomeEl) welcomeEl.innerText = `Warmest Welcome, ${cardData.guestName}!`;

    const audio = document.getElementById('bg-music');
    if (audio) {
        const newSrc = `music${cardData.music}.mp3`;
        if (!audio.src.includes(newSrc)) audio.src = newSrc;
    }

    if(document.getElementById('display-groom-name')) document.getElementById('display-groom-name').innerText = cardData.groomName;
    if(document.getElementById('display-bride-name')) document.getElementById('display-bride-name').innerText = cardData.brideName;
    if(document.getElementById('inside-groom-name')) document.getElementById('inside-groom-name').innerText = cardData.groomName;
    if(document.getElementById('inside-bride-name')) document.getElementById('inside-bride-name').innerText = cardData.brideName;
    
    if(document.getElementById('event1-title')) document.getElementById('event1-title').innerText = cardData.event1.title;
    if(document.getElementById('event1-date')) document.getElementById('event1-date').innerText = cardData.event1.date;
    if(document.getElementById('event1-time')) document.getElementById('event1-time').innerText = cardData.event1.time;
    
    if(document.getElementById('event2-title')) document.getElementById('event2-title').innerText = cardData.event2.title;
    if(document.getElementById('event2-date')) document.getElementById('event2-date').innerText = cardData.event2.date;
    if(document.getElementById('event2-time')) document.getElementById('event2-time').innerText = cardData.event2.time;
    
    if(document.getElementById('event3-title')) document.getElementById('event3-title').innerText = cardData.event3.title;
    if(document.getElementById('event3-date')) document.getElementById('event3-date').innerText = cardData.event3.date;
    if(document.getElementById('event3-time')) document.getElementById('event3-time').innerText = cardData.event3.time;
    if(document.getElementById('event3-location')) document.getElementById('event3-location').innerText = cardData.event3.location;
    
    const mapBtn = document.getElementById('map-button');
    if (mapBtn) { mapBtn.href = cardData.event3.mapUrl; mapBtn.style.display = cardData.event3.mapUrl ? 'inline-flex' : 'none'; }

    if(document.getElementById('host1-label')) document.getElementById('host1-label').innerText = cardData.host1.label;
    if(document.getElementById('host1-name')) document.getElementById('host1-name').innerText = cardData.host1.name;
    if(document.getElementById('host2-name')) document.getElementById('host2-name').innerText = cardData.host2.name;

    // Update browser tab title dynamically
    document.title = `Wedding Invitation | ${cardData.groomName}`;
    
    // Update Social Media Preview Title
    const ogTitle = document.getElementById('og-title');
    if (ogTitle) ogTitle.setAttribute('content', `Wedding Invitation | ${cardData.groomName}`);

    initCountdown();
}

function loadHostInputs() {
    const fields = {
        'input-music': cardData.music,
        'input-guest-name': cardData.guestName,
        'input-groom-name': cardData.groomName,
        'input-bride-name': cardData.brideName,
        'input-targetDate': cardData.targetDate,
        'input-event1-title': cardData.event1.title,
        'input-event1-date': cardData.event1.date,
        'input-event1-time': cardData.event1.time,
        'input-event2-title': cardData.event2.title,
        'input-event2-date': cardData.event2.date,
        'input-event2-time': cardData.event2.time,
        'input-event3-title': cardData.event3.title,
        'input-event3-date': cardData.event3.date,
        'input-event3-time': cardData.event3.time,
        'input-event3-location': cardData.event3.location,
        'input-event3-mapUrl': cardData.event3.mapUrl,
        'input-host1-label': cardData.host1.label,
        'input-host1-name': cardData.host1.name,
        'input-host2-label': cardData.host2.label,
        'input-host2-name': cardData.host2.name,
        'input-host-whatsapp': cardData.hostWhatsapp
    };
    for (let id in fields) { if(document.getElementById(id)) document.getElementById(id).value = fields[id]; }
}

function updateField(id, value) {
    if (id === 'music') cardData.music = value;
    if (id === 'guestName') cardData.guestName = value;
    if (id === 'groomName') cardData.groomName = value;
    if (id === 'brideName') cardData.brideName = value;
    if (id === 'targetDate') cardData.targetDate = value;
    if (id.startsWith('event')) {
        const parts = id.split('-');
        cardData[parts[0]][parts[1]] = value;
    }
    if (id.startsWith('host')) {
        if (id === 'hostWhatsapp') cardData.hostWhatsapp = value;
        else { const parts = id.split('-'); cardData[parts[0]][parts[1]] = value; }
    }
    applyCardData();
}

function generateGuestLink() {
    const packedData = DATA_KEYS.map(key => {
        const parts = key.split('.');
        let val = cardData;
        parts.forEach(p => { if (val) val = val[p]; });
        return val || '';
    });
    const flatStr = packedData.join('|');
    const encoded = btoa(unescape(encodeURIComponent(flatStr)));
    return `${window.location.origin}${window.location.pathname}#v2-${encoded}`;
}

function copyLink() {
    const link = generateGuestLink();
    navigator.clipboard.writeText(link).then(() => alert("Guest link copied!"));
}

function shareOnWhatsapp() {
    const link = generateGuestLink();
    const text = encodeURIComponent(`*Wedding Invitation* 🤵👰\n\nDear *${cardData.guestName}*,\n\nWe cordially invite you to the wedding of *${cardData.groomName}* and *${cardData.brideName}*.\n\nPlease open our digital invitation here:\n${link}\n\nCan't wait to see you!`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function sendRSVP(status) {
    const text = encodeURIComponent(`*RSVP for ${cardData.groomName}'s Wedding*\n\nName: ${cardData.guestName}\nResponse: ${status}\n\nSent via Digital Card`);
    window.open(`https://wa.me/${cardData.hostWhatsapp}?text=${text}`, '_blank');
}

function setTheme(theme, el) { cardData.theme = theme; applyCardData(); }
function toggleHostPanel() { const p = document.getElementById('host-panel'); if(p) p.classList.toggle('active'); }

function initCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    const date = new Date(cardData.targetDate).getTime();
    if (isNaN(date)) return;
    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const dist = date - now;
        const d = Math.floor(dist / (1000 * 60 * 60 * 24)), h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)), s = Math.floor((dist % (1000 * 60)) / 1000);
        const dEl = document.getElementById('days'), hEl = document.getElementById('hours'), mEl = document.getElementById('minutes'), sEl = document.getElementById('seconds');
        if(dEl) dEl.innerText = d < 0 ? '00' : (d < 10 ? '0'+d : d);
        if(hEl) hEl.innerText = h < 0 ? '00' : (h < 10 ? '0'+h : h);
        if(mEl) mEl.innerText = m < 0 ? '00' : (m < 10 ? '0'+m : m);
        if(sEl) sEl.innerText = s < 0 ? '00' : (s < 10 ? '0'+s : s);
        if (dist < 0) { clearInterval(countdownInterval); const c = document.querySelector('.countdown-container'); if(c) c.innerHTML = "<h2 class='celebration-text'>The Celebration has Begun!</h2>"; }
    }, 1000);
}

let countdownInterval;
function initBackground() {
    const c = document.getElementById('bg-animations'); if(!c) return; c.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        const l = document.createElement('div'); l.className = 'floating-item';
        l.style.left = Math.random() * 100 + 'vw'; l.style.animationDelay = Math.random() * 5 + 's'; l.style.opacity = Math.random() * 0.5; c.appendChild(l);
    }
}
window.onload = initApp;
