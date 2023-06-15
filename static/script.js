function gologin() {
  window.location.href = '/LogIn';
}

function goHomePage() {
  window.location.href = '/';
}

function goSignUp() {
  window.location.href = '/SignUp';
}

function goPage3() {
  window.location.href = '/page3';
}

function goPage5() {
  window.location.href = '/page5';
}
/*---------------------------------------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', function () {
  var fieldsets = document.querySelectorAll('fieldset');
  var fieldsetCount = fieldsets.length;
  var currentFieldset = 0;

  var nextButtons = document.querySelectorAll('.next');
  var nextButtonsCount = nextButtons.length;
  var previousButtons = document.querySelectorAll('.previous');
  var previousButtonsCount = previousButtons.length;

  function showNextFieldset() {
    fieldsets[currentFieldset].style.display = 'none';
    currentFieldset++;
    fieldsets[currentFieldset].style.display = 'block';
    updateProgressBar();
    updateButtonVisibility();
  }

  function showPreviousFieldset() {
    fieldsets[currentFieldset].style.display = 'none';
    currentFieldset--;
    fieldsets[currentFieldset].style.display = 'block';
    updateProgressBar();
    updateButtonVisibility();
  }

  for (var i = 0; i < nextButtonsCount; i++) {
    nextButtons[i].addEventListener('click', showNextFieldset);
  }

  for (var j = 0; j < previousButtonsCount; j++) {
    previousButtons[j].addEventListener('click', showPreviousFieldset);
  }

  function updateButtonVisibility() {
    if (currentFieldset === fieldsetCount - 1) {
      document.getElementById('findBeerButton').style.display = 'block';
    } else {
      document.getElementById('findBeerButton').style.display = 'none';
    }
  }
});

/*--------------------------------------------------------------------------------------------------*/
document.querySelector('form').addEventListener('submit', function (event) {
  var passwordInput = document.querySelector('input[type="password"]');
  var confirmPasswordInput = document.querySelectorAll('input[type="password"]')[1];
  var checkbox = document.querySelector('input[name="olderThan18"]');
  var messageContainer = document.querySelector('.message-container');

  var password = passwordInput.value;
  var confirmPassword = confirmPasswordInput.value;

  if (password !== confirmPassword) {
    event.preventDefault(); // Prevent form submission
    messageContainer.textContent = "Passwords do not match";
    messageContainer.style.display = 'block'; // Show the message
  } else if (!checkbox.checked) {
    event.preventDefault(); // Prevent form submission
    messageContainer.textContent = "You must be older than 18 to proceed";
    messageContainer.style.display = 'block'; // Show the message
  } else {
    messageContainer.style.display = 'none'; // Hide the message
  }
});

/*------------------------------------------------------------------------------------------*/
