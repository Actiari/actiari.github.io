const store = idbKeyval.createStore('brainDump-db', 'sessions');
let countdownTimer = null;
let autosaveTimer = null;
let startTime = 0;
let durationSec = 0; // planned session length
let actualDuration = 0; // actual duration once session ends
let draft = null;
let tags = [];

function formatDuration(sec){
  const m = Math.floor(sec/60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2,'0')}`;
}

function initUI() {
  document.getElementById('startBtn').addEventListener('click', startSession);
  document.getElementById('resetBtn').addEventListener('click', resetSession);
  document.getElementById('completeBtn').addEventListener('click', saveFinalSession);
  document.getElementById('downloadBtn').addEventListener('click', downloadCurrent);
  const dumpBox = document.getElementById('dumpBox');
  dumpBox.addEventListener('input', () => {
    dumpBox.style.height = 'auto';
    dumpBox.style.height = dumpBox.scrollHeight + 'px';
  });
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') {
      endSession();
    } else if (e.key.toLowerCase() === 'm') {
      markSelectionMissed();
    }
  });
}

document.addEventListener('DOMContentLoaded', initUI);

function startSession() {
  const topic = document.getElementById('topicInput').value.trim() || 'Untitled';
  durationSec = parseInt(document.getElementById('durationSelect').value, 10) * 60;
  startTime = Date.now();
  actualDuration = 0;
  draft = {
    id: uuidv9(),
    topic,
    dateISO: new Date().toISOString(),
    durationSec,
    content: '',
    notes: '',
    tags: []
  };
  tags = draft.tags;
  document.getElementById('dumpBox').value = '';
  document.getElementById('dumpBox').readOnly = false;
  document.getElementById('dumpBox').focus();
  document.getElementById('notesPane').style.display = 'none';
  document.getElementById('startBtn').hidden = true;
  document.getElementById('resetBtn').hidden = false;
  document.getElementById('downloadBtn').hidden = true;

  tickTimer();
  countdownTimer = setInterval(tickTimer, 250);
  autosaveTimer = setInterval(autosaveTick, 3000);
}

function resetSession() {
  clearInterval(countdownTimer);
  clearInterval(autosaveTimer);
  countdownTimer = null;
  autosaveTimer = null;
  startTime = 0;
  durationSec = 0;
  draft = null;
  document.getElementById('timer').textContent = '00:00';
  document.getElementById('dumpBox').value = '';
  document.getElementById('dumpBox').readOnly = false;
  document.getElementById('notesPane').style.display = 'none';
  document.getElementById('startBtn').hidden = false;
  document.getElementById('resetBtn').hidden = true;
  document.getElementById('downloadBtn').hidden = true;
  idbKeyval.del('draft', store);
}

function tickTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const remain = Math.max(durationSec - elapsed, 0);
  document.getElementById('timer').textContent = formatDuration(remain);
  if (remain === 0) {
    endSession();
  }
}

function autosaveTick() {
  if (!draft) return;
  draft.content = document.getElementById('dumpBox').value;
  idbKeyval.set('draft', draft, store);
}

function endSession() {
  if (!draft) return;
  clearInterval(countdownTimer);
  clearInterval(autosaveTimer);
  countdownTimer = null;
  autosaveTimer = null;
  actualDuration = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('dumpBox').readOnly = true;
  getNotes(draft.topic).then(n => {
    draft.notes = n;
    document.getElementById('notesPane').innerText = n;
    document.getElementById('notesPane').style.display = 'block';
    document.getElementById('downloadBtn').hidden = false;
  });
}

function getNotes(topic) {
  return Promise.resolve(`Example notes for ${topic}`);
}

function markSelectionMissed() {
  const sel = window.getSelection();
  const text = sel ? sel.toString().trim() : '';
  if (!text) return;
  tags.push(text);
  draft.tags = tags;
  if (sel.rangeCount) {
    const range = sel.getRangeAt(0);
    const mark = document.createElement('mark');
    range.surroundContents(mark);
    sel.removeAllRanges();
  }
}

function saveFinalSession() {
  if (!draft) return;
  autosaveTick();
  draft.actualDurationSec = actualDuration;
  idbKeyval.set(draft.id, draft, store).then(() => {
    idbKeyval.del('draft', store);
  });
}

async function renderHistory() {
  const listEl = document.getElementById('historyList');
  if (!listEl) return;
  listEl.innerHTML = '';
  const keys = await idbKeyval.keys(store);
  for (const key of keys) {
    if (key === 'draft') continue;
    const session = await idbKeyval.get(key, store);
    const li = document.createElement('li');
    const missed = session.tags.length;
    const total = session.notes.split(/\s+/).length;
    const dur = formatDuration(session.actualDurationSec || session.durationSec);
    li.textContent = `${session.dateISO.split('T')[0]} | ${session.topic} | ${dur} | ${missed}/${total}`;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      idbKeyval.del(key, store).then(renderHistory);
    });
    const expBtn = document.createElement('button');
    expBtn.textContent = 'Export';
    expBtn.addEventListener('click', () => exportMarkdown(key));
    li.append(' ', delBtn, ' ', expBtn);
    listEl.appendChild(li);
  }
}

async function exportMarkdown(id) {
  const session = await idbKeyval.get(id, store);
  if (!session) return;
  const md = `# ${session.topic}\n\n${session.content}\n\n---\n${session.notes}`;
  const blob = new Blob([md], {type:'text/markdown'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${session.topic}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCurrent(){
  if(!draft) return;
  autosaveTick();
  const md = `# ${draft.topic}\n\n${draft.content}\n\n---\n${draft.notes}`;
  const blob = new Blob([md], {type:'text/markdown'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${draft.topic}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
