/* ============================================================
   Zertix Resume Builder — Client Logic
   Handles: State, Preview, CRUD, AI, PDF, Skills, Templates
   ============================================================ */

'use strict';

// ─── Global State ─────────────────────────────────────────────────────────────
const State = {
  currentResumeId: null,
  currentTemplate: 'modern',
  zoomLevel: 75,
  isDirty: false,
  isSaving: false,
  deleteTargetId: null,

  data: {
    title: '',
    targetJobRole: '',
    template: 'modern',
    personalInfo: {
      fullName: '', email: '', phone: '', location: '',
      linkedin: '', github: '', portfolio: '',
      jobTitle: '', summary: ''
    },
    education:      [],
    experience:     [],
    projects:       [],
    certifications: [],
    skills: { technical: [], soft: [], languages: [], tools: [] }
  }
};

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadResumeList();
  updatePreview();

  // Auto-save every 60s if dirty
  setInterval(() => {
    if (State.isDirty && State.currentResumeId) saveResume(true);
  }, 60000);
});

// ─── View Switching ───────────────────────────────────────────────────────────
function showView(view) {
  const listEl    = document.getElementById('view-list');
  const builderEl = document.getElementById('view-builder');
  const ptabList  = document.getElementById('ptab-list');
  const ptabBuild = document.getElementById('ptab-builder');
  const btnBack   = document.getElementById('btn-back-list');
  const btnSave   = document.getElementById('btn-save-resume');
  const btnDl     = document.getElementById('btn-download-pdf');
  const btnAts    = document.getElementById('btn-analyze-ats');

  if (view === 'list') {
    listEl.style.display    = 'block';
    builderEl.style.display = 'none';
    ptabList.classList.add('active');
    ptabBuild.classList.remove('active');
    btnBack.style.display  = 'none';
    btnSave.style.display  = 'none';
    btnDl.style.display    = 'none';
    btnAts.style.display   = 'none';
    loadResumeList();
  } else {
    listEl.style.display    = 'none';
    builderEl.style.display = 'block';
    ptabList.classList.remove('active');
    ptabBuild.classList.add('active');
    btnBack.style.display  = 'inline-flex';
    btnSave.style.display  = 'inline-flex';
    btnDl.style.display    = 'inline-flex';
    btnAts.style.display   = 'inline-flex';
    updatePreview();
  }
}

