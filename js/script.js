var navMain = document.querySelector('.main-nav');
var navToggleOpen = document.querySelector('.main-nav__toggle--open');
var navToggleClose = document.querySelector('.main-nav__toggle--close');

var formModule = document.querySelector('.reviews__form');
if (formModule) {
  var userName = formModule.querySelector('#user-name');
  var userSurname = formModule.querySelector('#user-surname');
  var userEmail = formModule.querySelector('#user-email');
  var userPhone = formModule.querySelector('#user-phone');
}

var layer = document.querySelector(".modal-overlay");

var formSuccess = document.querySelector('.success');
if (formSuccess) {
  var buttonSuccess = formSuccess.querySelector('.success__button');
}

var formFailure = document.querySelector('.failure');
if (formFailure) {
  var buttonFailure = formFailure.querySelector('.failure__button');
}

var scaleElem = document.querySelector('.video__volume-scale');
var sliderElem = document.querySelector('.video__volume-slider');


navMain.classList.remove('main-nav--nojs');

navToggleOpen.addEventListener('click', function(event) {
  event.preventDefault();
  if (!navMain.classList.contains('main-nav--show')) {
    navMain.classList.add('main-nav--show');
  }
});

navToggleClose.addEventListener('click', function(event) {
  event.preventDefault();
  if (navMain.classList.contains('main-nav--show')) {
    navMain.classList.remove('main-nav--show');
  }
});

if (formModule) {
  formModule.addEventListener("submit", function(event) {
    if (!userSurname.value || !userName.value || !userEmail.value || !userPhone.value) {
      event.preventDefault();
      layer.classList.add("modal-overlay--show");
      formFailure.classList.add("failure--show");
      if (!userSurname.value) {
        userSurname.classList.add('input-field--error');
      }
      if (!userName.value) {
        userName.classList.add('input-field--error');
      }
      if (!userEmail.value) {
        userEmail.classList.add('input-field--error');
      }
      if (!userPhone.value) {
        userPhone.classList.add('input-field--error');
      }
    } else {
      event.preventDefault();
      layer.classList.add("modal-overlay--show");
      formSuccess.classList.add("success--show");
      this.reset();
    }
  });

  formModule.addEventListener("focus", function() {
    if (document.activeElement.classList.contains('input-field--error')) {
      document.activeElement.classList.remove('input-field--error');
    }
  }, true);

  buttonSuccess.addEventListener("click", function(event) {
    event.preventDefault();
    formSuccess.classList.remove("success--show");
    layer.classList.remove("modal-overlay--show");
  });

  buttonFailure.addEventListener("click", function(event) {
    event.preventDefault();
    formFailure.classList.remove("failure--show");
    layer.classList.remove("modal-overlay--show");
  });

  window.addEventListener("keydown", function(event) {
    if (event.keyCode === 27) {
      if (formSuccess.classList.contains("success--show")) {
        formSuccess.classList.remove("success--show");
      }
      if (formFailure.classList.contains("failure--show")) {
        formFailure.classList.remove("failure--show");
      }
      if (layer.classList.contains("modal-overlay--show")) {
        layer.classList.remove("modal-overlay--show");
      }
    }
  });
}

if (scaleElem) {
  sliderElem.onmousedown = function(e) {
    var sliderPosX = coord(sliderElem)[0];
    var scalePosX = coord(scaleElem)[0];
    var shiftX = e.pageX - sliderPosX;
    var scaleWidth = scaleElem.offsetWidth;
    var slideWidth = sliderElem.offsetWidth;

    document.onmousemove = function(e) {
      var newLeft = e.pageX - scalePosX - shiftX;
      sliderElem.style.left = newLeft + 'px';
      if (newLeft < 0) {
        sliderElem.style.left = '0';
      }
      if (newLeft > (scaleWidth - slideWidth)) {
        sliderElem.style.left = scaleWidth - slideWidth + 'px';
      }
    };

    document.onmouseup = function() {
      document.onmousedown = null;
      document.onmousemove = null;
    };

    return false;
  };

  sliderElem.ondragstart = function() {
    return false;
  };

  function coord(element) {
    var pos = element.getBoundingClientRect();
    return [pos.left + window.pageXOffset, pos.top + window.pageYOffset];
  }
}
