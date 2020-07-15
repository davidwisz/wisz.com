//Onload check for font load, then run animation on header and hero content
//Onscroll animation as content enters reading pane/screen
//Color scheme switcher

 /* TEST CROSSBROWSER
 Photo popover
 Copyright date
 */

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
		/*var topNumberOne = document.body.scrollTop + 10;
		var topNumberTwo = document.querySelector('main').scrollTop + 10;
    var tn = topNumberOne > topNumberTwo ? topNumberOne : topNumberTwo;*/
    
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
    let clickeeHref = thisClickee.getAttribute('href');
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

	copyrightDate: function() {
  	document.getElementById('year').innerHTML = new Date().getFullYear();
  },
  

}

// AFTER DOM IS LOADED
document.addEventListener('DOMContentLoaded', function() {
  if (document.fonts) {
    document.fonts.ready.then(function () {
      document.querySelector('h1').classList.add('animate');
      document.querySelector('.intro h3').classList.add('animate');
      document.querySelector('.intro article').classList.add('animate');
      document.querySelector('.profile-photo').classList.add('animate');
      
    });
  }
  else {
    document.querySelector('h1').style.opacity = '1';
    document.querySelector('.intro h3').style.opacity = '1';
    document.querySelector('.intro article').style.opacity = '1';
    document.querySelector('.profile-photo').style.opacity = '1';
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