function switchTab(tab) {
  document.querySelectorAll('.rb-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.rb-tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('content-' + tab).classList.add('active');
}

function toggleMobilePreview() {
  const panel = document.getElementById('preview-panel');
  panel.classList.toggle('show-mobile');
}

// ─── Zoom ──────────────────────────────────────────────────────────────────────
function adjustZoom(delta) {
  State.zoomLevel = Math.min(120, Math.max(40, State.zoomLevel + delta));
  document.getElementById('preview-scale-wrap').style.transform =
    `scale(${State.zoomLevel / 100})`;
  document.getElementById('preview-zoom-label').textContent = State.zoomLevel + '%';
}

// ─── Read Form → State ────────────────────────────────────────────────────────
function readForm() {
  const g = id => document.getElementById(id)?.value?.trim() || '';

  State.data.title         = g('resume-title');
  State.data.targetJobRole = g('target-job-role');
  State.data.template      = State.currentTemplate;

  State.data.personalInfo = {
    fullName:  g('pi-fullName'),
    email:     g('pi-email'),
    phone:     g('pi-phone'),
    location:  g('pi-location'),
    linkedin:  g('pi-linkedin'),
    github:    g('pi-github'),
    portfolio: g('pi-portfolio'),
    jobTitle:  g('pi-jobTitle'),
    summary:   g('pi-summary'),
  };

  State.isDirty = true;
}

// ─── Populate Form ← Data ─────────────────────────────────────────────────────
function populateForm(data) {
  const s = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  s('resume-title',    data.title);
  s('target-job-role', data.targetJobRole);

  const p = data.personalInfo || {};
  s('pi-fullName',  p.fullName);
  s('pi-email',     p.email);
  s('pi-phone',     p.phone);
  s('pi-location',  p.location);
  s('pi-linkedin',  p.linkedin);
  s('pi-github',    p.github);
  s('pi-portfolio', p.portfolio);
  s('pi-jobTitle',  p.jobTitle);
  s('pi-summary',   p.summary);

  // Dynamic sections
  State.data.experience     = data.experience     || [];
  State.data.education      = data.education      || [];
  State.data.projects       = data.projects       || [];
  State.data.certifications = data.certifications || [];
  State.data.skills         = data.skills         || { technical:[], soft:[], languages:[], tools:[] };

  renderAllSections();
  renderAllSkills();
  setTemplate(data.template || 'modern');
}

// ─── Template ─────────────────────────────────────────────────────────────────
function setTemplate(name) {
  State.currentTemplate = name;
  State.data.template   = name;

  // Update card active states
  ['modern','classic','minimal','executive'].forEach(t => {
    document.getElementById('tcard-' + t)?.classList.toggle('active', t === name);
  });

  updatePreview();
}

// ─── Dynamic Section Renderers ────────────────────────────────────────────────

function renderAllSections() {
  renderExperienceList();
  renderEducationList();
  renderProjectsList();
  renderCertificationsList();
}

// ── Experience ────────────────────────────────────────────────────────────────
function addExperience() {
  State.data.experience.push({
    _id: uid(), company: '', position: '', location: '',
    startDate: '', endDate: '', current: false, description: ''
  });
  renderExperienceList();
  updatePreview();
}

function removeExperience(id) {
  State.data.experience = State.data.experience.filter(e => e._id !== id);
  renderExperienceList();
  updatePreview();
}

function renderExperienceList() {
  const container = document.getElementById('experience-list');
  if (!container) return;

  if (!State.data.experience.length) {
    container.innerHTML = `<p style="color:var(--zx-muted);font-size:0.85rem;padding:8px 0">
      No experience added yet.</p>`;
    return;
  }

  container.innerHTML = State.data.experience.map((exp, i) => `
    <div class="section-card" id="exp-card-${exp._id}">
      <div class="section-card-header">
        <span class="section-card-title">
          ${exp.position || 'New Experience'} ${exp.company ? `@ ${exp.company}` : ''}
        </span>
        <button class="btn btn-danger btn-sm" onclick="removeExperience('${exp._id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Company *</label>
          <input type="text" value="${esc(exp.company)}" placeholder="Google"
            oninput="updateExp('${exp._id}','company',this.value)" />
        </div>
        <div class="form-group">
          <label>Position *</label>
          <input type="text" value="${esc(exp.position)}" placeholder="Software Engineer"
            oninput="updateExp('${exp._id}','position',this.value)" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Location</label>
          <input type="text" value="${esc(exp.location)}" placeholder="Remote / Bangalore"
            oninput="updateExp('${exp._id}','location',this.value)" />
        </div>
        <div class="form-group">
          <label>Start Date</label>
          <input type="month" value="${esc(exp.startDate)}"
            oninput="updateExp('${exp._id}','startDate',this.value)" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>End Date</label>
          <input type="month" value="${esc(exp.endDate)}" ${exp.current ? 'disabled' : ''}
            oninput="updateExp('${exp._id}','endDate',this.value)" id="enddate-${exp._id}" />
        </div>
        <div class="form-group" style="display:flex;align-items:flex-end;gap:8px;padding-bottom:2px">
          <label style="display:flex;align-items:center;gap:6px;text-transform:none;letter-spacing:0;margin:0">
            <input type="checkbox" ${exp.current ? 'checked' : ''}
              onchange="toggleCurrentJob('${exp._id}',this.checked)"
              style="width:auto;background:none;border:none;padding:0" />
            Currently working here
          </label>
        </div>
      </div>
      <div class="form-group">
        <label>Description / Achievements</label>
        <div class="ai-toolbar">
          <button class="ai-btn" onclick="aiImproveExp('${exp._id}')">
            <i class="fas fa-wand-sparkles"></i> AI Improve
          </button>
        </div>
        <textarea placeholder="• Led a team of 5 engineers to deliver..."
          oninput="updateExp('${exp._id}','description',this.value)"
          rows="4">${esc(exp.description)}</textarea>
      </div>
    </div>
  `).join('');
}

function updateExp(id, field, value) {
  const exp = State.data.experience.find(e => e._id === id);
  if (exp) { exp[field] = value; State.isDirty = true; updatePreviewDebounced(); }
}

function toggleCurrentJob(id, checked) {
  const exp = State.data.experience.find(e => e._id === id);
  if (exp) {
    exp.current  = checked;
    exp.endDate  = checked ? '' : exp.endDate;
    const endEl  = document.getElementById('enddate-' + id);
    if (endEl) { endEl.disabled = checked; endEl.value = ''; }
    updatePreviewDebounced();
  }
}

// ── Education ─────────────────────────────────────────────────────────────────
function addEducation() {
  State.data.education.push({
    _id: uid(), institution: '', degree: '', field: '',
    startDate: '', endDate: '', grade: '', description: ''
  });
  renderEducationList();
  updatePreview();
}

function removeEducation(id) {
  State.data.education = State.data.education.filter(e => e._id !== id);
  renderEducationList();
  updatePreview();
}

function renderEducationList() {
  const container = document.getElementById('education-list');
  if (!container) return;

  if (!State.data.education.length) {
    container.innerHTML = `<p style="color:var(--zx-muted);font-size:0.85rem;padding:8px 0">
      No education added yet.</p>`;
    return;
  }

  container.innerHTML = State.data.education.map(edu => `
    <div class="section-card">
      <div class="section-card-header">
        <span class="section-card-title">
          ${edu.degree || 'New Education'} ${edu.institution ? `— ${edu.institution}` : ''}
        </span>
        <button class="btn btn-danger btn-sm" onclick="removeEducation('${edu._id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Institution *</label>
          <input type="text" value="${esc(edu.institution)}" placeholder="IIT Bombay"
            oninput="updateEdu('${edu._id}','institution',this.value)" />
        </div>
        <div class="form-group">
          <label>Degree *</label>
          <input type="text" value="${esc(edu.degree)}" placeholder="B.Tech / B.Sc"
            oninput="updateEdu('${edu._id}','degree',this.value)" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Field of Study</label>
          <input type="text" value="${esc(edu.field)}" placeholder="Computer Science"
            oninput="updateEdu('${edu._id}','field',this.value)" />
        </div>
        <div class="form-group">
          <label>Grade / CGPA</label>
          <input type="text" value="${esc(edu.grade)}" placeholder="8.5 / 10"
            oninput="updateEdu('${edu._id}','grade',this.value)" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Start Date</label>
          <input type="month" value="${esc(edu.startDate)}"
            oninput="updateEdu('${edu._id}','startDate',this.value)" />
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="month" value="${esc(edu.endDate)}"
            oninput="updateEdu('${edu._id}','endDate',this.value)" />
        </div>
      </div>
    </div>
  `).join('');
}

function updateEdu(id, field, value) {
  const edu = State.data.education.find(e => e._id === id);
  if (edu) { edu[field] = value; State.isDirty = true; updatePreviewDebounced(); }
}

// ── Projects ──────────────────────────────────────────────────────────────────
function addProject() {
  State.data.projects.push({
    _id: uid(), name: '', techStack: '', liveUrl: '',
    githubUrl: '', startDate: '', endDate: '', description: ''
  });
  renderProjectsList();
  updatePreview();
}

function removeProject(id) {
  State.data.projects = State.data.projects.filter(p => p._id !== id);
  renderProjectsList();
  updatePreview();
}

function renderProjectsList() {
  const container = document.getElementById('projects-list');
  if (!container) return;

  if (!State.data.projects.length) {
    container.innerHTML = `<p style="color:var(--zx-muted);font-size:0.85rem;padding:8px 0">
      No projects added yet.</p>`;
    return;
  }

  container.innerHTML = State.data.projects.map(proj => `
    <div class="section-card">
      <div class="section-card-header">
        <span class="section-card-title">${proj.name || 'New Project'}</span>
        <button class="btn btn-danger btn-sm" onclick="removeProject('${proj._id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Project Name *</label>
          <input type="text" value="${esc(proj.name)}" placeholder="Zertix Platform"
            oninput="updateProj('${proj._id}','name',this.value)" />
        </div>
        <div class="form-group">
          <label>Tech Stack</label>
          <input type="text" value="${esc(proj.techStack)}" placeholder="Node.js, React, MongoDB"
            oninput="updateProj('${proj._id}','techStack',this.value)" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Live URL</label>
          <input type="text" value="${esc(proj.liveUrl)}" placeholder="https://zertix.com"
            oninput="updateProj('${proj._id}','liveUrl',this.value)" />
        </div>
        <div class="form-group">
          <label>GitHub URL</label>
          <input type="text" value="${esc(proj.githubUrl)}" placeholder="github.com/user/repo"
            oninput="updateProj('${proj._id}','githubUrl',this.value)" />
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <div class="ai-toolbar">
          <button class="ai-btn" onclick="aiGenerateProjectDesc('${proj._id}')">
            <i class="fas fa-magic"></i> AI Generate
          </button>
        </div>
        <textarea placeholder="• Built a full-stack platform that..."
          oninput="updateProj('${proj._id}','description',this.value)"
          rows="3">${esc(proj.description)}</textarea>
      </div>
    </div>
  `).join('');
}

function updateProj(id, field, value) {
  const proj = State.data.projects.find(p => p._id === id);
  if (proj) { proj[field] = value; State.isDirty = true; updatePreviewDebounced(); }
}

// ── Certifications ────────────────────────────────────────────────────────────
function addCertification() {
  State.data.certifications.push({
    _id: uid(), name: '', issuer: '', issueDate: '',
    expiryDate: '', credentialId: '', credentialUrl: ''
  });
  renderCertificationsList();
  updatePreview();
}

function removeCertification(id) {
  State.data.certifications = State.data.certifications.filter(c => c._id !== id);
  renderCertificationsList();
  updatePreview();
}

function renderCertificationsList() {
  const container = document.getElementById('certifications-list');
  if (!container) return;

  if (!State.data.certifications.length) {
    container.innerHTML = `<p style="color:var(--zx-muted);font-size:0.85rem;padding:8px 0">
      No certifications added yet.</p>`;
    return;
  }

  container.innerHTML = State.data.certifications.map(cert => `
    <div class="section-card">
      <div class="section-card-header">
        <span class="section-card-title">${cert.name || 'New Certification'}</span>
        <button class="btn btn-danger btn-sm" onclick="removeCertification('${cert._id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Certification Name *</label>
          <input type="text" value="${esc(cert.name)}" placeholder="AWS Solutions Architect"
            oninput="updateCert('${cert._id}','name',this.value)" />
        </div>
        <div class="form-group">
          <label>Issuing Organization</label>
          <input type="text" value="${esc(cert.issuer)}" placeholder="Amazon Web Services"
            oninput="updateCert('${cert._id}','issuer',this.value)" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Issue Date</label>
          <input type="month" value="${esc(cert.issueDate)}"
            oninput="updateCert('${cert._id}','issueDate',this.value)" />
        </div>
        <div class="form-group">
          <label>Expiry Date</label>
          <input type="month" value="${esc(cert.expiryDate)}"
            oninput="updateCert('${cert._id}','expiryDate',this.value)" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Credential ID</label>
          <input type="text" value="${esc(cert.credentialId)}" placeholder="ABC-123-XYZ"
            oninput="updateCert('${cert._id}','credentialId',this.value)" />
        </div>
        <div class="form-group">
          <label>Credential URL</label>
          <input type="text" value="${esc(cert.credentialUrl)}" placeholder="https://..."
            oninput="updateCert('${cert._id}','credentialUrl',this.value)" />
        </div>
      </div>
    </div>
  `).join('');
}

function updateCert(id, field, value) {
  const cert = State.data.certifications.find(c => c._id === id);
  if (cert) { cert[field] = value; State.isDirty = true; updatePreviewDebounced(); }
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function renderAllSkills() {
  ['technical','soft','languages','tools'].forEach(renderSkillCategory);
}

function renderSkillCategory(category) {
  const container = document.getElementById('skills-' + category);
  if (!container) return;
  const skills = State.data.skills[category] || [];
  container.innerHTML = skills.map(skill => `
    <span class="skill-tag">
      ${esc(skill)}
      <button onclick="removeSkill('${category}','${esc(skill)}')" title="Remove">×</button>
    </span>
  `).join('');
}

function addSkillFromInput(category) {
  const input = document.getElementById('input-' + category);
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  addSkill(category, val);
  input.value = '';
  input.focus();
}

function handleSkillInput(event, category) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault();
    addSkillFromInput(category);
  }
}

