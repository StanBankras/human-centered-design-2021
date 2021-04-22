const moreInfo = document.getElementById('more-info');
const infoEl = document.getElementById('info');
const colorModeBtn = document.querySelector('.mode');
const body = document.querySelector('body');

moreInfo.addEventListener('click', () => {
  if(infoEl.classList.contains('show-more')) {
    infoEl.classList.remove('show-more');
    moreInfo.innerText = 'Lees meer over deze aflevering';
  } else {
    infoEl.classList.add('show-more');
    moreInfo.innerText = 'Sluit extra informatie';
  }
});

colorModeBtn.addEventListener('click', e => {
  if(body.classList.contains('dark')) {
    e.target.classList.remove('dark');
    body.classList.remove('dark');
  } else {
    e.target.classList.add('dark');
    body.classList.add('dark');
  }
});