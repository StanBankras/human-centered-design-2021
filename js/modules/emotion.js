import { EmojiButton } from './emoji.js';

let emotionConfiguration = {
  blij: {
    color: 'black',
    emote: '😀',
    active: true
  },
  bedroefd: {
    color: 'black',
    emote: '😪',
    active: true
  },
  bang: {
    color: 'black',
    emote: '😨',
    active: true
  },
  boos: {
    color: 'black',
    emote: '🤬',
    active: true
  },
  geirriteerd: {
    color: 'black',
    emote: '😤',
    active: true
  },
  verbaasd: {
    color: 'black',
    emote: '😯',
    active: true
  },
  geschokt: {
    color: 'black',
    emote: '😲',
    active: true
  }
}

export function setSelectedEmotions() {
  const pEl = document.querySelector('#emotion .emotions p');
  pEl.innerText = Object.values(emotionConfiguration).reduce((acc, curr) => curr.active ? acc + curr.emote : acc, '');
}

export function setConfigurationOptions() {
  const configContainer = document.querySelector('#emotion .configure');

  Object.keys(emotionConfiguration).forEach(key => {
    const div = document.createElement('div');
    const button = document.createElement('button');
    const emotion = document.createElement('p');

    div.classList.add(key);
    div.classList.add('active');

    const picker = new EmojiButton();
    picker.on('emoji', selection => {
      emotionConfiguration[key].emote = selection.emoji;
      button.innerHTML = selection.emoji;
      setSelectedEmotions();
    });
    button.addEventListener('click', () => picker.togglePicker(button));
    button.innerText = emotionConfiguration[key].emote;

    emotion.innerText = key;
    emotion.addEventListener('click', e => {
      if(e.target.parentElement.classList.contains('active')) {
        e.target.parentElement.classList.remove('active');
        emotionConfiguration[key].active = false;
      } else {
        e.target.parentElement.classList.add('active');
        emotionConfiguration[key].active = true;
      }
      setSelectedEmotions();
    });

    div.appendChild(button);
    div.appendChild(emotion);
    configContainer.appendChild(div);
  });
}