function addSkill(category, skill) {
  if (!State.data.skills[category]) State.data.skills[category] = [];
  const normalized = skill.trim();
  if (!normalized) return;
  if (State.data.skills[category].includes(normalized)) return;
  State.data.skills[category].push(normalized);
  renderSkillCategory(category);
  State.isDirty = true;
  updatePreviewDebounced();
}

function removeSkill(category, skill) {
  State.data.skills[category] = State.data.skills[category].filter(s => s !== skill);
  renderSkillCategory(category);
  State.isDirty = true;
  updatePreviewDebounced();
}

// ─── Preview Renderer ─────────────────────────────────────────────────────────
let previewDebounceTimer = null;

function updatePreviewDebounced() {
  clearTimeout(previewDebounceTimer);
  previewDebounceTimer = setTimeout(updatePreview, 250);
}

function updatePreview() {
  readForm();
  const el = document.getElementById('resume-preview');
  if (!el) return;

  // Set template class
  el.className = 'tpl-' + State.currentTemplate;

  const d  = State.data;
  const p  = d.personalInfo;
  const tpl = State.currentTemplate;

  el.innerHTML = buildResumeHTML(d, p, tpl);
}

function buildResumeHTML(d, p, tpl) {
  const contact = buildContact(p, tpl);
  const summary = p.summary
    ? `<div class="rv-section">
        <div class="rv-section-title">Professional Summary</div>
        <div class="rv-summary">${nl2br(esc(p.summary))}</div>
       </div>` : '';

  if (tpl === 'modern') return buildModern(d, p, contact, summary);
  if (tpl === 'classic') return buildClassic(d, p, contact, summary);
  if (tpl === 'minimal') return buildMinimal(d, p, contact, summary);
  if (tpl === 'executive') return buildExecutive(d, p, contact, summary);
  return buildModern(d, p, contact, summary);
}

