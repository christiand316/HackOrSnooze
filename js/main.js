"use strict";

// legend 

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $favoritedStories = $('#favorited-stories')
const $myStories = $('#my-stories')

// user login
const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $loginButton = $('#login-button')

// nav
const $navSubmit = $('#nav-submit') //
  const $submitForm = $('#submit-form')
const $navFavorites = $('#nav-favorites') //
const $navStories = $('#nav-stories') // 


const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");



function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
    $submitForm,
    $favoritedStories,
    $myStories
  ];
  components.forEach(c => c.hide());
}

// start app

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app


$(start);
