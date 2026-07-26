document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const backTop = document.querySelector('.back-top');
  window.addEventListener('load', () => document.querySelector('.loader').classList.add('loaded'));
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', open);
    menu.innerHTML = `<i class="fa-solid fa-${open ? 'xmark' : 'bars'}"></i>`;
  });
  links.forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));
  const sections = document.querySelectorAll('main section[id], header[id]');
  const updateScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 15);
    backTop.classList.toggle('visible', window.scrollY > 600);
    let current = 'home';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 160) current = s.id;
    });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', updateScroll, {
    passive: true
  });
  updateScroll();
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('shown');
      observer.unobserve(entry.target);
    }
  }), {
    threshold: .12
  });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  document.querySelector('.contact-form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    const message = form.querySelector('.form-message');
    button.disabled = true;
    message.textContent = 'Sending your message…';
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
      });
      if (!response.ok) throw new Error('Unable to send message');
      message.textContent = 'Thanks! Your message has been sent successfully.';
      form.reset();
    } catch (error) {
      message.textContent = 'Something went wrong. Please email us directly at hello@mishga.in.';
    } finally {
      button.disabled = false;
    }
  });
  fetch('/api/projects').then(response => response.ok ? response.json() : []).then(projects => {
    const project = projects.find(item => item.published);
    const section = document.querySelector('.featured-copy');
    if (!project || !section) return;
    const title = section.querySelector('h2');
    const words = project.title.trim().split(/\s+/);
    const emphasized = words.pop();
    title.textContent = `${words.join(' ')} `;
    const emphasis = document.createElement('em');
    emphasis.textContent = emphasized;
    title.append(emphasis);
    section.querySelector('p:not(.eyebrow)').textContent = project.description;
    const badges = section.querySelector('.badges');
    badges.innerHTML = '';
    project.technologies.split(',').map(item => item.trim()).filter(Boolean).forEach(item => {
      const badge = document.createElement('span');
      badge.textContent = item;
      badges.append(badge);
    });
    const live = section.querySelector('.project-actions a');
    if (project.live_url) {
      live.href = project.live_url;
      live.target = '_blank';
      live.rel = 'noopener';
    } else live.style.display = 'none';
    const remainingProjects = projects.filter(item => item.id !== project.id);
    if (!remainingProjects.length) return;
    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = 'css/portfolio.css';
    document.head.append(styles);
    const library = document.createElement('section');
    library.className = 'portfolio-library';
    const container = document.createElement('div');
    container.className = 'container';
    const heading = document.createElement('div');
    heading.className = 'portfolio-library-head';
    heading.innerHTML = '<h2>More <em>Selected Work</em></h2><p>Explore more projects built for ambitious businesses.</p>';
    const grid = document.createElement('div');
    grid.className = 'portfolio-grid';
    remainingProjects.forEach(item => {
      const card = document.createElement('article');
      card.className = 'portfolio-card';
      const icon = document.createElement('div');
      icon.className = 'portfolio-card-icon';
      icon.innerHTML = '<i class="fa-solid fa-gem"></i>';
      const title = document.createElement('h3');
      title.textContent = item.title;
      const description = document.createElement('p');
      description.textContent = item.description;
      const tags = document.createElement('div');
      tags.className = 'portfolio-card-tags';
      item.technologies.split(',').map(tag => tag.trim()).filter(Boolean).forEach(tag => {
        const label = document.createElement('span');
        label.textContent = tag;
        tags.append(label);
      });
      card.append(icon, title, description, tags);
      if (item.live_url) {
        const link = document.createElement('a');
        link.href = item.live_url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.innerHTML = 'View Project <i class="fa-solid fa-arrow-up-right-from-square"></i>';
        card.append(link);
      }
      grid.append(card);
    });
    container.append(heading, grid);
    library.append(container);
    document.querySelector('.featured').insertAdjacentElement('afterend', library);
  }).catch(() => {});
});