const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Default Seed Data combining User Flyer & Website Services
const initialData = {
  services: [
    { id: 'srv-1', category: 'Braids & Twists', name: 'Simple Cornrow (No Extension)', price: 300, duration: '45 mins', description: 'Neat & sleek cornrow style using natural hair.', icon: '✨' },
    { id: 'srv-2', category: 'Braids & Twists', name: 'Simple Cornrow (With Extension)', price: 500, duration: '60 mins', description: 'Cornrow styling braided with added premium extensions.', icon: '👑' },
    { id: 'srv-3', category: 'Braids & Twists', name: 'Knotless Braid/Twist (Incl. 2 Pkt Meche)', price: 1800, duration: '180 mins', description: 'Lightweight, pain-free knotless braids including 2 packets of meche.', icon: '💫' },
    { id: 'srv-4', category: 'Braids & Twists', name: 'Knotless Braid/Twist (Client Meche)', price: 700, duration: '150 mins', description: 'Flawless knotless braids service when you supply your own meche hair.', icon: '💇‍♀️' },
    { id: 'srv-5', category: 'Braids & Twists', name: 'Hair Wash & Deep Conditioning', price: 400, duration: '30 mins', description: 'Deep scalp cleanse, scalp massage & hydrating conditioning treatment.', icon: '🧼' },
    { id: 'srv-6', category: 'Lash Extensions', name: 'Classic / Hybrid Lash Extensions', price: 500, duration: '60 mins', description: 'Natural looking classic or hybrid lash set for full fluttery eyes.', icon: '👁️' },
    { id: 'srv-7', category: 'Lash Extensions', name: 'Volume Lash Set & Refill', price: 600, duration: '75 mins', description: 'Full volume lash extensions tailored for dramatic or fluffy look.', icon: '✨' },
    { id: 'srv-8', category: 'Makeup', name: 'Soft Glam Makeup', price: 700, duration: '45 mins', description: 'Fresh, radiant natural daytime or event makeup look.', icon: '💄' },
    { id: 'srv-9', category: 'Makeup', name: 'Bridal & Full Glam Makeup', price: 1200, duration: '75 mins', description: 'High definition full glam with custom contour, eyeshadow & lip.', icon: '💋' },
    { id: 'srv-10', category: 'Hair Cuts', name: 'Hair Cut (Simple)', price: 150, duration: '20 mins', description: 'Precision trim and simple hair cut.', icon: '✂️' },
    { id: 'srv-11', category: 'Hair Cuts', name: 'Hair Cut (High Tech / Fade)', price: 200, duration: '35 mins', description: 'Modern styled cut with detailed fade or line designs.', icon: '💈' },
    { id: 'srv-12', category: 'Hair Cuts', name: 'Hair Cut (Tape Lineup)', price: 200, duration: '30 mins', description: 'Crisp shape-up and razor tape lineup.', icon: '⚡' },
    { id: 'srv-13', category: 'Nails & Brows', name: 'Manicure & Pedicure (Gel Polish)', price: 450, duration: '60 mins', description: 'Nail shaping, cuticle care & long lasting gel polish.', icon: '💅' },
    { id: 'srv-14', category: 'Nails & Brows', name: 'Brows Shaping & Tinting', price: 250, duration: '30 mins', description: 'Precision eyebrow threading/waxing & custom stain tinting.', icon: '👁️' }
  ],
  stylists: [
    { id: 'sty-1', name: 'Amie cham', role: 'Master Braid Specialist', rating: '4.9 ★', experience: '6 yrs exp', avatar: 'image/Braiding.jpg.jpg', bio: 'Expert in pain-free knotless braids, cornrows and protective hairstyles.' },
    { id: 'sty-2', name: 'Fatima Jallow', role: 'Senior Makeup Artist & Lash Tech', rating: '5.0 ★', experience: '5 yrs exp', avatar: 'image/Makeup2.jpg', bio: 'Specializing in long-lasting bridal, full glam, and volume lashes.' },
    { id: 'sty-3', name: '', role: 'Precision Hair Stylist & Barber', rating: '4.8 ★', experience: '7 yrs exp', avatar: 'image/Aura beauty.jpg.jpeg', bio: 'Passionate about sharp cuts, tape lineups, high tech fades and wig melts.' }
  ],
  appointments: [
    { id: 'apt-1', code: 'AURA-4821', clientName: '', clientPhone: '', clientEmail: '', serviceName: '', stylistName: '', date: '', time: '', price: '', status: 'Confirmed', notes: 'Medium size knotless braids' },
    { id: 'apt-2', code: 'AURA-5912', clientName: '', clientPhone: '', clientEmail: '', serviceName: '', stylistName: '', date: '', time: '', price: '', status: 'Pending', notes: 'Event makeup' }
  ],
 
};

