//TODO:
//Color scheme switcher

const wisz = {

  findEventTrigger: function(clickee, nameOfClass) {
    return (clickee.classList.contains(nameOfClass) ? clickee : clickee.parentNode);
  },
	
	photoTrigger: function(thisClickee) {

    // GET URL OF PHOTO FOR CLICKED ICON
    let photoUrl = thisClickee.getAttribute('data-href');
    
    // SHOW THE PHOTO MODAL POPOVER
		let photoModal = document.getElementById('photo-modal');
		photoModal.style.display = 'block';
		photoModal.style.opacity = '1';
    
    // POSITION THE MODAL
		let topNumber = window.pageYOffset + 10;
    photoModal.style.top = topNumber + 'px';
    
    // ASSIGN THE PHOTO URL TO THE IMG SOURCE IN THE MODAL
    document.getElementById('photo-modal-img').src = photoUrl;

    // POPULATE THUMBNAILS IN MODAL FROM CLONED ICONS
    let photoListCopy = document.getElementById('photo-list').cloneNode(true);
    if (!photoModal.classList.contains('ready')) {
      photoModal.insertBefore(photoListCopy, photoModal.firstChild);
      wisz.assignPhotoClickHandlers('#photo-modal .photo-trigger', 'photo-trigger');
      photoModal.classList.add('ready');
    }
  },
  
  assignPhotoClickHandlers: function(selector, nameOfClass) {
    let elements = document.querySelectorAll(selector);
    for (let i=0; i < elements.length; i++) {
      elements[i].addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      let trigger = wisz.findEventTrigger(e.target, nameOfClass);
      wisz.photoTrigger(trigger);
      });
    }
  },
	
	closeButton: function(thisClickee) {
    let clickeeHref = thisClickee.getAttribute('data-href');
		if (clickeeHref == 'photo-modal') {
			let photoModal = document.getElementById('photo-modal');
			photoModal.style.top = '10000px';
			photoModal.style.opacity = 0;
			photoModal.style.display = 'none';
			document.getElementById('photo-modal-img').src = '/assets/img/loading.gif';
    }
    else if (clickeeHref == 'collab-symbol') {
      document.getElementById('collab-symbol').style.animation = 'none';
      thisClickee.style.display = 'none';
    }
		else {
			document.getElementById(clickeeHref).style.display = 'none';
		}
  },

  populatePortfolio: function(thisUrl, yPos) {
    axios.get(thisUrl)
      .then(function (response) {
        // handle success
        document.getElementById('portfolio').innerHTML = response.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        if (localStorage.getItem('portfolio') !== 'wordpress') {
          window.scroll({
            left: 0,
            top: yPos -45,
            behavior: 'smooth'
          });
          localStorage.setItem('portfolio','wordpress');
        }
      });
  },

	copyrightDate: function() {
  	document.getElementById('year').innerHTML = new Date().getFullYear();
  },

  ieWorkaround: function(selector) {
    let targets = document.querySelectorAll(selector);
    for (let i=0; i < targets.length; i++) {
      targets[i].style.opacity = '1';
    }
  },

  findYPos: function(el) {
    var curtop = 0;
    if (el.offsetParent) {
        do {
            curtop += el.offsetTop;
        } while (el = el.offsetParent);
    return [curtop];
    }
  }
  

}

// AFTER DOM IS LOADED
document.addEventListener('DOMContentLoaded', function() {
  if (document.fonts) {
    document.fonts.ready.then(function () {
      let targets = document.querySelectorAll('.above-fold');
      targets.forEach((target) => target.classList.add('animate'));
    });
  }
  else {
    wisz.ieWorkaround('.above-fold');
  }

  if (document.location.hash === '#wordpress' || localStorage.getItem('portfolio') === 'wordpress') {
    document.querySelector('.portfolio-container').style.display = 'block';
    let yPos = wisz.findYPos(document.getElementById('portfolio'));
    wisz.populatePortfolio('/wordpress.html', yPos[0]);
  }
  
	//CLICK HANDLER TO OPEN PHOTO POPOVER
	wisz.assignPhotoClickHandlers('.photo-trigger', 'photo-trigger')
	
  //CLICK HANLDER TO CLOSE PHOTO POPOVER
  let closers = document.querySelectorAll('.close-button');
	for (let i=0; i < closers.length; i++ ) {
		closers[i].addEventListener('click', function(e) {
    e.preventDefault();
    let trigger = wisz.findEventTrigger(e.target, 'close-button');
		wisz.closeButton(trigger);
		});
  }
  
  //ADD CURRENT YEAR TO COPYRIGHT 
  wisz.copyrightDate();

});