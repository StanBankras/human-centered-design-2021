const examples = document.querySelectorAll('.example');
const buttons = document.querySelectorAll('.button');
const modes = document.querySelectorAll('.mode');
let currentEx = 1;

buttons.forEach(button => button.addEventListener('click', e => showExample(e)));
modes.forEach(mode => mode.addEventListener('click', e => switchMode(e)));

darkModeTime();

function showExample(e) {
  const number = buttonNumber(e);
  currentEx = number;
  const example = document.querySelector(`.example-${number}`);


  darkModeTime();

  buttons.forEach(button => button.classList.remove('active'));
  examples.forEach(example => example.classList.add('hidden'));
  e.target.classList.add('active');
  e.target.parentElement.classList.add('active');
  example.classList.remove('hidden');
}

function darkModeTime() {
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const timeElements = document.querySelectorAll('.time');
  const lightMode = hours >= 8 && hours < 18;
  timeElements.forEach(el => el.innerHTML = `Het is nu ${hours}:${minutes}. Dat betekent dat ${lightMode ? 'light mode' : 'dark mode'} actief is. ${lightMode ? '<span class="material-icons">light_mode</span>' : '<span class="material-icons">dark_mode</span>'}`)
}

function switchMode(e) {
  const mode = e.target.dataset.mode;
  examples.forEach(example => example.classList.remove('dark'));
  if(mode === 'dark') {
    document.querySelector(`.example-${currentEx}`).classList.add('dark');
    modes.forEach(mode => mode.classList.remove('active'));
    e.target.classList.add('active');
    e.target.parentElement.classList.add('active');
  } else {
    document.querySelector(`.example-${currentEx}`).classList.remove('dark');
    modes.forEach(mode => mode.classList.remove('active'));
    e.target.classList.add('active');
    e.target.parentElement.classList.add('active');
  }
} 

function buttonNumber(e) {
  let item = e.target;
  if(item.nodeName !== 'BUTTON') item = item.parentElement;
  if(item.classList.contains('1')) return 1;
  if(item.classList.contains('2')) return 2;
  if(item.classList.contains('3')) return 3;
  return 1;
}