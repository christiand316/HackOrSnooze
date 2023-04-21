"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";



class Story {

  // Make instance of Story from data object...{title, author, url, username, storyId, createdAt}
   

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }



  getHostName() {
    return new URL(this.url).host;
  }
}




class StoryList {
  constructor(stories) {
    this.stories = stories;
  }


  static async getStories() {


    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });


    const stories = response.data.stories.map(story => new Story(story));


    return new StoryList(stories);
  }



  async addStory(token, {author, title, url}) { 
    const data = {
      token: token,
      story:{
            author: author,
            title: title,
            url: url
            }
          }

    const response = await axios.post(`${BASE_URL}/stories`, data)
    const story = new Story(response.data.story)
    
    
    return story
  }

}



class User {


  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user
    this.loginToken = token;
  }

  // register user with api

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  // login user with api

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }



  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
  //
  // handle favorited stories
  //
 
  userFavorites(story) {
    let selectedStory;
    if(story.storyId === undefined) {
      selectedStory = story
    } else {
      selectedStory = story.storyId
    }

    for (let i = 0; i < this.favorites.length; i++) {
      if (this.favorites[i].storyId == selectedStory) {
        return true;
      }
    }
    return false;
  }

  async modifyFavorites(story, modification){
    let storyInList;
    for (let i = 0; i < storyList.stories.length; i++){
      if (storyList.stories[i].storyId === story) {
        storyInList = storyList.stories[i]
      } 
    }

    
    if (modification === 'POST') {
      const data = {
        token: currentUser.loginToken
      };
      const response = await axios.post(`${BASE_URL}/users/${this.username}/favorites/${story}`, data);
      console.log(storyInList)
      this.favorites.push(storyInList)

    } else {
      const data = {
        params: {
          token: currentUser.loginToken
        }
      };
      const response = await axios.delete(`${BASE_URL}/users/${this.username}/favorites/${story}`, data);
    
      this.favorites = this.favorites.filter(masterStory => masterStory.storyId !== story)
    }
    
  }
  // handles deleting of own stories
  async modifyOwnStory(story) {
    const data = {
      params: {
        token: currentUser.loginToken
      }
    };
    const response = await axios.delete(`${BASE_URL}/stories/${story}`, data)
    console.log(response)
    this.ownStories = this.ownStories.filter(masterStory => masterStory.storyId !== story)
  }
  async addOwnStory(story) {
    this.ownStories.push(story)
  }

  async deleteme(story) {
    this.favorites = this.favorites.filter(masterStory => masterStory.storyId !== story)
    console.log(this.favorites)
  }
}
