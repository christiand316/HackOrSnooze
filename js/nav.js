"use strict";


// Show $allstorieslist when site is clicked

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

// Show login/signup on click on "login" 

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}
$navLogin.on("click", navLoginClick);


function navSubmitClick() {
  $submitForm.toggle()
  if ($submitForm.is(':visible')) {
  $submitForm.show()
  } else {
    $submitForm.hide()
  }
}
$navSubmit.on('click', navSubmitClick);



// user logs in

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".logged-in-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navFavoritesClick() {
  $allStoriesList.empty()
  $myStories.empty()
  putFavoritesOnPage()
}
$navFavorites.on('click', navFavoritesClick)

function navMyStory() {
  $allStoriesList.empty()
  $favoritedStories.empty()
  putOwnStoriesOnPage()
}
$navStories.on('click', navMyStory)