function loadDB() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return initialData;
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {}
}

let db = loadDB();

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  const sendJSON = (statusCode, payload) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
  };

  const getBody = (callback) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const json = body ? JSON.parse(body) : {};
        callback(json);
      } catch (err) {
        sendJSON(400, { error: 'Invalid JSON payload' });
      }
    });
  };

  // API ROUTING
  if (pathname === '/api/services' && req.method === 'GET') {
    return sendJSON(200, db.services);
  }

  if (pathname === '/api/services' && req.method === 'POST') {
    return getBody(newService => {
      newService.id = 'srv-' + Date.now();
      db.services.push(newService);
      saveDB(db);
      sendJSON(201, newService);
    });
  }

  if (pathname.startsWith('/api/services/') && req.method === 'DELETE') {
    const id = pathname.split('/')[3];
    db.services = db.services.filter(s => s.id !== id);
    saveDB(db);
    return sendJSON(200, { success: true });
  }

  if (pathname === '/api/stylists' && req.method === 'GET') {
    return sendJSON(200, db.stylists);
  }

  if (pathname === '/api/appointments' && req.method === 'GET') {
    return sendJSON(200, db.appointments);
  }

  if (pathname === '/api/appointments' && req.method === 'POST') {
    return getBody(booking => {
      const code = 'AURA-' + Math.floor(1000 + Math.random() * 9000);
      const newAppointment = {
        id: 'apt-' + Date.now(),
        code,
        clientName: booking.clientName,
        clientPhone: booking.clientPhone,
        clientEmail: booking.clientEmail || '',
        serviceName: booking.serviceName,
        stylistName: booking.stylistName || 'Any Available Stylist',
        date: booking.date,
        time: booking.time,
        price: Number(booking.price),
        status: 'Confirmed',
        notes: booking.notes || '',
        createdAt: new Date().toISOString()
      };
      db.appointments.unshift(newAppointment);
      saveDB(db);
      sendJSON(201, newAppointment);
    });
  }

  if (pathname.startsWith('/api/appointments/') && pathname.endsWith('/status') && req.method === 'PATCH') {
    const id = pathname.split('/')[3];
    return getBody(({ status }) => {
      const apt = db.appointments.find(a => a.id === id);
      if (apt) {
        apt.status = status;
        saveDB(db);
        sendJSON(200, apt);
      } else {
        sendJSON(404, { error: 'Appointment not found' });
      }
    });
  }

  if (pathname === '/api/reviews' && req.method === 'GET') {
    return sendJSON(200, db.reviews);
  }

  if (pathname === '/api/reviews' && req.method === 'POST') {
    return getBody(rev => {
      const newReview = {
        id: 'rev-' + Date.now(),
        author: rev.author || 'Anonymous Client',
        rating: Number(rev.rating) || 5,
        comment: rev.comment,
        date: new Date().toISOString().split('T')[0]
      };
      db.reviews.unshift(newReview);
      saveDB(db);
      sendJSON(201, newReview);
    });
  }

  if (pathname === '/api/stats' && req.method === 'GET') {
    const totalRevenue = db.appointments.reduce((sum, a) => sum + (a.price || 0), 0);
    const confirmedCount = db.appointments.filter(a => a.status === 'Confirmed').length;
    const pendingCount = db.appointments.filter(a => a.status === 'Pending').length;
    return sendJSON(200, {
      totalRevenue,
      totalAppointments: db.appointments.length,
      confirmedCount,
      pendingCount,
      servicesCount: db.services.length
    });
  }

  // Static File Server
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
  };

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`✨ Aura Beauty Salon REST Server running at http://localhost:${PORT}`);
});
