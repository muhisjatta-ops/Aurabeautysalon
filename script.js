// AURA BEAUTY SALON - FRONTEND ENGINE & BACKEND API LAYER

const SEED_DATA = {
  services: [
    { id: 'srv-1', category: 'Braids & Twists', name: 'Simple Cornrow (No Extension)', price: 300, duration: '45 mins', desc: 'Neat & sleek cornrow style using natural hair.' },
    { id: 'srv-2', category: 'Braids & Twists', name: 'Simple Cornrow (With Extension)', price: 500, duration: '60 mins', desc: 'Cornrow styling braided with added premium extensions.' },
    { id: 'srv-3', category: 'Braids & Twists', name: 'Knotless Braid/Twist (Incl. 2 Pkt Meche)', price: 1800, duration: '180 mins', desc: 'Lightweight, pain-free knotless braids including 2 packets of meche.' },
    { id: 'srv-4', category: 'Braids & Twists', name: 'Knotless Braid/Twist (Client Meche)', price: 700, duration: '150 mins', desc: 'Flawless knotless braids service when you supply your own meche hair.' },
    { id: 'srv-5', category: 'Braids & Twists', name: 'Hair Wash & Deep Conditioning', price: 400, duration: '30 mins', desc: 'Deep scalp cleanse, head massage & hydrating conditioning.' },
    { id: 'srv-6', category: 'Lash Extensions', name: 'Classic Lash Extensions', price: 450, duration: '50 mins', desc: 'Natural classic lash extensions.' },
    { id: 'srv-7', category: 'Lash Extensions', name: 'Volume Lash Set & Refill', price: 600, duration: '75 mins', desc: 'Full volume lash extensions for a dramatic fluttery look.' },
    { id: 'srv-8', category: 'Makeup', name: 'Soft Glam Makeup', price: 700, duration: '45 mins', desc: 'Fresh, radiant natural daytime or event makeup look.' },
    { id: 'srv-9', category: 'Makeup', name: 'Bridal & Full Glam Makeup', price: 1200, duration: '75 mins', desc: 'High definition full glam with custom contour & lip.' },
    { id: 'srv-10', category: 'Hair Cuts', name: 'Hair Cut (Simple)', price: 150, duration: '20 mins', desc: 'Precision trim and simple hair cut.' },
    { id: 'srv-11', category: 'Hair Cuts', name: 'Hair Cut (High Tech / Fade)', price: 200, duration: '35 mins', desc: 'Modern styled cut with detailed fade or line designs.' },
    { id: 'srv-12', category: 'Hair Cuts', name: 'Hair Cut (Tape Lineup)', price: 200, duration: '30 mins', desc: 'Crisp shape-up and razor tape lineup.' },
    { id: 'srv-13', category: 'Nails & Brows', name: 'Manicure & Pedicure (Gel Polish)', price: 450, duration: '60 mins', desc: 'Nail shaping, cuticle care & long lasting gel polish.' },
    { id: 'srv-14', category: 'Nails & Brows', name: 'Brows Shaping & Tinting', price: 250, duration: '30 mins', desc: 'Precision eyebrow threading & custom stain tinting.' }
  ],
  stylists: [
    { id: 'sty-1', name: 'Amadou Jatta', role: 'General Salon Manager', avatar: 'image/Aura beauty.jpg.jpeg', bio: 'Operations & Management at Aura Beauty Salon. Ensures top-quality client service.' },
    { id: 'sty-2', name: 'Yamai Jatta', role: 'Beauty & Nail Therapist', avatar: 'image/Makeup2.jpg', bio: 'Specialist in manicure, gel polish, full glam makeup & client care.' },
    { id: 'sty-3', name: 'Amie Cham', role: 'Master Braid Specialist', avatar: 'image/Braiding.jpg.jpg', bio: 'Expert in neat knotless braids, simple cornrows, twists & protective hairstyles.' },
    { id: 'sty-4', name: 'Mariama Barrow', role: 'Makeup Artist', avatar: 'image/Makeup2.jpg', bio: 'Specialist in beautiful full glam makeup, client care & beauty transformations.' }
  ],
  appointments: [
    { id: 'apt-1', code: 'AURA-4821', clientName: 'Mariama Jadama', clientPhone: '+220 5393662', serviceName: 'Knotless Braid/Twist (Incl. 2 Pkt Meche)', stylistName: 'Amie Cham', date: '2026-08-15', time: '10:00 AM', price: 1800, status: 'Confirmed' },
    { id: 'apt-2', code: 'AURA-5912', clientName: 'Aminata Jadama', clientPhone: '+220 5141119', serviceName: 'Bridal & Full Glam Makeup', stylistName: 'Fatima Jallow', date: '2026-08-15', time: '02:30 PM', price: 1200, status: 'Pending' }
  ],
  reviews: []
};

