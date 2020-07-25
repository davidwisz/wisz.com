let callback = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add('seen');
      observer.unobserve(entry.target);
    }
  });
};

let options = {
  rootMargin: '0px',
  threshold: .13
}

let observer = new IntersectionObserver(callback, options);

let targets = document.querySelectorAll('.scroll-in');

targets.forEach(target => {
  observer.observe(target);
});


