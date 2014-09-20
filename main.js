(function () {

document.querySelector('.logo').addEventListener('click', function (e) {
  e.preventDefault();
  replaceHash();
});

// Open external links in a new tab.
Array.prototype.slice.call(
  document.querySelectorAll('[href^="//"], [href*="://"]')
).forEach(function (link) {
  link.setAttribute('target', '_blank');
});

// Set `data` attribute for the current section so we can use as a CSS selector.
window.addEventListener('hashchange', updateHash);

function updateHash() {
  document.body.dataset.hash = window.location.hash;
}

function replaceHash(newHash) {
  // Do not use `window.location.hash`. We don't want the page to jump to the
  // top of that section. We're already in that section.
  window.history.replaceState(null, null,
    window.location.pathname + (newHash || ''));
  updateHash();
}

updateHash();

var sections = Array.prototype.slice.call(
  document.querySelectorAll('section')
).map(function (el) {
  return {
    top: el.offsetTop,
    id: el.id
  };
});

function closest() {
  var section;
  var top = window.scrollY;
  var i = sections.length;
  while (i--) {
    section = sections[i];
    if (top >= section.top - 1) {
      return section;
    }
  }
}

var debouncedScroll = new Debounce(function () {
  var h = closest();
  var newHash = h ? ('#' + h.id) : '';

  // Update the query string in the address bar.
  if (window.location.hash !== newHash) {
    replaceHash(newHash);
  }
}, 25);

window.addEventListener('scroll', function () {
  debouncedScroll.reset();
});


function Debounce(func, ms) {
  this.timeout = null;
  this.func = func;
  this.ms = ms;
}

Debounce.prototype.start = function () {
  this.timeout = window.setTimeout(this.func, this.ms);
};

Debounce.prototype.reset = function () {
  this.abort();
  this.start();
};

Debounce.prototype.abort = function () {
  window.clearTimeout(this.timeout);
};

})();
