/**
 * お題ガチャ
 */

const characterInput = document.getElementById('characterInput');
const topicInput = document.getElementById('topicInput');
const generateBtn = document.getElementById('generateBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const resultSection = document.getElementById('resultSection');
const resultList = document.getElementById('resultList');
const resultCount = document.getElementById('resultCount');
const leftoverSection = document.getElementById('leftoverSection');
const leftoverLabel = document.getElementById('leftoverLabel');
const leftoverItems = document.getElementById('leftoverItems');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const DEFAULT_CHARACTERS = '上田, 高橋, 山田, 佐藤, 鈴木, 田中, 中村, 小林';
const DEFAULT_TOPICS = '約束, 手紙, 消えた言葉, 二人だけの秘密, 腐れ縁, 夢の中, 想い出の香り, 植え付け';
const STORAGE_KEY = 'odai-gacha';

// --- テーマ ---
let isDark = true;

function initTheme() {
  const saved = localStorage.getItem(`${STORAGE_KEY}-theme`);
  if (saved) {
    isDark = saved === 'dark';
  } else {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyTheme();
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
}

function toggleTheme() {
  isDark = !isDark;
  localStorage.setItem(`${STORAGE_KEY}-theme`, isDark ? 'dark' : 'light');
  applyTheme();
}

// --- 入力の永続化 ---
function loadInputs() {
  const saved = localStorage.getItem(`${STORAGE_KEY}-inputs`);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      characterInput.value = data.characters || DEFAULT_CHARACTERS;
      topicInput.value = data.topics || DEFAULT_TOPICS;
    } catch {
      characterInput.value = DEFAULT_CHARACTERS;
      topicInput.value = DEFAULT_TOPICS;
    }
  } else {
    characterInput.value = DEFAULT_CHARACTERS;
    topicInput.value = DEFAULT_TOPICS;
  }
}

function saveInputs() {
  localStorage.setItem(`${STORAGE_KEY}-inputs`, JSON.stringify({
    characters: characterInput.value,
    topics: topicInput.value
  }));
}

// --- パーサー ---
function parseInput(text) {
  return text
    .split(/[,\n\u3001]/)
    .map(item => item.trim())
    .filter(item => item !== '');
}

// --- Fisher-Yates シャッフル（非破壊） ---
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- 生成 ---
function generate() {
  const characters = parseInput(characterInput.value);
  const topics = parseInput(topicInput.value);

  if (characters.length === 0 || topics.length === 0) return;

  saveInputs();

  const shuffledChars = shuffle(characters);
  const shuffledTopics = shuffle(topics);
  const pairCount = Math.min(shuffledChars.length, shuffledTopics.length);

  resultList.innerHTML = '';
  for (let i = 0; i < pairCount; i++) {
    const li = document.createElement('li');
    li.className = 'result-item';
    li.innerHTML = `
      <span class="result-number">${i + 1}</span>
      <div class="result-body">
        <div class="result-character">${escapeHtml(shuffledChars[i])}</div>
        <div class="result-topic">${escapeHtml(shuffledTopics[i])}</div>
      </div>
    `;
    resultList.appendChild(li);
  }

  resultCount.textContent = `${pairCount} pairs`;
  resultSection.hidden = false;
  shuffleBtn.disabled = false;

  // あぶれ
  const leftoverChars = shuffledChars.slice(pairCount);
  const leftoverTopicsList = shuffledTopics.slice(pairCount);

  if (leftoverChars.length > 0 || leftoverTopicsList.length > 0) {
    leftoverSection.hidden = false;
    const parts = [];
    if (leftoverChars.length > 0) {
      parts.push(`キャラ: ${leftoverChars.join(', ')}`);
    }
    if (leftoverTopicsList.length > 0) {
      parts.push(`お題: ${leftoverTopicsList.join(', ')}`);
    }
    leftoverLabel.textContent = 'Leftover';
    leftoverItems.textContent = parts.join(' / ');
  } else {
    leftoverSection.hidden = true;
  }

  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- イベント ---
generateBtn.addEventListener('click', generate);
shuffleBtn.addEventListener('click', generate);
themeToggle.addEventListener('click', toggleTheme);
characterInput.addEventListener('input', saveInputs);
topicInput.addEventListener('input', saveInputs);

// --- 初期化 ---
initTheme();
loadInputs();
