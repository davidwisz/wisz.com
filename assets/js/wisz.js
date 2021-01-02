// IE11 POLYFILL/HACK TO SUPPORT forEach
if(window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}
if(window.HTMLCollection && !HTMLCollection.prototype.forEach) {
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
}

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
      document.getElementById('collabSymbol').style.animation = 'none';
      thisClickee.style.display = 'none';
    }
    else if (clickeeHref == 'styleSwitchComponent') {
      document.querySelector('.style-prompt').style.display = 'block';
      document.querySelector('.style-component').classList.remove('reveal');
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

  initStyleSwitcher: function() {
    let styleSwitcher = document.getElementById('styleSwitcher');
    let chosenStyle = localStorage.getItem('alternateStyle');
    if (chosenStyle && chosenStyle !== '0') {
      wisz.switchStyle(chosenStyle);
      styleSwitcher.selectedIndex = chosenStyle;
    }
    document.querySelector('.style-prompt').addEventListener('click', wisz.unhideStyleComponent);
    styleSwitcher.addEventListener('change', function(event){wisz.switchStyle(event.target.value)});
  },

  unhideStyleComponent: function() {
    document.querySelector('.style-component').classList.add('reveal');
    document.querySelector('.style-prompt').style.display = 'none';
  },

  switchStyle: function(choice) {
    let profilePhotoSrc = 'headshot-david-wisz-3.jpg';
    let collabSymbolSrc = 'collaboration-symbol-blue.gif';
    let seekingSymbolSrc = 'seeking-symbol-0.gif';
    
    
    // LOAD THE ALTERNATE STYLESHEET
    document.getElementById('alternateStyle').href =  '/assets/css/' + choice + '.css?v=3.1';

    // DESIGNATE NEW IMG SRC FOR THE COLLABORATION SYMBOL
    switch (choice) {
      case '1':
        collabSymbolSrc = 'collaboration-symbol-1.gif';
        break;
      case '2':
        profilePhotoSrc = 'cartoon-haloween-skeleton-skull-spooky-icon-605972.png';
        seekingSymbolSrc = 'weird-eyeballs.gif';
        collabSymbolSrc = 'geometric-animation.gif';
        break;
      default:
        profilePhotoSrc = 'headshot-david-wisz-3.jpg';
        collabSymbolSrc = 'collaboration-symbol-0.gif';
        seekingSymbolSrc = 'seeking-symbol-0.gif';
        
    }
    document.getElementById('profilePhoto').setAttribute('src', '/assets/img/' + profilePhotoSrc);
    document.getElementById('seekingSymbol').setAttribute('src', '/assets/img/' + seekingSymbolSrc);
    document.getElementById('collabSymbol').setAttribute('src', '/assets/img/' + collabSymbolSrc);
    if (localStorage.getItem('alternateStyle') !== choice) {
      localStorage.setItem('alternateStyle',choice);
    }
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
      targets.forEach(function(target) {
        target.classList.add('animate')
      });
    });
  }
  else {
    wisz.ieWorkaround('.above-fold');
  }

  // POPULATE WORDPRESS PORTFOLIO SECTION
  if (document.location.hash === '#wordpress' || localStorage.getItem('portfolio') === 'wordpress') {
    document.querySelector('.portfolio-container').style.display = 'block';
    let yPos = wisz.findYPos(document.getElementById('portfolio'));
    wisz.populatePortfolio('/wordpress.html', yPos[0]);
  }
  
  //INIT STYLE SWITCHER
  wisz.initStyleSwitcher();


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