// API Bridge
class AuraAPIBridge {
  constructor() {
    this.baseURL = '/api';
    this.initLocalStorage();
  }

  initLocalStorage() {
    localStorage.setItem('aura_services', JSON.stringify(SEED_DATA.services));
    localStorage.setItem('aura_stylists', JSON.stringify(SEED_DATA.stylists));
    if (!localStorage.getItem('aura_appointments')) {
      localStorage.setItem('aura_appointments', JSON.stringify(SEED_DATA.appointments));
    }
    localStorage.removeItem('aura_reviews'); {
      localStorage.setItem('aura_reviews', JSON.stringify(SEED_DATA.reviews));
    }
  }

  async getServices() {
    try {
      const res = await fetch(`${this.baseURL}/services`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return JSON.parse(localStorage.getItem('aura_services'));
  }

  async getAppointments() {
    try {
      const res = await fetch(`${this.baseURL}/appointments`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return JSON.parse(localStorage.getItem('aura_appointments'));
  }

  async createAppointment(booking) {
    try {
      const res = await fetch(`${this.baseURL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const code = 'AURA-' + Math.floor(1000 + Math.random() * 9000);
    const newApt = {
      id: 'apt-' + Date.now(),
      code,
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      serviceName: booking.serviceName,
      stylistName: booking.stylistName || 'Any Available Specialist',
      date: booking.date,
      time: booking.time,
      price: Number(booking.price),
      status: 'Confirmed',
      notes: booking.notes || ''
    };
    const apts = JSON.parse(localStorage.getItem('aura_appointments'));
    apts.unshift(newApt);
    localStorage.setItem('aura_appointments', JSON.stringify(apts));
    return newApt;
  }

  async updateStatus(id, status) {
    try {
      const res = await fetch(`${this.baseURL}/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const apts = JSON.parse(localStorage.getItem('aura_appointments'));
    const apt = apts.find(a => a.id === id);
    if (apt) {
      apt.status = status;
      localStorage.setItem('aura_appointments', JSON.stringify(apts));
    }
    return apt;
  }

  async getReviews() {
    try {
      const res = await fetch(`${this.baseURL}/reviews`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return JSON.parse(localStorage.getItem('aura_reviews'));
  }

  async addReview(review) {
    try {
      const res = await fetch(`${this.baseURL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newRev = {
      id: 'rev-' + Date.now(),
      author: review.author || 'Anonymous',
      rating: Number(review.rating) || 5,
      comment: review.comment,
      date: new Date().toISOString().split('T')[0]
    };
    const revs = JSON.parse(localStorage.getItem('aura_reviews'));
    revs.unshift(newRev);
    localStorage.setItem('aura_reviews', JSON.stringify(revs));
    return newRev;
  }

  async addService(srv) {
    try {
      const res = await fetch(`${this.baseURL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(srv)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newSrv = { id: 'srv-' + Date.now(), ...srv };
    const srvs = JSON.parse(localStorage.getItem('aura_services'));
    srvs.push(newSrv);
    localStorage.setItem('aura_services', JSON.stringify(srvs));
    return newSrv;
  }
}

const api = new AuraAPIBridge();

const state = {
  services: [],
  appointments: [],
  reviews: [],
  filterCategory: 'All',
  adminMode: false
};

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast-box';
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

async function initApp() {
  state.services = await api.getServices();
  state.appointments = await api.getAppointments();
  state.reviews = await api.getReviews();

  renderServices();
  populateBookingSelect();
  renderReviews();
  renderAdminTable();
}

function renderServices() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  const filtered = state.filterCategory === 'All'
    ? state.services
    : state.services.filter(s => s.category === state.filterCategory);

  grid.innerHTML = filtered.map(s => `
    <div class="card">
      <div>
        <h3>${s.name}</h3>
        <p>${s.desc || s.category}</p>
      </div>
      <div class="card-footer">
        <span class="card-price">D${s.price}</span>
        <button class="btn-sm-book" onclick="quickBookService('${s.name}')">Book Now</button>
      </div>
    </div>
  `).join('');
}

function filterServicesCategory(cat, btn) {
  state.filterCategory = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderServices();
}

function populateBookingSelect() {
  const select = document.getElementById('booking-service-select');
  if (select) {
    select.innerHTML = state.services.map(s => `
      <option value="${s.name}" data-price="${s.price}">${s.name} - D${s.price}</option>
    `).join('');
  }

  const stySelect = document.getElementById('booking-stylist-select');
  if (stySelect) {
    stySelect.innerHTML = `<option value="Any Available Specialist">Any Available Specialist</option>` +
      SEED_DATA.stylists.map(st => `
        <option value="${st.name}">${st.name} (${st.role})</option>
      `).join('');
  }
}

function renderStylists() {
  const container = document.getElementById('stylists-grid');
  if (!container) return;
  container.innerHTML = SEED_DATA.stylists.map(st => `
    <div class="card" style="text-align:center;">
      <img src="${st.avatar}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; margin:0 auto 15px auto; border:3px solid var(--white); box-shadow:var(--shadow-soft);" alt="${st.name}">
      <h3 style="margin-bottom:4px;">${st.name}</h3>
      <div style="font-size:0.8rem; font-weight:700; color:var(--primary-terracotta); text-transform:uppercase; margin-bottom:10px;">${st.role}</div>
      <p style="font-size:0.85rem; color:var(--text-muted);">${st.bio}</p>
      <button class="btn-sm-book" style="margin-top:15px; width:100%;" onclick="quickBookStylist('${st.name}')">Book with ${st.name.split(' ')[0]}</button>
    </div>
  `).join('');
}

function quickBookStylist(stylistName) {
  const stySelect = document.getElementById('booking-stylist-select');
  if (stySelect) {
    stySelect.value = stylistName;
  }
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

function quickBookService(serviceName) {
  const select = document.getElementById('booking-service-select');
  if (select) {
    select.value = serviceName;
  }
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

async function handleBookingSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('client-name').value;
  const phone = document.getElementById('client-phone').value;
  const serviceSelect = document.getElementById('booking-service-select');
  const serviceName = serviceSelect.value;
  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  const price = selectedOption ? selectedOption.dataset.price || 500 : 500;
  
  const stySelect = document.getElementById('booking-stylist-select');
  const stylistName = stySelect ? stySelect.value : 'Any Available Specialist';

  const date = document.getElementById('booking-date').value || new Date().toISOString().split('T')[0];
  const time = document.getElementById('booking-time').value || '10:00 AM';
  const notes = document.getElementById('booking-notes').value;

  const newApt = await api.createAppointment({
    clientName: name,
    clientPhone: phone,
    serviceName,
    stylistName,
    price,
    date,
    time,
    notes
  });

  state.appointments.unshift(newApt);
  renderAdminTable();

  const formBox = document.getElementById('booking-form-box');
  formBox.innerHTML = `
    <div class="ticket-card">
      <h3>âœ¨ Booking Confirmed!</h3>
      <p style="color:var(--text-muted); margin-top:5px;">Thank you, ${newApt.clientName}!</p>
      <div class="ticket-code">${newApt.code}</div>
      <p><strong>Service:</strong> ${newApt.serviceName}</p>
      <p><strong>Specialist:</strong> ${newApt.stylistName}</p>
      <p><strong>Date & Time:</strong> ${newApt.date} at ${newApt.time}</p>
      <p style="font-size:1.2rem; font-weight:700; color:var(--onyx-dark); margin-top:10px;">Total: D${newApt.price}</p>
      <button class="btn" style="margin-top:20px; width:100%;" onclick="location.reload()">Book Another Appointment</button>
    </div>
  `;

  showToast(`Appointment Confirmed! Code: ${newApt.code}`);
}

async function lookupBooking() {
  const code = document.getElementById('lookup-code').value.trim().toUpperCase();
  const res = document.getElementById('lookup-result');
  if (!code) {
    showToast('Please enter your Booking Code (e.g. AURA-4821)');
    return;
  }

  const found = state.appointments.filter(a => a.code.toUpperCase() === code || a.clientPhone.includes(code));
  if (found.length === 0) {
    res.innerHTML = `<p style="padding:20px; color:var(--text-muted)">No booking found matching "${code}".</p>`;
    return;
  }

  res.innerHTML = found.map(a => `
    <div class="ticket-card" style="margin-top:15px; border-color:var(--onyx-dark)">
      <div style="font-size:0.85rem; font-weight:700; color:var(--primary-terracotta); text-transform:uppercase;">Booking Status</div>
      <div class="ticket-code">${a.code}</div>
      <p><strong>Status:</strong> <span style="background:var(--onyx-dark); color:white; padding:2px 10px; border-radius:12px;">${a.status}</span></p>
      <p><strong>Client:</strong> ${a.clientName} (${a.clientPhone})</p>
      <p><strong>Service:</strong> ${a.serviceName}</p>
      <p><strong>Date & Time:</strong> ${a.date} at ${a.time}</p>
      <p><strong>Price:</strong> D${a.price}</p>
    </div>
  `).join('');
}

function renderReviews() {
  const container = document.getElementById('reviews-list');
  if (!container) return;
  container.innerHTML = state.reviews.map(r => `
    <div class="review-box">
      <div class="review-stars">${'â˜…'.repeat(r.rating)}</div>
      <p style="font-weight:600; font-size:0.95rem; color:var(--onyx-dark); margin-bottom:5px;">"${r.comment}"</p>
      <div style="font-size:0.8rem; color:var(--text-muted); display:flex; justify-content:space-between;">
        <span>- ${r.author}</span>
        <span>${r.date}</span>
      </div>
    </div>
  `).join('');
}

async function handleReviewSubmit(e) {
  e.preventDefault();
  const author = document.getElementById('review-author').value;
  const comment = document.getElementById('review-comment').value;

  const newRev = await api.addReview({ author, comment, rating: 5 });
  state.reviews.unshift(newRev);
  renderReviews();
  document.getElementById('review-form').reset();
  showToast('Thank you for your client review!');
}

function toggleAdminPortal() {
  state.adminMode = !state.adminMode;
  const adminSec = document.getElementById('admin-portal');
  adminSec.style.display = state.adminMode ? 'block' : 'none';
  if (state.adminMode) {
    adminSec.scrollIntoView({ behavior: 'smooth' });
  }
}

function renderAdminTable() {
  const tbody = document.getElementById('admin-tbody');
  if (!tbody) return;

  const totalRev = state.appointments.reduce((sum, a) => sum + (a.status !== 'Cancelled' ? Number(a.price) : 0), 0);
  document.getElementById('admin-rev-val').innerText = `D${totalRev}`;
  document.getElementById('admin-apt-count').innerText = state.appointments.length;

  tbody.innerHTML = state.appointments.map(a => `
    <tr>
      <td><strong>${a.code}</strong></td>
      <td>${a.clientName}<br/><small>${a.clientPhone}</small></td>
      <td>${a.serviceName}</td>
      <td>${a.date}<br/><small>${a.time}</small></td>
      <td><strong>D${a.price}</strong></td>
      <td>${a.status}</td>
      <td>
        <select onchange="updateAptStatus('${a.id}', this.value)" style="padding:4px; border-radius:4px; font-size:0.8rem;">
          <option value="Confirmed" ${a.status==='Confirmed'?'selected':''}>Confirmed</option>
          <option value="Completed" ${a.status==='Completed'?'selected':''}>Completed</option>
          <option value="Cancelled" ${a.status==='Cancelled'?'selected':''}>Cancelled</option>
        </select>
      </td>
    </tr>
  `).join('');
}

async function updateAptStatus(id, status) {
  await api.updateStatus(id, status);
  state.appointments = await api.getAppointments();
  renderAdminTable();
  showToast(`Updated status to ${status}`);
}

async function handleAddService(e) {
  e.preventDefault();
  const name = document.getElementById('new-srv-name').value;
  const category = document.getElementById('new-srv-cat').value;
  const price = document.getElementById('new-srv-price').value;

  await api.addService({ name, category, price: Number(price) });
  state.services = await api.getServices();
  renderServices();
  populateBookingSelect();
  document.getElementById('add-srv-form').reset();
  showToast('New service added to catalog!');
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

