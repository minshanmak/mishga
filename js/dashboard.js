const list = document.querySelector('#enquiryList');
const template = document.querySelector('#messageTemplate');
let enquiries = [];
async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options
  });
  if (!response.ok) throw new Error(response.status);
  return response.status === 204 ? null : response.json();
}
const dateText = value => new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short'
}).format(new Date(value));
const relativeTime = value => {
  const minutes = Math.floor((Date.now() - new Date(value)) / 60000);
  return minutes < 1 ? 'Now' : minutes < 60 ? `${minutes}m ago` : minutes < 1440 ? `${Math.floor(minutes / 60)}h ago` : `${Math.floor(minutes / 1440)}d ago`;
};

function updateStats() {
  const today = new Date().toDateString();
  document.querySelector('#totalCount').textContent = enquiries.length;
  document.querySelector('#sidebarCount').textContent = enquiries.length;
  document.querySelector('#todayCount').textContent = enquiries.filter(item => new Date(item.created_at).toDateString() === today).length;
  document.querySelector('#latestTime').textContent = enquiries.length ? relativeTime(enquiries[0].created_at) : '—';
  document.querySelector('#messageCount').textContent = `${enquiries.length} ${enquiries.length === 1 ? 'message' : 'messages'}`;
}

function draw(query = '') {
  const matches = enquiries.filter(item => `${item.name} ${item.email} ${item.phone} ${item.service} ${item.message}`.toLowerCase().includes(query.trim().toLowerCase()));
  list.innerHTML = '';
  matches.forEach(item => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector('.message-item');
    const main = fragment.querySelector('.message-main');
    fragment.querySelector('.message-initial').textContent = item.name.charAt(0).toUpperCase();
    fragment.querySelector('.message-summary strong').textContent = item.name;
    fragment.querySelector('.message-summary small').textContent = item.email;
    fragment.querySelector('.message-service').textContent = item.service || 'General enquiry';
    fragment.querySelector('time').textContent = relativeTime(item.created_at);
    fragment.querySelector('.detail-email').textContent = item.email;
    fragment.querySelector('.detail-email').href = `mailto:${item.email}`;
    fragment.querySelector('.detail-phone').textContent = item.phone || 'Not provided';
    fragment.querySelector('.detail-phone').href = item.phone ? `tel:${item.phone}` : '#';
    fragment.querySelector('.detail-service').textContent = item.service || 'General enquiry';
    fragment.querySelector('.detail-date').textContent = dateText(item.created_at);
    fragment.querySelector('.detail-message p').textContent = item.message;
    fragment.querySelector('.reply-link').href = `mailto:${item.email}?subject=${encodeURIComponent('Re: Your enquiry to MishGa')}`;
    main.addEventListener('click', () => card.classList.toggle('expanded'));
    fragment.querySelector('.delete-message').addEventListener('click', async () => {
      if (confirm(`Delete the enquiry from ${item.name}?`)) {
        await api(`/api/enquiries/${item.id}`, {
          method: 'DELETE'
        });
        await load();
      }
    });
    list.append(fragment);
  });
  document.querySelector('#emptyState').hidden = matches.length > 0;
  list.hidden = matches.length === 0;
}
async function load() {
  enquiries = await api('/api/enquiries');
  updateStats();
  draw(document.querySelector('#searchInput').value);
}
document.querySelector('#searchInput').addEventListener('input', event => draw(event.target.value));
document.querySelector('#clearButton').addEventListener('click', async () => {
  if (enquiries.length && confirm('Permanently delete every enquiry?')) {
    await api('/api/enquiries', {
      method: 'DELETE'
    });
    await load();
  }
});
document.querySelector('#logoutButton').addEventListener('click', async () => {
  await api('/api/logout', {
    method: 'POST'
  });
  window.location.replace('/admin');
});
document.querySelector('#mobileMenu').addEventListener('click', () => document.querySelector('.console-sidebar').classList.toggle('open'));
api('/api/session').then(result => {
  if (!result.authenticated) window.location.replace('/admin');
  else load();
}).catch(() => window.location.replace('/admin'));