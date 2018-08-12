import React from 'react';
import './App.css';

import Navbar from './components/navbar/navbar';
import Gallery from './components/gallery/gallery';
import Sidebar from './components/sidebar/sidebar';

import SpotifyWebApi from 'spotify-web-api-js';
import Q from 'q';
import queryString from 'query-string';

var spotifyApi = new SpotifyWebApi();
spotifyApi.setPromiseImplementation(Q);


class App extends React.Component {

  constructor() {
    super()
    this.changeHandler = this.changeHandler.bind( this );
    this.clickHandler = this.clickHandler.bind( this );
    this.playAudio = this.playAudio.bind( this );
    this.state = {
      query: '',
      artists: [],
      tracks: [],
      user: {
        name: ''
      },
      playingUrl: '',
      audio: null,
      playing: false
    };
  }

  componentDidMount() {
    // this.clickHandler()
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    console.log("access token", accessToken)

    spotifyApi.setAccessToken(accessToken);

    if (!accessToken) {
      return;
    }

    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => {
      console.log(data);
      this.setState({
      user: {
        name: data.id
      }
    })})
  }

  changeHandler(event) {
    this.setState({ query: event.target.value });
    console.log("searching", event.target.value);

    // search artists
    spotifyApi.searchArtists(event.target.value)
    .then(data => {
      let artistData = data.artists.items;
      this.setState({ artists: artistData })
    }, function(err) {
      console.error(err);
    });

    // search tracks
    spotifyApi.searchTracks(event.target.value)
    .then(data => {
      // console.log('Searching tracks', data);
      let trackData = data.tracks.items
      this.setState({ tracks: trackData })

    }, function(err) {
      console.error(err);
    });
  }

  clickHandler(event) {
    if(this.state.playing) {
        this.state.audio.pause();
        this.setState({ playing: false })
    } else {
        this.state.audio.play();
        this.setState({ playing: true })
    }
  }

  playAudio(tracks) {
    console.log("play audio is clicked!");
    console.log(tracks);
    let previewUrl = tracks.preview_url
    let audio = new Audio(previewUrl);
    if(!this.state.playing) {
        audio.play();
        this.setState({ playing: true,
                        playingUrl: previewUrl,
                        audio
                })
    } else {
        if (this.state.playingUrl === previewUrl) {
            this.state.audio.pause();
            this.setState ({ playing: false })
        } else {
            this.state.audio.pause();
            audio.play();
            this.setState({ playing: true,
                            playingUrl: previewUrl,
                            audio 
                    })
        }
    }
  }

  // clickHandler(event) {

    // console.log("Login button clicked!")

    // // Set spotify web token
    // var request = require('request'); // "Request" library

    // var client_id = '43d4f6cdd3094558b06f3425f8462eed'; // Your client id
    // var client_secret = 'e15a4cda1cd34664b099b2d279c86ce3'; // Your secret

    // // your application requests authorization
    // var authOptions = {
    //   url: 'https://accounts.spotify.com/api/token',
    //   headers: {
    //     'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    //   },
    //   form: {
    //     grant_type: 'client_credentials'
    //   },
    //   json: true
    // };

    // request.post(authOptions, function(error, response, body) {
    //   if (!error && response.statusCode === 200) {
    
    //     // use the access token to access the Spotify Web API
    //     var token = body.access_token;
    //     console.log("access token", token);

    //     // set access token
    //     spotifyApi.setAccessToken(token);

    //     var options = {
    //       url: 'https://api.spotify.com/v1/users/angtingsoon',
    //       headers: {
    //         'Authorization': 'Bearer ' + token
    //       },
    //       json: true
    //     };
    //     request.get(options, function(error, response, body) {
    //       console.log(body);
    //     });
    //   }
    // });
  // }

  render() {
    return (

      <div className="container app-window">
        <Navbar onChange={this.changeHandler} user={this.state.user.name} />
        <div className="row">
          <div className="sidenav col-sm-2">
            <Sidebar />
            <div className="track-play">
              <div></div>
              <div className="track-play-inner" onClick={this.clickHandler} >
                {
                this.state.playing === true
                ? <span>||</span>
                : <span>&#9654;</span>
                }
              </div>
            </div>
          </div>
          <div className="col-sm-10 main-content">
              <Gallery query={this.state.query} 
                      artists={this.state.artists} 
                      tracks={this.state.tracks} 
                      playAudio={this.playAudio}
                      />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