function buildContact(p, tpl) {
  const items = [];
  if (p.email)     items.push(`<span><i class="fas fa-envelope"></i> ${esc(p.email)}</span>`);
  if (p.phone)     items.push(`<span><i class="fas fa-phone"></i> ${esc(p.phone)}</span>`);
  if (p.location)  items.push(`<span><i class="fas fa-map-marker-alt"></i> ${esc(p.location)}</span>`);
  if (p.linkedin)  items.push(`<span><i class="fab fa-linkedin"></i> ${esc(p.linkedin)}</span>`);
  if (p.github)    items.push(`<span><i class="fab fa-github"></i> ${esc(p.github)}</span>`);
  return items.join('');
}

// ── Modern Template HTML ──────────────────────────────────────────────────────
function buildModern(d, p, contact, summary) {
  const skills = d.skills;
  const allSkills = [
    ...(skills.technical || []).map(s => `<span class="rv-skill-tag">${esc(s)}</span>`),
    ...(skills.tools     || []).map(s => `<span class="rv-skill-tag">${esc(s)}</span>`),
  ].join('');
  const softSkills = (skills.soft || []).map(s =>
    `<span class="rv-skill-tag">${esc(s)}</span>`).join('');
  const languages  = (skills.languages || []).map(s =>
    `<span class="rv-skill-tag">${esc(s)}</span>`).join('');

  return `
    <div class="rv-header">
      <div class="rv-name">${esc(p.fullName) || 'Your Name'}</div>
      <div class="rv-title">${esc(p.jobTitle) || ''}</div>
      <div class="rv-contact">${contact}</div>
    </div>
    <div class="rv-body">
      <div class="rv-main">
        ${summary}
        ${d.experience.length ? `
        <div class="rv-section">
          <div class="rv-section-title">Experience</div>
          ${d.experience.map(e => `
            <div class="rv-item">
              <div class="rv-item-header">
                <div>
                  <div class="rv-item-title">${esc(e.position)}</div>
                  <div class="rv-item-sub">${esc(e.company)}${e.location ? ' · ' + esc(e.location) : ''}</div>
                </div>
                <div class="rv-item-date">${formatDate(e.startDate)} – ${e.current ? 'Present' : formatDate(e.endDate)}</div>
              </div>
              <div class="rv-item-desc">${nl2br(esc(e.description))}</div>
            </div>
          `).join('')}
        </div>` : ''}
        ${d.projects.length ? `
        <div class="rv-section">
          <div class="rv-section-title">Projects</div>
          ${d.projects.map(proj => `
            <div class="rv-item">
              <div class="rv-item-header">
                <div>
                  <div class="rv-item-title">${esc(proj.name)}</div>
                  <div class="rv-item-sub">${esc(proj.techStack)}</div>
                </div>
                ${proj.liveUrl || proj.githubUrl ? `
                <div class="rv-item-date">
                  ${proj.liveUrl ? `<a href="${esc(proj.liveUrl)}" style="color:#6c63ff;font-size:0.72rem">Live</a>` : ''}
                  ${proj.githubUrl ? `<a href="${esc(proj.githubUrl)}" style="color:#6c63ff;font-size:0.72rem;margin-left:6px">GitHub</a>` : ''}
                </div>` : ''}
              </div>
              <div class="rv-item-desc">${nl2br(esc(proj.description))}</div>
            </div>
          `).join('')}
        </div>` : ''}
      </div>
      <div class="rv-sidebar">
        ${d.education.length ? `
        <div class="rv-section">
          <div class="rv-section-title">Education</div>
          ${d.education.map(edu => `
            <div class="rv-item">
              <div class="rv-item-title">${esc(edu.degree)} ${edu.field ? 'in ' + esc(edu.field) : ''}</div>
              <div class="rv-item-sub">${esc(edu.institution)}</div>
              <div class="rv-item-date">${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}</div>
              ${edu.grade ? `<div class="rv-item-date">Grade: ${esc(edu.grade)}</div>` : ''}
            </div>
          `).join('')}
        </div>` : ''}
        ${allSkills ? `
        <div class="rv-section">
          <div class="rv-section-title">Technical Skills</div>
          <div>${allSkills}</div>
        </div>` : ''}
        ${softSkills ? `
        <div class="rv-section">
          <div class="rv-section-title">Soft Skills</div>
          <div>${softSkills}</div>
        </div>` : ''}
        ${languages ? `
        <div class="rv-section">
          <div class="rv-section-title">Languages</div>
          <div>${languages}</div>
        </div>` : ''}
        ${d.certifications.length ? `
        <div class="rv-section">
          <div class="rv-section-title">Certifications</div>
          ${d.certifications.map(c => `
            <div class="rv-item">
              <div class="rv-item-title" style="font-size:0.8rem">${esc(c.name)}</div>
              <div class="rv-item-sub">${esc(c.issuer)}</div>
              <div class="rv-item-date">${formatDate(c.issueDate)}</div>
            </div>
          `).join('')}
        </div>` : ''}
      </div>
    </div>
  `;
}

