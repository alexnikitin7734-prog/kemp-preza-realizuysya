(function () {
  var stage = document.getElementById('stage'), slides = [].slice.call(document.querySelectorAll('.slide'));
  var pager = document.getElementById('pager'), black = document.getElementById('black');
  var blobs = document.querySelectorAll('.flow i');
  var cur = -1, outT;
  if (/still/.test(location.search)) document.documentElement.classList.add('still');

  // где стоят пятна градиента на каждом слайде: [x, y, масштаб] для коралла, фуксии, фиолета, персика
  var FLOW = [
    [[1250, 450, 1.1], [1500, 750, 1], [900, 1000, 1], [1700, 200, 1]],
    [[100, 900, .8], [-100, 200, .9], [1500, 1000, .8], [500, 1100, .9]],
    [[1600, 100, .9], [1300, 700, 1], [200, 900, .8], [1800, 1000, .8]],
    [[-50, -50, .9], [700, 1000, .9], [1600, 500, 1], [300, 600, .8]],
    [[1400, 900, 1.1], [200, 1000, .8], [1700, 0, .9], [900, 300, .7]],
    [[600, 300, 1.2], [1300, 900, 1], [-100, 900, .9], [1700, 400, .9]],
    [[1700, 1000, .9], [100, 100, 1], [900, 1100, 1], [1500, 100, .8]],
    [[200, 300, .9], [1600, 200, .9], [1100, 1000, 1.1], [-100, 1000, .8]],
    [[1500, 600, 1], [700, -100, .9], [100, 1000, 1], [1900, 1100, .8]],
    [[900, 500, 1.3], [300, 200, 1.1], [1500, 900, 1.2], [1600, 100, 1]]
  ];
  function flow(i) {
    [].forEach.call(blobs, function (b, k) {
      var p = FLOW[i % FLOW.length][k], w = b.offsetWidth;
      b.style.setProperty('--x', (p[0] - w / 2 + 200) + 'px');
      b.style.setProperty('--y', (p[1] - w / 2 + 200) + 'px');
      b.style.setProperty('--s', p[2]);
    });
  }

  function fit() {
    var k = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = 'scale(' + k + ') translate(-50%, -50%)';
  }
  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (i === cur) return;
    var first = cur < 0;
    if (cur >= 0) {
      var old = slides[cur];
      old.classList.remove('on'); old.classList.add('out');
      clearTimeout(outT);
      outT = setTimeout(function () { slides.forEach(function (s) { if (!s.classList.contains('on')) s.classList.remove('out'); }); }, 1200);
    }
    cur = i;
    slides[i].classList.remove('out');
    flow(i);
    setTimeout(function () { if (cur === i) slides[i].classList.add('on'); }, first ? 0 : 350);
    [].forEach.call(pager.children, function (d, k) { d.classList.toggle('on', k === i); });
    history.replaceState(null, '', '#' + (i + 1));
  }

  // кликер шлёт PageDown/PageUp или стрелки; F — во весь экран, B или точка — чёрный экран
  // музыка стартует с первого нажатия — браузер не даёт играть без него; M — включить/выключить
  var music = document.getElementById('music'), musicOn = true;
  music.volume = .4;
  function playMusic() { if (musicOn && black.hidden && music.paused) music.play().catch(function () {}); }
  addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'm' || k === 'M' || k === 'ь' || k === 'Ь') { musicOn = music.paused; if (musicOn) music.play().catch(function () {}); else music.pause(); return; }
    if (k === 'b' || k === 'B' || k === 'и' || k === 'И' || k === '.' || k === 'ю') { black.hidden = !black.hidden; if (black.hidden) playMusic(); else music.pause(); return; }
    if (k === 'F5' || k === 'f' || k === 'F' || k === 'а' || k === 'А') {
      e.preventDefault();
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {}); else document.exitFullscreen();
      return;
    }
    if (!black.hidden) black.hidden = true;
    playMusic();
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].indexOf(k) >= 0) { e.preventDefault(); go(cur + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].indexOf(k) >= 0) { e.preventDefault(); go(cur - 1); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(slides.length - 1);
  });
  addEventListener('click', playMusic);

  var hideT;
  addEventListener('mousemove', function () {
    document.body.classList.add('mouse');
    clearTimeout(hideT); hideT = setTimeout(function () { document.body.classList.remove('mouse'); }, 1500);
  });
  addEventListener('resize', fit);
  fit();
  slides.forEach(function (s) {
    pager.appendChild(document.createElement('i'));
    [].forEach.call(s.querySelectorAll('.c'), function (c, i) { c.style.setProperty('--i', i); });
  });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
    go((parseInt(location.hash.slice(1), 10) || 1) - 1);
  });
})();
