import { EmojiButton } from './emoji.js'; 

const emotionConfigEl = document.querySelector('.emotion');
const container = document.querySelector('.example');
const emotionsContainer = document.querySelector('.example .emotions');
const addButton = document.querySelector('#add');

const emotions = [
  {
    emotion: 'Blij',
    color: 'black',
    enabled: false
  },
  {
    emotion: 'Bedroefd',
    color: 'black',
    enabled: false
  },
  {
    emotion: 'Bang',
    color: 'black',
    enabled: false
  },
  {
    emotion: 'Boos',
    color: 'black',
    enabled: false
  },
  {
    emotion: 'Geirriteerd',
    color: 'black',
    enabled: false
  },
  {
    emotion: 'Verbaasd',
    color: 'black',
    enabled: false
  },
  {
    emotion: 'Geschokt',
    color: 'black',
    enabled: false
  }
];

const exampleText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s';

emotions.forEach(emotion => {
  addTestButton(emotion.emotion);
  appendEmotion(emotion)
});

addButton.addEventListener('click', () => {
  const value = document.querySelector('#add-input').value;
  if(!value || value === '') return;
  addEmotion(value);
  addTestButton(value);
});

function toggleEmotion(emotion, e) {
  const item = emotions.find(e => e.emotion === emotion);
  item.enabled = !item.enabled;

  if(item.enabled) {
    e.target.innerText = 'Zet uit';
    e.target.parentElement.classList.add('active');
    addColorPicker(e.target.parentElement, emotion);
    addEmojiPicker(e.target.parentElement, emotion);
  } else {
    e.target.innerText = 'Zet aan';
    e.target.parentElement.classList.remove('active');
    removeColorPicker(e.target.parentElement);
    removeEmojiPicker(emotion);
  }
}

function addColorPicker(location, emotion) {
  const div = document.createElement('div');
  const text = document.createElement('p');
  const colorPicker = document.createElement('input');
  div.classList.add('color');
  text.innerText = 'Welke kleur hoort bij \'' + emotion.toLowerCase() + '\'?';
  colorPicker.type = 'color';
  colorPicker.addEventListener('change', e => {
    if(emotions.find(e => e.emotion === emotion).enabled) {
      const emotionObj = emotions.find(e => e.emotion === emotion);
      emotionObj.color = e.target.value;
      const text = Array.from(location.children).find(c => c.localName === 'p');
      text.style.color = e.target.value;
    }
  });

  div.appendChild(text);
  div.appendChild(colorPicker);

  location.appendChild(div);
}

function removeColorPicker(location) {
  const input = Array.from(location.children).find(c => c.classList.contains('color'));
  const text = Array.from(location.children).find(c => c.localName === 'p');
  text.style.color = 'black'; 
  input.remove();
}

function addEmojiPicker(location, emotion) {
  const div = document.createElement('div');
  const text = document.createElement('p');
  const button = document.createElement('button');
  const buttonClass = `emoji-picker-${emotion.toLowerCase()}`;
  div.classList.add('emoji-input');
  text.innerText = 'Welke emoticon hoort bij \'' + emotion.toLowerCase() + '\'?';
  button.innerText = 'Select Emoji';
  button.classList.add(buttonClass);
  button.classList.add('emoji-select');

  div.appendChild(text);
  div.appendChild(button);

  location.appendChild(div);

  const picker = new EmojiButton();
  
  picker.on('emoji', selection => {
    const emotionObj = emotions.find(e => e.emotion === emotion);
    emotionObj.emote = selection.emoji;
    button.innerHTML = selection.emoji;
    button.classList.add('selected');
  });
  
  button.addEventListener('click', () => picker.togglePicker(button));
}

function removeEmojiPicker(emotion) {
  const button = document.querySelector(`.${emotion.toLowerCase()} div.emoji-input`);
  button.remove();
}

function addEmotion(emotion) {
  const obj = {
    emotion,
    color: 'black',
    enabled: false
  };
  emotions.push(obj);

  appendEmotion(obj, true);
}

function appendEmotion(emotion, enabled) {
  const el = document.createElement('div');
  const wrapper = document.createElement('div');
  const text = document.createElement('p');
  const toggle = document.createElement('button');
  el.classList.add('emotion');
  el.classList.add(emotion.emotion.toLowerCase());
  text.innerText = emotion.emotion;
  toggle.addEventListener('click', e => toggleEmotion(emotion.emotion, e));
  toggle.innerText = 'Zet aan';
  wrapper.appendChild(text);
  wrapper.appendChild(toggle);
  el.appendChild(wrapper);
  emotionsContainer.appendChild(el);
}

function addTestButton(emotion) {
  const emotionObj = emotions.find(e => e.emotion === emotion);
  const container = document.querySelector('#test-buttons');
  const textSpace = document.querySelector('#example');
  const button = document.createElement('button');
  button.innerText = emotion;
  button.addEventListener('click', () => {
    textSpace.innerText = exampleText + ' ' + (emotionObj.emote ? emotionObj.emote : '');
    textSpace.style.color = emotionObj.color;
  });
  container.appendChild(button);
}