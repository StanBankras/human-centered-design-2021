import { drawAudio } from './drawaudio.js';
import { emotionConfiguration } from './emotion.js';

const audio = document.querySelector('audio');
const text = document.querySelector('#text');
const canvas = document.querySelector('canvas');
const container = document.querySelector('.canvas');
const textContainer = document.querySelector('#text');
const content = document.querySelector('#content');
const reader = document.querySelector('.canvas div');
const startAudio = document.querySelector('button.start');

const speakerColors = ['#2be4a0', '#2ba0e4', '#e4892b', '#b62be4', '#e42b2b'];
let script = [];

let speakerSet;
let speakers;

fetch('assets/script.json')
  .then(res => res.json())
  .then(data => {
    script = data;
    speakerSet = script.reduce((acc, curr) => acc.add(curr.speaker), new Set([]));
    speakers = Array.from(speakerSet).map((speaker, i) => {
      return {
        speaker,
        bgColor: speakerColors[i]
      }
    });
    drawAudio('assets/audio.mp3', 1000, 8000);
    drawText();
  });

let dragging = false;
let customWidth;
let currentSecond;

audio.addEventListener('play', e => {
  playScript(e.target.currentTime);
});

audio.addEventListener('timeupdate', e => {
  playScript(e.target.currentTime);
});

reader.addEventListener('mousedown', e => {
  dragging = true;
});

window.addEventListener('mousemove', e => {
  if(dragging) {
    const box = container.getBoundingClientRect();
    reader.style.left = `${e.clientX - box.left}px`;
    customWidth = e.clientX - box.left;
    playScript();
  }
});

startAudio.addEventListener('click', () => {
  audio.play();
})

window.addEventListener('mouseup', e => {
  dragging = false;
});

function playScript(second) {
  if(!second) {
    if(currentSecond) second = currentSecond;
  } else {
    currentSecond = second;
  }

  const totalDuration = audio.duration;
  const text = script.find(s => s.start <= second && s.end >= second);
  if(!text) return;
  const textProgress = (second - text.start) / (text.end - text.start) * 100;
  const canvasWidth = canvas.width;
  let containerWidth = container.getBoundingClientRect().width;
  containerWidth = customWidth ? customWidth : containerWidth - containerWidth / 2;

  drawTextProgress(textProgress, text.id);
  canvas.style.transform = `translateX(${containerWidth - second / totalDuration * canvasWidth}px)`;
}

function appendWords(container, sentence, emotion) {
  const words = sentence.split(' ');
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.innerText = word + ' ';
    if(emotion) {
      span.classList.add(emotion);
      if(i === words.length - 1) {
        const i = document.createElement('span');
        i.textContent = emotionConfiguration[emotion].emote;
        i.classList.add(emotion + '-emoji');
        i.classList.add('emoji');
        span.appendChild(i);
      }
    }
    container.append(span);
  });
}

function drawText() {
  script.forEach((paragraph, i) => {
    const container = document.createElement('div');
    container.classList.add('text-wrapper');
    container.classList.add(`section-${paragraph.id}`);

    const personTag = document.createElement('div')
    personTag.classList.add('person-tag');
    if(script.slice(0, i).find(p => p.speaker === paragraph.speaker)) {
      personTag.innerText = paragraph.speaker.split(" ").map((n)=>n[0] + n[1]).join(". ");;
    } else {
      personTag.innerText = paragraph.speaker;
    }
    personTag.style.backgroundColor = speakers.find(s => s.speaker === paragraph.speaker).bgColor;

    const text = document.createElement('div');
    const textWrapper = document.createElement('div');
    text.classList.add('text');
    text.appendChild(textWrapper);
    textWrapper.classList.add('wrapper');
    paragraph.text.forEach(t => appendWords(textWrapper, t.text, t.emotion));

    container.appendChild(personTag);
    container.appendChild(text);
    textContainer.appendChild(container);

    for(let i = 0; i < 40; i++) {
      const div = document.createElement('div');
      div.classList.add(`sentence-${i}-${paragraph.id}`);
      div.style.position = 'absolute';
      div.style.top = `${i * 33 + 15}px`;
      div.style.height = '33px';
      div.style.zIndex = -1;
      text.appendChild(div);
    } 
  });
}

function drawTextProgress(percentage, scriptIndex) {
  const textBox = document.querySelector(`.section-${scriptIndex} .text .wrapper`);
  const textDimensions = textBox.getBoundingClientRect();
  const children = Array.from(textBox.children);
  const spans = children.filter(child => child.tagName === 'SPAN');
  const totalWords = spans.length;


  const wordsPerLine = [];
  spans.forEach(span => {
    const box = span.getBoundingClientRect();
    const offset = 33;
    for(let i = 0; i < 100; i++) {
      if(box.top - (20 + i * offset) < textDimensions.top) {
        if(wordsPerLine[i]) {
          wordsPerLine[i].push(span);
          break;
        } else {
          wordsPerLine[i] = [span];
          break;
        }
      }
    }
  });

  const wordIndex = Math.floor(totalWords * (percentage / 100));
  const textContainerTop = document.querySelector('#content > .wrapper').getBoundingClientRect().height - text.getBoundingClientRect().height;
  const arr = Array.from(text.children);
  const paddingTop = arr
    .slice(0, scriptIndex + 1)
    .reduce((acc, curr, i) => {
      if(i === arr.length - 1) {
        return acc = document.querySelector('#content > .wrapper').getBoundingClientRect().height;
      } else if(i === 0) {
        return acc = - 120;
      } else {
        return acc + curr.getBoundingClientRect().height + 16
      }
    }, 0);

  content.scrollTop = textContainerTop + paddingTop - 32;

  wordsPerLine.forEach((line, i) => {
    const sentence = document.querySelector(`.sentence-${i}-${scriptIndex}`);
    let wordsBefore = 0;
    
    for(let j = 0; j < i; j++) {
      wordsBefore += (wordsPerLine[j] || []).length;
    }
    
    if(wordIndex > line.length + wordsBefore) {
      setHighlighting(sentence, textDimensions.width);
    } else if(wordIndex < line.length + wordsBefore && wordIndex > wordsBefore) {
      const index = wordIndex - wordsBefore;
      const width = line[index].getBoundingClientRect().right - textDimensions.left;
      setHighlighting(sentence, width);
    } else {
      setHighlighting(sentence, 0);
    }
  });
}

function setHighlighting(el, width) {
  el.style.backgroundColor = 'yellow';
  el.style.opacity = 0.3;
  el.style.width = `${width}px`;
}