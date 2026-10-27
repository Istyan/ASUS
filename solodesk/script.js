// Sample Data
const people = [
  { name: 'Maya Cruz', role: 'UI/UX Designer', cat: 'Design', skills: 'Figma · Prototyping', rating: '4.9', initial: 'MC', color: '#e6eaff', ink: '#425ae0' },
  { name: 'Jared Lim', role: 'Frontend Developer', cat: 'Development', skills: 'React · HTML · CSS', rating: '5.0', initial: 'JL', color: '#f9e7ef', ink: '#be5082' },
  { name: 'Aira Santos', role: 'Video Editor', cat: 'Video', skills: 'Premiere Pro · After Effects', rating: '4.8', initial: 'AS', color: '#fff1d9', ink: '#ac761b' },
  { name: 'Noah Reyes', role: 'Graphic Designer', cat: 'Design', skills: 'Photoshop · Illustrator', rating: '4.9', initial: 'NR', color: '#e4f7ed', ink: '#279266' },
  { name: 'Sofia Tan', role: 'Content Writer', cat: 'Writing', skills: 'Copywriting · SEO', rating: '4.8', initial: 'ST', color: '#eee6fc', ink: '#8355c1' },
  { name: 'Ethan Garcia', role: 'Digital Marketer', cat: 'Marketing', skills: 'Social Media · Branding', rating: '4.9', initial: 'EG', color: '#dff5f7', ink: '#238b98' }
];

let mode = 'booking';
let selected = '';

// Render Cards based on Filters
function renderTalent() {
  const query = document.getElementById('search').value.toLowerCase();
  const category = document.getElementById('category').value;

  const filtered = people.filter(p => 
    (category === 'all' || p.cat === category) &&
    [p.name, p.role, p.skills].join(' ').toLowerCase().includes(query)
  );

  document.getElementById('talentgrid').innerHTML = filtered.length 
    ? filtered.map(p => `
        <article class="card">
          <div class="person">
            <div class="avatar" style="background:${p.color}; color:${p.ink}">${p.initial}</div>
            <div>
              <h3>${p.name}</h3>
              <small style="color:var(--muted)">${p.role}</small>
            </div>
          </div>
          <span class="tag">${p.cat}</span>
          <p>${p.skills}</p>
          <div class="row">
            <span class="rating">★ ${p.rating} <small>demo rating</small></span>
            <button class="btn" onclick="openBooking('${p.name}')">Book Now →</button>
          </div>
        </article>
      `).join('')
    : '<div class="empty">No freelancers found. Try another search or category.</div>';
}

// Modal Dialog Helpers
function showModal() {
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('modalsuccess').style.display = 'none';
  document.getElementById('modalform').style.display = 'grid';
  document.getElementById('modalform').reset();
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function openBooking(name) {
  mode = 'booking';
  selected = name;
  document.getElementById('modalkicker').textContent = 'Book a freelancer';
  document.getElementById('modaltitle').textContent = 'Book ' + name;
  document.getElementById('modaldesc').textContent = 'Send a demo project inquiry to ' + name + '.';
  document.getElementById('datefield').style.display = 'grid';
  document.querySelector('#detailslabel span').textContent = 'Project Details';
  document.getElementById('modalsubmit').textContent = 'Submit Booking →';
  showModal();
}

function openJoin() {
  mode = 'join';
  selected = '';
  document.getElementById('modalkicker').textContent = 'Join the community';
  document.getElementById('modaltitle').textContent = 'Welcome to SoloDesk';
  document.getElementById('modaldesc').textContent = 'Tell us about yourself to join our demo community.';
  document.getElementById('datefield').style.display = 'none';
  document.querySelector('#detailslabel span').textContent = 'Your Skills / Interests';
  document.getElementById('modalsubmit').textContent = 'Join SoloDesk →';
  showModal();
}

// LocalStorage Helper
function saveDemo(key, entry) {
  try {
    const all = JSON.parse(localStorage.getItem(key) || '[]');
    all.push(entry);
    localStorage.setItem(key, JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
}

// Event Listeners
document.getElementById('modalform').addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const ok = saveDemo('solodesk_' + mode, {
    type: mode,
    freelancer: selected,
    name: formData.get('name'),
    email: formData.get('email'),
    date: formData.get('date'),
    details: formData.get('details'),
    createdAt: new Date().toISOString()
  });

  document.getElementById('modalform').style.display = 'none';
  const successBox = document.getElementById('modalsuccess');
  successBox.textContent = ok 
    ? '✓ ' + (mode === 'join' ? 'Community registration' : 'Booking request') + ' saved in this browser!'
    : 'This browser could not save the request.';
  successBox.style.display = 'block';
});

document.getElementById('contactform').addEventListener('submit', e => {
  e.preventDefault();
  const entry = Object.fromEntries(new FormData(e.target));
  const ok = saveDemo('solodesk_messages', {
    ...entry,
    createdAt: new Date().toISOString()
  });

  const successBox = document.getElementById('contactsuccess');
  successBox.textContent = ok 
    ? '✓ Your message was saved in this browser for the demo.' 
    : 'This browser could not save your message.';
  successBox.style.display = 'block';

  if (ok) e.target.reset();
});

// Mobile Nav Links Toggle
document.querySelectorAll('.links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navlinks').classList.remove('open');
  });
});

// Set Minimum Date for Booking Field
document.getElementById('bookdate').min = new Date().toISOString().split('T')[0];

// Initialize Talent List on Load
renderTalent();