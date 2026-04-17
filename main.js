(() => {
  const isMobile = () => matchMedia('(max-width: 768px)').matches;
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ICONS = {
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.26 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.67.8.56C20.22 21.38 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
  };

  const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  const PAUSE_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';

  function youtubeId(url) {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  function youtubeEmbed(id, opts = {}) {
    const params = new URLSearchParams({
      autoplay: '1', mute: '1', loop: '1', playlist: id,
      controls: opts.controls ? '1' : '0', modestbranding: '1', playsinline: '1', rel: '0'
    });
    const iframe = el('iframe', {
      src: `https://www.youtube.com/embed/${id}?${params}`,
      frameBorder: '0',
      allow: 'autoplay; encrypted-media',
      allowFullscreen: false,
      loading: 'lazy',
      title: opts.alt || ''
    });
    iframe.style.cssText = `width:100%;height:100%;border:0;pointer-events:${opts.controls ? 'auto' : 'none'};`;
    if (opts.filter) iframe.style.filter = opts.filter;
    return iframe;
  }

  const el = (tag, attrs = {}, html) => {
    const n = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'style') for (const s in attrs.style) n.style.setProperty(s, attrs.style[s]);
      else if (k in n) n[k] = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (html != null) n.innerHTML = html;
    return n;
  };

  function renderHero(meta) {
    const name = document.querySelector('.hero-name');
    name.textContent = meta.name;
    document.querySelector('.hero-title').textContent = meta.title;
    document.querySelector('.hero-tagline').textContent = meta.tagline;

    const contact = document.querySelector('.hero-contact');
    const links = [
      meta.contact.github && { href: meta.contact.github, label: 'GitHub', icon: ICONS.github },
      meta.contact.linkedin && { href: meta.contact.linkedin, label: 'LinkedIn', icon: ICONS.linkedin },
      meta.contact.email && { href: '#', label: 'Email', icon: ICONS.email, email: meta.contact.email }
    ].filter(Boolean);
    links.forEach(l => {
      const a = el('a', { href: l.href, 'aria-label': l.label, rel: 'noopener' }, l.icon);
      if (l.email) {
        a.addEventListener('click', e => {
          e.preventDefault();
          navigator.clipboard.writeText(l.email).then(() => {
            a.classList.add('copied');
            const orig = a.innerHTML;
            a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
            setTimeout(() => { a.innerHTML = orig; a.classList.remove('copied'); }, 1500);
          }).catch(() => {
            window.prompt('Copy email:', l.email);
          });
        });
      } else if (l.href.startsWith('http')) {
        a.target = '_blank';
      }
      contact.appendChild(a);
    });

    document.title = `${meta.name} — ${meta.title}`;

    if (meta.heroBackground) {
      document.querySelector('.hero-bg')?.style.setProperty('--hero-bg', `url(${meta.heroBackground})`);
    }

    renderMosaic(meta.mosaic);
  }

  function renderMosaic(tiles) {
    const mosaic = document.querySelector('.hero-mosaic');
    if (!mosaic) return;
    if (!tiles || !tiles.length) { mosaic.remove(); return; }

    tiles.forEach(t => {
      const tile = el('div', { className: `m-tile size-${t.size || 'square'}` });
      const ytId = youtubeId(t.src);
      if (ytId) {
        tile.appendChild(youtubeEmbed(ytId, t));
      } else {
        const isVideo = t.type === 'video' || /\.(webm|mp4)$/i.test(t.src || '');
        if (isVideo) {
          const v = el('video', {
            muted: true, loop: true, playsInline: true, autoplay: true,
            preload: 'metadata', poster: t.poster || ''
          });
          v.appendChild(el('source', { src: t.src }));
          if (t.filter) v.style.filter = t.filter;
          tile.appendChild(v);
        } else {
          const img = el('img', { src: t.src, alt: t.alt || '', loading: 'lazy' });
          if (t.filter) img.style.filter = t.filter;
          tile.appendChild(img);
        }
      }
      mosaic.appendChild(tile);
    });

    mosaic.querySelectorAll('.m-tile').forEach((t, i) => {
      t.style.setProperty('--tile-delay', `${i * 80}ms`);
    });

    const btn = document.querySelector('.mosaic-reveal');
    const wrap = document.querySelector('.hero-mosaic-wrap');
    if (btn && wrap) {
      const stackCards = btn.querySelectorAll('.stack-card');
      tiles.slice(0, 3).forEach((t, i) => {
        if (stackCards[i] && !youtubeId(t.src) && !/\.(webm|mp4)$/i.test(t.src)) {
          stackCards[i].style.backgroundImage = `url(${t.src})`;
        }
      });
      btn.addEventListener('click', () => {
        wrap.classList.add('revealed');
      });
    }
  }

  function renderAbout(about) {
    const img = document.querySelector('.about-image');
    const text = document.querySelector('.about-text');
    if (!img || !text) return;
    if (about?.image) img.appendChild(el('img', { src: about.image, alt: '' }));
    else img.remove();
    text.textContent = about?.text || '';
  }

  function createProjectCard(p) {
    const item = el('article', { className: 'timeline-item', style: { '--project-color': p.color } });

    const mediaWrap = el('div', { className: 'project-media' });
    const ytId = youtubeId(p.video);
    let video = null;

    if (ytId) {
      const iframe = youtubeEmbed(ytId, { alt: p.title, controls: true });
      mediaWrap.appendChild(iframe);
    } else {
      video = el('video', {
        muted: true, loop: true, playsInline: true,
        preload: 'metadata', poster: p.poster || ''
      });
      if (p.video) {
        const ext = p.video.split('.').pop().toLowerCase();
        const type = ext === 'mp4' ? 'video/mp4' : 'video/webm';
        video.appendChild(el('source', { src: p.video, type }));
      }
      video.addEventListener('error', () => {}, true);
      mediaWrap.appendChild(video);

      const btn = el('button', { className: 'play-btn', 'aria-label': 'Play/Pause', type: 'button' }, PLAY_ICON);
      btn.addEventListener('click', e => {
        e.preventDefault();
        if (video.paused) {
          video.play().catch(() => {});
          btn.innerHTML = PAUSE_ICON;
        } else {
          video.pause();
          btn.innerHTML = PLAY_ICON;
        }
      });
      video.addEventListener('play', () => { btn.innerHTML = PAUSE_ICON; });
      video.addEventListener('pause', () => { btn.innerHTML = PLAY_ICON; });
      mediaWrap.appendChild(btn);
    }

    const node = el('div', { className: 'timeline-node' });

    const body = el('div', { className: 'project-body' });
    const header = el('div', { className: 'project-header' });
    header.appendChild(el('h3', { className: 'project-title' }, p.title));
    header.appendChild(el('span', { className: 'project-date' }, p.date));
    body.appendChild(header);
    body.appendChild(el('p', { className: 'project-desc' }, p.description));

    if (p.tags && p.tags.length) {
      const tags = el('div', { className: 'project-tags' });
      p.tags.forEach(t => tags.appendChild(el('span', { className: 'project-tag' }, t)));
      body.appendChild(tags);
    }

    if (p.link) {
      const link = el('a', {
        className: 'project-link', href: p.link, target: '_blank', rel: 'noopener'
      }, 'View project &rarr;');
      body.appendChild(link);
    }

    item.appendChild(mediaWrap);
    item.appendChild(node);
    item.appendChild(body);
    return { item, video };
  }

  function renderTimeline(projects) {
    const container = document.querySelector('.timeline-items');
    const entries = projects.map(p => {
      const { item, video } = createProjectCard(p);
      container.appendChild(item);
      return { item, video };
    });

    const observer = new IntersectionObserver((items) => {
      items.forEach(entry => {
        const { item, video } = entries.find(e => e.item === entry.target) || {};
        if (!item) return;
        if (entry.isIntersecting) {
          item.classList.add('revealed');
          if (video && !reducedMotion() && video.querySelector('source')) {
            video.play().catch(() => {});
          }
        } else if (video && !video.paused) {
          video.pause();
        }
      });
    }, { threshold: 0.35 });

    entries.forEach(e => observer.observe(e.item));

    const focusObserver = new IntersectionObserver((items) => {
      items.forEach(entry => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    }, { threshold: 0.8 });

    entries.forEach(e => focusObserver.observe(e.item));
  }

  function initProgressLine() {
    const timeline = document.querySelector('.timeline');
    const progress = document.querySelector('.timeline-progress');
    if (!timeline || !progress) return;

    let ticking = false;
    const update = () => {
      const rect = timeline.getBoundingClientRect();
      const viewH = window.innerHeight;
      const scrolled = Math.max(0, viewH * 0.5 - rect.top);
      const h = Math.min(rect.height, scrolled);
      progress.style.height = `${h}px`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  async function init() {
    document.getElementById('year').textContent = new Date().getFullYear();
    try {
      const res = await fetch('data/projects.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      renderHero(data.meta);
      renderAbout(data.about);
      renderTimeline(data.projects || []);
      initProgressLine();
    } catch (err) {
      console.error('Failed to load projects.json:', err);
      document.querySelector('.hero-tagline').textContent =
        'Could not load data. Serve via local HTTP server (see README).';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
