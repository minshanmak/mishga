const projectStyles = document.createElement('link');
projectStyles.rel = 'stylesheet';
projectStyles.href = 'css/projects.css';
document.head.append(projectStyles);
const form = document.querySelector('#projectForm');
let projects = [];
async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options
  });
  if (!response.ok) throw new Error(response.status);
  return response.status === 204 ? null : response.json();
}

function resetForm() {
  form.reset();
  document.querySelector('#projectId').value = '';
  document.querySelector('#formHeading').textContent = 'Add a project';
  document.querySelector('#saveLabel').textContent = 'Add project';
  document.querySelector('#cancelEdit').hidden = true;
}

function render() {
  const list = document.querySelector('#projectList');
  list.innerHTML = '';
  document.querySelector('#projectCount').textContent = `${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`;
  projects.forEach(project => {
    const part = document.querySelector('#projectTemplate').content.cloneNode(true);
    part.querySelector('h3').textContent = project.title;
    const status = part.querySelector('.project-status');
    status.textContent = project.published ? 'Published' : 'Draft';
    status.classList.add(project.published ? 'is-published' : 'is-draft');
    part.querySelector('.project-card-description').textContent = project.description;
    const tags = part.querySelector('.project-tags');
    project.technologies.split(',').map(tag => tag.trim()).filter(Boolean).forEach(tag => {
      const tagEl = document.createElement('span');
      tagEl.textContent = tag;
      tags.append(tagEl);
    });
    const visit = part.querySelector('.visit-project');
    if (project.live_url) visit.href = project.live_url;
    else visit.hidden = true;
    part.querySelector('.project-menu').addEventListener('click', () => {
      document.querySelector('#projectId').value = project.id;
      document.querySelector('#projectTitle').value = project.title;
      document.querySelector('#projectDescription').value = project.description;
      document.querySelector('#projectTechnologies').value = project.technologies;
      document.querySelector('#projectLiveUrl').value = project.live_url;
      document.querySelector('#projectCaseStudyUrl').value = project.case_study_url;
      document.querySelector('#projectPublished').checked = Boolean(project.published);
      document.querySelector('#formHeading').textContent = 'Edit project';
      document.querySelector('#saveLabel').textContent = 'Save changes';
      document.querySelector('#cancelEdit').hidden = false;
      form.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
    part.querySelector('.delete-project').addEventListener('click', async () => {
      if (confirm(`Delete ${project.title}?`)) {
        await api(`/api/projects/${project.id}`, {
          method: 'DELETE'
        });
        await load();
      }
    });
    list.append(part);
  });
  document.querySelector('#projectEmpty').hidden = projects.length > 0;
  list.hidden = projects.length === 0;
}
async function load() {
  projects = await api('/api/projects');
  render();
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  const id = document.querySelector('#projectId').value;
  const data = {
    title: document.querySelector('#projectTitle').value,
    description: document.querySelector('#projectDescription').value,
    technologies: document.querySelector('#projectTechnologies').value,
    live_url: document.querySelector('#projectLiveUrl').value,
    case_study_url: document.querySelector('#projectCaseStudyUrl').value,
    published: document.querySelector('#projectPublished').checked
  };
  const feedback = document.querySelector('.project-feedback');
  try {
    await api(id ? `/api/projects/${id}` : '/api/projects', {
      method: id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    feedback.textContent = id ? 'Project updated.' : 'Project added.';
    resetForm();
    await load();
  } catch {
    feedback.textContent = 'Unable to save project.';
  }
});
document.querySelector('#cancelEdit').addEventListener('click', resetForm);
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