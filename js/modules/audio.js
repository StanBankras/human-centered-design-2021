import { drawAudio } from './drawaudio.js';

const audio = document.querySelector('audio');
const text = document.querySelector('#text');
const canvas = document.querySelector('canvas');
const container = document.querySelector('.canvas');
const textContainer = document.querySelector('#text');
const waveCount = document.querySelector('#waves');
const reader = document.querySelector('.canvas div');

const speakerColors = ['#2be4a0', '#2ba0e4', '#e4892b', '#b62be4', '#e42b2b'];
const script = [
  {
    id: 1,
    start: 0,
    end: 24,
    speaker: 'Person Name',
    text: 'Maybe like there\'s something about the aspect ratios on screensss, cause I feel like if you put a fixed position top bar, there\'s a certain people out there, I\'ve met them, that are like: I hate this. Like please don\'t chew into my screen realestate with your fixed topbar, but for some reason, you fix the sidebar and nobody cares you know, but maybe it chews up space that is not as useful, cause you have more horizontal space?'
  },
  {
    id: 2,
    start: 24,
    end: 40,
    speaker: 'Person2 Name',
    text: 'Let\'s fi... eh.. I would be curious like... where this first showed up.. what.. cause, I mean, was it the iPad? I mean, remember when like Steve Jobs like rotated the iPad for the first time, then all of a sudden mail has a sidebar, or you know, Twitter, or.. like.'
  },
  {
    id: 3,
    start: 40,
    end: 45,
    speaker: 'Person Name',
    text: 'oh yeah, Twitter is like this now too I isn\'t it? Yeah.'
  }
]
const speakerSet = script.reduce((acc, curr) => acc.add(curr.speaker), new Set([]));
const speakers = Array.from(speakerSet).map((speaker, i) => {
  return {
    speaker,
    bgColor: speakerColors[i]
  }
});


let currentText;
let dragging = false;
let customWidth;
let currentSecond;

drawAudio('../../assets/shoptalk-clip.mp3', 500, 4000);
drawText();

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

window.addEventListener('mouseup', e => {
  dragging = false;
});

function playScript(second) {
  if(!second) {
    if(currentSecond) second = currentSecond;
  } else {
    currentSecond = second;
  }

  const totalDuration = 45;
  const text = script.find(s => s.start <= second && s.end >= second);
  if(!text) return;
  const textProgress = (second - text.start) / (text.end - text.start) * 100;
  const canvasWidth = canvas.width;
  let containerWidth = container.getBoundingClientRect().width;
  containerWidth = customWidth ? customWidth : containerWidth - containerWidth / 2;

  drawTextProgress(textProgress, text.id);
  canvas.style.transform = `translateX(${containerWidth - second / totalDuration * canvasWidth}px)`;
}

function appendWords(container, sentence) {
  if(container.children && container.children.length > 0) {
    const listArray = Array.from(container.children);
    listArray.forEach(child => {
      child.tagName === 'SPAN' ? child.remove() : ''
    });
  }

  sentence.split(' ').forEach(word => {
    const span = document.createElement('span');
    span.innerText = word + ' ';
    container.append(span);
  });
}

function drawText() {
  script.forEach(paragraph => {
    const container = document.createElement('div');
    container.classList.add('text-wrapper');
    container.classList.add(`section-${paragraph.id}`);

    const personTag = document.createElement('div')
    personTag.classList.add('person-tag');
    personTag.innerText = paragraph.speaker;
    personTag.style.backgroundColor = speakers.find(s => s.speaker === paragraph.speaker).bgColor;

    const text = document.createElement('div');
    const textWrapper = document.createElement('div');
    text.classList.add('text');
    text.appendChild(textWrapper);
    textWrapper.classList.add('wrapper');
    appendWords(textWrapper, paragraph.text);

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
  const lines = textBox.height / 33;
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

  const wordIndex = Math.floor(totalWords * (percentage / 100))

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
      const width = line[index].getBoundingClientRect().left - textDimensions.left;
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

function resetHighlighting() {
  for(let i = 0; i < 21; i++) {
    const el = document.querySelector(`.sentence-${i}`);
    if(el) {
      el.style.width = 0;
    }
  }
}