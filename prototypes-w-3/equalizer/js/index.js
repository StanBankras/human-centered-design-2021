const audio = document.querySelector('audio');
const text = document.querySelector('#text');
const canvas = document.querySelector('canvas');
const container = document.querySelector('.example');
const textContainer = document.querySelector('#text');
const reader = document.querySelector('.canvas div');
let currentText;
let dragging = false;
let customWidth;

const script = [
  {
    start: 0,
    end: 24,
    text: 'Maybe like there\'s something about the aspect ratios on screensss, cause I feel like if you put a fixed position top bar, there\'s a certain people out there, I\'ve met them, that are like: I hate this. Like please don\'t chew into my screen realestate with your fixed topbar, but for some reason, you fix the sidebar and nobody cares you know, but maybe it chews up space that is not as useful, cause you have more horizontal space?'
  },
  {
    start: 24,
    end: 40,
    text: 'Let\'s fi... eh.. I would be curious like... where this first showed up.. what.. cause, I mean, was it the iPad? I mean, remember when like Steve Jobs like rotated the iPad for the first time, then all of a sudden mail has a sidebar, or you know, Twitter, or.. like.'
  },
  {
    start: 40,
    end: 45,
    text: 'oh yeah, Twitter is like this now too I isn\'t it? Yeah.'
  }
]

drawAudio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3', 300, 2000);

for(let i = 0; i < 20; i++) {
  const div = document.createElement('div');
  div.classList.add(`sentence-${i}`);
  div.style.position = 'absolute';
  div.style.top = `${i * 33}px`;
  div.style.height = '33px';
  div.style.zIndex = -1;
  textContainer.appendChild(div);
}

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
  }
});

window.addEventListener('mouseup', e => {
  dragging = false;
});

function playScript(second) {
  const totalDuration = 45;
  const text = script.find(s => s.start <= second && s.end >= second);
  if(!text) return;
  if(!currentText || JSON.stringify(currentText) !== JSON.stringify(text)) {
    currentText = text;
    appendWords(textContainer, text.text);
    resetHighlighting();
  }
  const textProgress = (second - text.start) / (text.end - text.start) * 100;
  const canvasWidth = canvas.width;
  let containerWidth = container.getBoundingClientRect().width;
  containerWidth = customWidth ? customWidth : containerWidth - containerWidth / 2;

  drawTextProgress(textProgress, text.end - text.start);
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

function drawTextProgress(percentage, duration) {
  const textBox = textContainer.getBoundingClientRect();
  const lines = textBox.height / 33;
  const children = Array.from(textContainer.children);
  const spans = children.filter(child => child.tagName === 'SPAN');
  const totalWords = spans.length;

  const wordsPerLine = [];
  spans.forEach(span => {
    const box = span.getBoundingClientRect();
    const offset = 33;
    for(let i = 0; i < 100; i++) {
      if(box.top - (20 + i * offset) < textBox.top) {
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
    const sentence = document.querySelector(`.sentence-${i}`);
    let wordsBefore = 0;
    
    for(let j = 0; j < i; j++) {
      wordsBefore += wordsPerLine[j].length;
    }
    
    if(wordIndex > line.length + wordsBefore) {
      setHighlighting(sentence, textBox.width);
    } else if(wordIndex < line.length + wordsBefore && wordIndex > wordsBefore) {
      const index = wordIndex - wordsBefore;
      const width = line[index].getBoundingClientRect().left - textBox.left;
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