"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}


$
async function submitStory(e) { 
// grab info and make ui disappear $submitForm
  const author = $('#form-author').val()
  const title = $('#form-title').val()
  const url = $('#form-url').val()
  const user = currentUser.username
  const data = {author, title, url}
  

  document.getElementById("submit-form").reset();
  $submitForm.hide()
  const newStory = await storyList.addStory(currentUser.loginToken, data) 
  const prependStory = generateStoryMarkup(newStory, 'noTrash')
  storyList.stories.unshift(newStory)
  currentUser.addOwnStory(newStory)
  

  putStoriesOnPage()


}
$submitForm.on('submit', submitStory)

function showStarCheck(story, iconMod) {
  if(!currentUser || iconMod === 'noStar'){
    return `<span class='favorite'></span>`
  }
  
  
  let favoriteState;
  if (currentUser.userFavorites(story) === true) {
    favoriteState = `<i class="fas fa-heart fav" style="color: #d7a009;"></i>`;
  } else {
    
    favoriteState = `<i class="fas fa-heart nofav" style="color: #c7c7c7;"></i>`;
  }
  return `
  <span class='favorite'>
  ${favoriteState}
  </span>`
}
function showDeleteCheck(story, iconMod){
  
  if(!currentUser || iconMod === 'noTrash'){
    return `<span class='noOwnership'></span>`
  }
  
  let ownershipState = `<i class=""></i>`
  currentUser.ownStories.forEach((element) => {
    if (element === story) {
      ownershipState = `<i class="fas fa-times" style="color: #b80a0a;"></i>`;
    }
  });
  return `
  <span class='trash'>
  ${ownershipState}
  </span>
  `
}
function generateStoryMarkup(story, iconMod) {
  console.debug("generateStoryMarkup", story);
  
  const hostName = story.getHostName();
  $
  return $(`
      <li id="${story.storyId}">
        
        ${showStarCheck(story, iconMod)}
        ${showDeleteCheck(story, iconMod)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}


//
// handle populating OL of all stories and favorites stories
//

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  $favoritedStories.empty();
  $allStoriesList.empty();  
  $myStories.empty()
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story, 'noTrash');
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}



function putFavoritesOnPage() {
  $favoritedStories.empty();
  $allStoriesList.empty();  
  $myStories.empty()
  for(let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story, 'noTrash');
    $favoritedStories.append($story);
  }
  $favoritedStories.show();
}

function putOwnStoriesOnPage(){
  $myStories.empty()
  $allStoriesList.empty();  
  $favoritedStories.empty();
  for(let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story, 'noStar');
    $myStories.append($story)
  }
  $myStories.show()
}
//
// handles clicks
//
$allStoriesList.on('click', '.favorite', toggleFavoriteState)
$myStories.on('click', '.trash', triggerDelete)

async function toggleFavoriteState(e) {
  const targetStory = e.target.parentNode.parentNode.id
  const isFavorite = currentUser.userFavorites(targetStory)

  if (isFavorite){
    await currentUser.modifyFavorites(targetStory, 'DELETE')
    e.target.parentNode.innerHTML = '<i class="fas fa-heart nofav" style="color: #c7c7c7;"></i>'
  } else {
    await currentUser.modifyFavorites(targetStory, 'POST')
    e.target.parentNode.innerHTML = `<i class="fas fa-heart fav" style="color: #d7a009;"></i>`
  }
}

async function triggerDelete(e) {
  const targetStory = e.target.parentNode.parentNode.id
  await currentUser.modifyOwnStory(targetStory)
  e.target.parentNode.parentNode.remove()

  for (let i = 0; i < storyList.stories.length; i++) {
    if (storyList.stories[i].storyId === targetStory) {
      storyList.stories.splice(i, 1);
    }
  }

  const isFavorite = currentUser.userFavorites(targetStory) 
  if (isFavorite) {
    currentUser.deleteme(targetStory)
  }
  
  putStoriesOnPage()

  }