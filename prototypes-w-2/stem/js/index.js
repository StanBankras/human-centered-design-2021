const examples = document.querySelectorAll('.example');
const buttons = document.querySelectorAll('.button');

buttons.forEach(button => button.addEventListener('click', e => showExample(e)));

function showExample(e) {
  const number = buttonNumber(e);
  buttons.forEach(button => button.classList.remove('active'));
  e.target.classList.add('active');
  e.target.parentElement.classList.add('active');
  examples.forEach(example => example.classList.add('hidden'));
  document.querySelector(`.example-${number}`).classList.remove('hidden');
}

function buttonNumber(e) {
  let item = e.target;
  if(item.nodeName !== 'BUTTON') item = item.parentElement;
  if(item.classList.contains('1')) return 1;
  if(item.classList.contains('2')) return 2;
  if(item.classList.contains('3')) return 3;
  return 1;
}