// ── Classic Template HTML ─────────────────────────────────────────────────────
function buildClassic(d, p, contact, summary) {
  const allSkills = [
    ...(d.skills.technical || []),
    ...(d.skills.tools     || []),
  ].map(s => `<span class="rv-skill-tag">${esc(s)}</span>`).join(' ');

  return `
    <div class="rv-header">
      <div class="rv-name">${esc(p.fullName) || 'Your Name'}</div>
      <div class="rv-title">${esc(p.jobTitle) || ''}</div>
      <div class="rv-contact">${contact}</div>
    </div>
    <div class="rv-body">
      ${summary}
      ${d.experience.length ? `
      <div class="rv-section">
        <div class="rv-section-title">Professional Experience</div>
        ${d.experience.map(e => `
          <div class="rv-item">
            <div class="rv-item-header">
              <div>
                <div class="rv-item-title">${esc(e.position)}</div>
                <div class="rv-item-sub">${esc(e.company)}${e.location ? ', ' + esc(e.location) : ''}</div>
              </div>
              <div class="rv-item-date">${formatDate(e.startDate)} – ${e.current ? 'Present' : formatDate(e.endDate)}</div>
            </div>
            <div class="rv-item-desc">${nl2br(esc(e.description))}</div>
          </div>
        `).join('')}
      </div>` : ''}
      ${d.education.length ? `
      <div class="rv-section">
        <div class="rv-section-title">Education</div>
        ${d.education.map(edu => `
          <div class="rv-item">
            <div class="rv-item-header">
              <div>
                <div class="rv-item-title">${esc(edu.degree)} ${edu.field ? 'in ' + esc(edu.field) : ''}</div>
                <div class="rv-item-sub">${esc(edu.institution)}${edu.grade ? ' · ' + esc(edu.grade) : ''}</div>
              </div>
              <div class="rv-item-date">${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}
      ${allSkills ? `
      <div class="rv-section">
        <div class="rv-section-title">Skills</div>
        <div style="line-height:2">${allSkills}</div>
      </div>` : ''}
      ${d.projects.length ? `
      <div class="rv-section">
        <div class="rv-section-title">Projects</div>
        ${d.projects.map(proj => `
          <div class="rv-item">
            <div class="rv-item-header">
              <div>
                <div class="rv-item-title">${esc(proj.name)} <span style="font-weight:400;font-size:0.78rem;color:#777">${esc(proj.techStack)}</span></div>
              </div>
            </div>
            <div class="rv-item-desc">${nl2br(esc(proj.description))}</div>
          </div>
        `).join('')}
      </div>` : ''}
      ${d.certifications.length ? `
      <div class="rv-section">
        <div class="rv-section-title">Certifications</div>
        ${d.certifications.map(c => `
          <div class="rv-item">
            <div class="rv-item-header">
              <div class="rv-item-title">${esc(c.name)}</div>
              <div class="rv-item-date">${formatDate(c.issueDate)}</div>
            </div>
            <div class="rv-item-sub">${esc(c.issuer)}</div>
          </div>
        `).join('')}
      </div>` : ''}
    </div>
  `;
}

// ── Minimal Template HTML ─────────────────────────────────────────────────────
function buildMinimal(d, p, contact, summary) {
  const allSkills = [
    ...(d.skills.technical || []),
    ...(d.skills.tools     || []),
    ...(d.skills.soft      || []),
  ].map(s => `<span class="rv-skill-tag">${esc(s)}</span>`).join('');

  return `
    <div class="rv-header">
      <div class="rv-name">${esc(p.fullName) || 'Your Name'}</div>
      <div class="rv-title">${esc(p.jobTitle) || ''}</div>
      <div class="rv-contact">${
        [p.email, p.phone, p.location, p.linkedin].filter(Boolean)
          .map(v => `<span>${esc(v)}</span>`).join('<span style="margin:0 6px;color:#ccc">|</span>')
      }</div>
    </div>
    <div class="rv-body">
      ${p.summary ? `
      <div class="rv-section">
        <div class="rv-section-title">Profile</div>
        <div class="rv-item" style="grid-template-columns:1fr">
          <div class="rv-summary">${nl2br(esc(p.summary))}</div>
        </div>
      </div>` : ''}
      ${d.experience.length ? `
      <div class="rv-section">
        <div class="rv-section-title">Experience</div>
        ${d.experience.map(e => `
          <div class="rv-item">
            <div class="rv-item-date">${formatDate(e.startDate)}<br>${e.current ? 'Present' : formatDate(e.endDate)}</div>
            <div>
              <div class="rv-item-title">${esc(e.position)}</div>
              <div class="rv-item-sub">${esc(e.company)}${e.location ? ' · ' + esc(e.location) : ''}</div>
              <div class="rv-item-desc">${nl2br(esc(e.description))}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}
      ${d.education.length ? `
      <div class="rv-section">
        <div class="rv-section-title">Education</div>
        ${d.education.map(edu => `
          <div class="rv-item">
            <div class="rv-item-date">${formatDate(edu.endDate) || '—'}</div>
            <div>
              <div class="rv-item-title">${esc(edu.degree)} ${edu.field ? '— ' + esc(edu.field) : ''}</div>
              <div class="rv-item-sub">${esc(edu.institution)}${edu.grade ? ' · ' + esc(edu.grade) : ''}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}
      ${allSkills ? `
      <div class="rv-section">
        <div class="rv-section-title">Skills</div>
        <div class="rv-item" style="grid-template-columns:1fr"><div>${allSkills}</div></div>
      </div>` : ''}
      ${d.projects.length ? `
      <div class="rv-section">
        <div class="rv-section-title">Projects</div>
        ${d.projects.map(proj => `
          <div class="rv-item">
            <div class="rv-item-date">${formatDate(proj.startDate) || ''}</div>
            <div>
              <div class="rv-item-title">${esc(proj.name)}</div>
              <div class="rv-item-sub">${esc(proj.techStack)}</div>
              <div class="rv-item-desc">${nl2br(esc(proj.description))}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}
    </div>
  `;
}

// ── Executive Template HTML ───────────────────────────────────────────────────
function buildExecutive(d, p, contact, summary) {
  const allSkills = [
    ...(d.skills.technical || []),
    ...(d.skills.tools     || []),
  ].map(s => `<span class="rv-skill-tag">${esc(s)}</span>`).join('');

  return `
    <div class="rv-header">
      <div>
        <div class="rv-name">${esc(p.fullName) || 'Your Name'}</div>
        <div class="rv-title">${esc(p.jobTitle) || ''}</div>
      </div>
      <div class="rv-contact">
        ${[p.email, p.phone, p.location].filter(Boolean).map(v => `<span>${esc(v)}</span>`).join('')}
        ${p.linkedin ? `<span>${esc(p.linkedin)}</span>` : ''}
      </div>
    </div>
    <div class="rv-body">
      ${summary}
      ${d.experience.length ? `
      <div class="rv-section">
        <div class="rv-section-title">Professional Experience</div>
        ${d.experience.map(e => `
          <div class="rv-item">
            <div class="rv-item-header">
              <div>
                <div class="rv-item-title">${esc(e.position)}</div>
                <div class="rv-item-sub">${esc(e.company)}${e.location ? ' · ' + esc(e.location) : ''}</div>
              </div>
              <div class="rv-item-date">${formatDate(e.startDate)} – ${e.current ? 'Present' : formatDate(e.endDate)}</div>
            </div>
            <div class="rv-item-desc">${nl2br(esc(e.description))}</div>
          </div>
        `).join('')}
      </div>` : ''}
      ${d.education.length ? `
      <div class="rv-section">
        <div class="rv-section-title">Education</div>
        ${d.education.map(edu => `
          <div class="rv-item">
            <div class="rv-item-header">
              <div>
                <div class="rv-item-title">${esc(edu.degree)} ${edu.field ? 'in ' + esc(edu.field) : ''}</div>
                <div class="rv-item-sub">${esc(edu.institution)}${edu.grade ? ' · ' + esc(edu.grade) : ''}</div>
              </div>
              <div class="rv-item-date">${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}
      ${allSkills ? `
      <div class="rv-section">
        <div class="rv-section-title">Core Competencies</div>
        <div>${allSkills}</div>
      </div>` : ''}
      ${d.projects.length ? `
      <div class="rv-section">
        <div class="rv-section-title">Key Projects</div>
        ${d.projects.map(proj => `
          <div class="rv-item">
            <div class="rv-item-header">
              <div class="rv-item-title">${esc(proj.name)} <span style="font-size:0.78rem;font-weight:400;color:#555">${esc(proj.techStack)}</span></div>
            </div>
            <div class="rv-item-desc">${nl2br(esc(proj.description))}</div>
          </div>
        `).join('')}
      </div>` : ''}
      ${d.certifications.length ? `
      <div class="rv-section">
        <div class="rv-section-title">Certifications</div>
        ${d.certifications.map(c => `
          <div class="rv-item" style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div class="rv-item-title">${esc(c.name)}</div>
              <div class="rv-item-sub">${esc(c.issuer)}</div>
            </div>
            <div class="rv-item-date">${formatDate(c.issueDate)}</div>
          </div>
        `).join('')}
      </div>` : ''}
    </div>
  `;
}

// ─── CRUD API Calls ───────────────────────────────────────────────────────────
async function loadResumeList() {
  const grid = document.getElementById('resume-grid');
  if (!grid) return;

  try {
    const res  = await fetch('/api/resumes');
    const json = await res.json();

    if (!json.success || !json.resumes.length) {
      grid.innerHTML = `
        <div class="empty-state" id="resume-empty">
          <i class="fas fa-file-circle-plus"></i>
          <p>No resumes yet. Create your first one!</p>
          <button class="btn btn-primary" onclick="newResume()">
            <i class="fas fa-plus"></i> Create Resume
          </button>
        </div>`;
      return;
    }

    grid.innerHTML = json.resumes.map(r => {
      const updated  = new Date(r.updatedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
      const complete = r.completeness || 0;
      const scoreBadge = r.atsScore
        ? `<span class="badge badge-success"><i class="fas fa-chart-bar"></i> ATS ${r.atsScore}</span>`
        : '';
      return `
        <div class="resume-card" onclick="openResume('${r._id}')">
          <div class="resume-card-title">${esc(r.title)}</div>
          <div class="resume-card-meta">
            <span><i class="fas fa-palette" style="margin-right:4px"></i>${capitalize(r.template || 'modern')}</span>
            ${r.targetJobRole ? `<span><i class="fas fa-bullseye" style="margin-right:4px"></i>${esc(r.targetJobRole)}</span>` : ''}
            <span><i class="fas fa-clock" style="margin-right:4px"></i>Updated ${updated}</span>
          </div>
          <div class="completeness-bar">
            <div class="completeness-fill" style="width:${complete}%"></div>
          </div>
          <div style="font-size:0.72rem;color:var(--zx-muted);margin-bottom:10px">${complete}% complete ${scoreBadge}</div>
          <div class="resume-card-actions" onclick="event.stopPropagation()">
            <button class="btn btn-primary btn-sm" onclick="openResume('${r._id}')">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-ghost btn-sm" onclick="downloadPDFById('${r._id}')">
              <i class="fas fa-download"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="openDeleteModal('${r._id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error(err);
    showToast('Failed to load resumes', 'error');
  }
}

async function openResume(id) {
  try {
    const res  = await fetch(`/api/resumes/${id}`);
    const json = await res.json();
    if (!json.success) { showToast('Failed to load resume', 'error'); return; }

    State.currentResumeId = id;
    State.isDirty         = false;
    populateForm(json.resume);
    showView('builder');
  } catch (err) {
    console.error(err);
    showToast('Error loading resume', 'error');
  }
}

function newResume() {
  State.currentResumeId = null;
  State.isDirty         = false;
  State.currentTemplate = 'modern';
  State.data = {
    title: '', targetJobRole: '', template: 'modern',
    personalInfo: { fullName:'', email:'', phone:'', location:'',
      linkedin:'', github:'', portfolio:'', jobTitle:'', summary:'' },
    education:[], experience:[], projects:[], certifications:[],
    skills:{ technical:[], soft:[], languages:[], tools:[] }
  };
  populateForm(State.data);
  showView('builder');
  switchTab('personal');
  document.getElementById('pi-fullName')?.focus();
}

async function saveResume(silent = false) {
  if (State.isSaving) return;
  readForm();
  State.isSaving = true;

  const btn = document.getElementById('btn-save-resume');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Saving...'; }

  try {
    const isNew = !State.currentResumeId;
    const url   = isNew ? '/api/resumes' : `/api/resumes/${State.currentResumeId}`;
    const method = isNew ? 'POST' : 'PUT';

    const res  = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(State.data),
    });
    const json = await res.json();

    if (json.success) {
      State.currentResumeId = json.resume._id;
      State.isDirty         = false;
      if (!silent) showToast('Resume saved successfully!', 'success');
    } else {
      showToast(json.message || 'Save failed', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error. Please try again.', 'error');
  } finally {
    State.isSaving = false;
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Save'; }
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────
function openDeleteModal(id) {
  State.deleteTargetId = id;
  document.getElementById('delete-modal').classList.add('open');
}
function closeDeleteModal() {
  State.deleteTargetId = null;
  document.getElementById('delete-modal').classList.remove('open');
}
async function confirmDelete() {
  if (!State.deleteTargetId) return;
  try {
    const res  = await fetch(`/api/resumes/${State.deleteTargetId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Resume deleted.', 'success');
      if (State.currentResumeId === State.deleteTargetId) {
        State.currentResumeId = null;
        showView('list');
      }
    } else {
      showToast('Delete failed.', 'error');
    }
  } catch (err) {
    showToast('Error deleting resume.', 'error');
  } finally {
    closeDeleteModal();
    loadResumeList();
  }
}

// ─── PDF Download ─────────────────────────────────────────────────────────────
async function downloadPDF() {
  const el   = document.getElementById('resume-preview');
  const name = State.data.personalInfo?.fullName || 'Resume';
  const btn  = document.getElementById('btn-download-pdf');

  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Generating...'; }

  const opt = {
    margin:       [8, 8, 8, 8],
    filename:     `${name.replace(/\s+/g,'-')}-Resume.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(el).save();
    showToast('PDF downloaded!', 'success');
  } catch (err) {
    console.error(err);
    showToast('PDF generation failed.', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-download"></i> Download PDF'; }
  }
}

async function downloadPDFById(id) {
  await openResume(id);
  setTimeout(downloadPDF, 400);
}

// ─── AI Features ──────────────────────────────────────────────────────────────
async function aiGenerateSummary() {
  readForm();
  const p   = State.data.personalInfo;
  const btn = event.currentTarget;
  setAiLoading(btn, true);

  try {
    const res  = await fetch('/api/resumes/ai/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle:       p.jobTitle,
        targetJobRole:  State.data.targetJobRole,
        skills:         State.data.skills.technical,
        experience:     State.data.experience.length + ' roles'
      })
    });
    const json = await res.json();
    if (json.success) {
      document.getElementById('pi-summary').value = json.summary;
      State.data.personalInfo.summary = json.summary;
      updatePreview();
      showToast('Summary generated!', 'success');
    } else {
      showToast(json.message || 'AI error', 'error');
    }
  } catch (err) {
    showToast('AI request failed', 'error');
  } finally {
    setAiLoading(btn, false);
  }
}

async function aiImproveField(fieldId, type) {
  const el  = document.getElementById(fieldId);
  if (!el || !el.value.trim()) { showToast('Please add some content first', 'info'); return; }
  const btn = event.currentTarget;
  setAiLoading(btn, true);

  try {
    const res  = await fetch('/api/resumes/ai/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: el.value,
        type,
        jobRole: State.data.targetJobRole || State.data.personalInfo.jobTitle
      })
    });
    const json = await res.json();
    if (json.success) {
      el.value = json.improved;
      if (fieldId === 'pi-summary') State.data.personalInfo.summary = json.improved;
      updatePreview();
      showToast('Content improved!', 'success');
    } else {
      showToast(json.message || 'AI error', 'error');
    }
  } catch (err) {
    showToast('AI request failed', 'error');
  } finally {
    setAiLoading(btn, false);
  }
}

async function aiImproveExp(id) {
  const exp = State.data.experience.find(e => e._id === id);
  if (!exp || !exp.description.trim()) { showToast('Add a description first', 'info'); return; }
  const btn = event.currentTarget;
  setAiLoading(btn, true);

  try {
    const res  = await fetch('/api/resumes/ai/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: exp.description,
        type: 'work experience',
        jobRole: State.data.targetJobRole || exp.position
      })
    });
    const json = await res.json();
    if (json.success) {
      exp.description = json.improved;
      renderExperienceList();
      updatePreview();
      showToast('Experience improved!', 'success');
    } else {
      showToast(json.message || 'AI error', 'error');
    }
  } catch (err) {
    showToast('AI request failed', 'error');
  } finally {
    setAiLoading(btn, false);
  }
}

async function aiSuggestSkills() {
  const role = State.data.targetJobRole || State.data.personalInfo.jobTitle;
  if (!role) { showToast('Set a Target Job Role first', 'info'); return; }
  const btn = event.currentTarget;
  setAiLoading(btn, true);

  try {
    const res  = await fetch('/api/resumes/ai/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobRole: role,
        existingSkills: [
          ...State.data.skills.technical,
          ...State.data.skills.tools
        ]
      })
    });
    const json = await res.json();
    if (json.success && json.suggestions) {
      const s = json.suggestions;
      (s.technical || []).forEach(sk => addSkill('technical', sk));
      (s.tools     || []).forEach(sk => addSkill('tools', sk));
      (s.soft      || []).forEach(sk => addSkill('soft', sk));
      showToast('Skills suggested and added!', 'success');
    } else {
      showToast(json.message || 'AI error', 'error');
    }
  } catch (err) {
    showToast('AI request failed', 'error');
  } finally {
    setAiLoading(btn, false);
  }
}

async function aiGenerateProjectDesc(id) {
  const proj = State.data.projects.find(p => p._id === id);
  if (!proj || !proj.name) { showToast('Add a project name first', 'info'); return; }
  const btn = event.currentTarget;
  setAiLoading(btn, true);

  try {
    const res  = await fetch('/api/resumes/ai/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectName: proj.name,
        techStack:   proj.techStack,
        jobRole:     State.data.targetJobRole || State.data.personalInfo.jobTitle
      })
    });
    const json = await res.json();
    if (json.success) {
      proj.description = json.description;
      renderProjectsList();
      updatePreview();
      showToast('Project description generated!', 'success');
    } else {
      showToast(json.message || 'AI error', 'error');
    }
  } catch (err) {
    showToast('AI request failed', 'error');
  } finally {
    setAiLoading(btn, false);
  }
}

async function analyzeATS() {
  if (!State.currentResumeId) {
    showToast('Save your resume first to run ATS analysis', 'info');
    return;
  }
  const btn = document.getElementById('btn-analyze-ats');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Analyzing...'; }

  try {
    const res  = await fetch('/api/resumes/ai/ats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeId:      State.currentResumeId,
        targetJobRole: State.data.targetJobRole
      })
    });
    const json = await res.json();
    if (json.success) {
      renderATSPanel(json.analysis);
      switchTab('template');
      showToast(`ATS Score: ${json.analysis.score}/100`, 'success');
    } else {
      showToast(json.message || 'ATS analysis failed', 'error');
    }
  } catch (err) {
    showToast('ATS analysis failed', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-chart-bar"></i> ATS Score'; }
  }
}

function renderATSPanel(analysis) {
  const panel    = document.getElementById('ats-panel');
  const circle   = document.getElementById('ats-circle');
  const scoreVal = document.getElementById('ats-score-val');
  const label    = document.getElementById('ats-score-label');
  const list     = document.getElementById('ats-suggestions-list');

  if (!panel) return;

  panel.style.display = 'block';
  circle.style.setProperty('--pct', analysis.score);
  scoreVal.textContent = analysis.score;

  const scoreText = analysis.score >= 80 ? 'Excellent' :
                    analysis.score >= 60 ? 'Good' :
                    analysis.score >= 40 ? 'Needs Work' : 'Poor';
  label.textContent = scoreText + ' ATS compatibility';

  list.innerHTML = (analysis.suggestions || []).map(s =>
    `<li>${esc(s)}</li>`
  ).join('');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function setAiLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn._orig    = btn.innerHTML;
    btn.innerHTML = '<span class="spinner" style="border-color:rgba(108,99,255,0.3);border-top-color:var(--zx-primary)"></span> Working...';
  } else {
    btn.disabled  = false;
    btn.innerHTML = btn._orig || btn.innerHTML;
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'check-circle' :
               type === 'error'   ? 'times-circle'  : 'info-circle';
  toast.innerHTML = `<i class="fas fa-${icon}"></i> ${esc(message)}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!year) return '';
  if (!month) return year;
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(month, 10) - 1] || ''} ${year}`;
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function nl2br(str) {
  if (!str) return '';
  return str.replace(/\n/g, '<br>');
}

function uid() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}s