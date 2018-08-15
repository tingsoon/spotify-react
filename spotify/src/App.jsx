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
    this.clickArtist = this.clickArtist.bind( this );
    this.clickAlbum = this.clickAlbum.bind( this );
    this.removeArtist = this.removeArtist.bind( this );
    this.clickTableArtists = this.clickTableArtists.bind( this );
    // this.clickTableAlbums = this.clickTableAlbums.bind( this );

    this.state = {
      query: '',
      artists: [],
      albums: [],
      tracks: [],
      user: {
        name: '',
        link: ''
      },
      playingUrl: '',
      audio: null,
      playing: false,
      preview: {
        image: './spotify.png',
        artist: '',
        title: ''
      },
      artistClicked: true,
      errorMessage: ''
    };
  }

  componentDidMount() {
    // this.clickHandler()

    // Setting API for spotify
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    // let refreshToken = parsed.refresh_token;
    
    console.log("access token", accessToken);
    // console.log("refresh token", refreshToken);

    spotifyApi.setAccessToken(accessToken);

    if (!accessToken) {
      return;
    }

    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => {
      console.log(data.external_urls.spotify);
      this.setState({
      user: {
        name: data.id,
        link: data.external_urls.spotify
      }
    })})

    // when load page, display new releases
    if (!this.state.query) {
      fetch('https://api.spotify.com/v1/browse/new-releases?country=SG&limit=20', {
        headers: {'Authorization': 'Bearer ' + accessToken}
      }).then(response => response.json())
      .then(data => {
        // console.log(data);
        let albumData = data.albums.items;
        this.setState({ albums: albumData })
      })
    }
  }

  changeHandler(event) {
    this.setState({ query: event.target.value,
                    artistClicked: true });
    console.log("searching", event.target.value);

    // if search bar is empty, display new releases
    if (!event.target.value) {
      let parsed = queryString.parse(window.location.search);
      let accessToken = parsed.access_token;
      fetch('https://api.spotify.com/v1/browse/new-releases?country=SG&limit=20', {
        headers: {'Authorization': 'Bearer ' + accessToken}
      }).then(response => response.json())
      .then(data => {
        let albumData = data.albums.items;
        this.setState({ albums: albumData })
      })
    }

    // search artists
    spotifyApi.searchArtists(event.target.value)
    .then(data => {
      let artistData = data.artists.items;
      this.setState({ artists: artistData })
    }, function(err) {
      console.error(err);
    });

    // search albums
    spotifyApi.searchAlbums(event.target.value)
    .then(data => {
      // console.log(data.albums.items)
      let albumData = data.albums.items;
      this.setState({ albums: albumData })
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

  clickHandler() {
    // if playing, pause
    // if no song selected in the first place, console log
    // else, play the song
    if(this.state.playing) {
        this.state.audio.pause();
        this.setState({ playing: false })
    } else if (this.state.audio === null) {
        console.log("No song is selected.")
    } else {
        this.state.audio.play();
        this.setState({ playing: true })
    }
  }

  playAudio(tracks) {
    console.log("play audio is clicked!");
    console.log(tracks);

    let previewUrl = tracks.preview_url;
    if (previewUrl === null) {
      this.setState({ errorMessage: "The selected song cannot be played."})
    } else {
      this.setState({ errorMessage: '' })
    };

    let previewImage;
    if (tracks.album === undefined) {
      // get track from track id
      spotifyApi.getTrack(tracks.id)
      .then(data => {
        let albumData = data.album.images[1].url;
        let albumImage = albumData;
        this.setState({ preview: {
                          image: albumImage,
                          title: tracks.name,
                          artist: tracks.artists[0].name
                        }})
      }, function(err) {
        console.error(err);
      });
      // previewImage = './spotify.png'
    } else {
      previewImage = tracks.album.images[0].url;
    }

    let audio = new Audio(previewUrl);
    if(!this.state.playing) {
        audio.play();
        this.setState({ playing: true,
                        playingUrl: previewUrl,
                        preview: {
                          image: previewImage,
                          title: tracks.name,
                          artist: tracks.artists[0].name
                        },
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
                            preview: {
                              image: previewImage,
                              title: tracks.name,
                              artist: tracks.artists[0].name
                            },
                            audio 
                    })
        }
    }
  }

  clickArtist(artist) {
    console.log(artist.id)

    // search albums by a certain artist
    spotifyApi.getArtistAlbums(artist.id)
    .then(data => {
      console.log(data)
      let albumData = data.items;
      this.setState({ albums: albumData })
    }, function(err) {
      console.error(err);
    });
  }

  clickAlbum(album) {
    console.log(album.id)

    // search albums by a certain artist
    spotifyApi.getAlbumTracks(album.id)
    .then(data => {
      let trackData = data.items;
      this.setState({ tracks: trackData })
    }, function(err) {
      console.error(err);
    });
  }

  removeArtist() {
    console.log("removeArtist Clicked")
    this.setState({ artistClicked: false })
  }

  clickTableArtists(tracks) {
    console.log("artist id", tracks)
    // console.log(event.currentTarget.textContent)
    let newSearch = tracks.artists[0].id;
    let artistName = tracks.artists[0].name;

    // get artist album 
    spotifyApi.getArtistAlbums(newSearch)
    .then(data => {
      let albumData = data.items;
      this.setState({ albums: albumData,
                      query: artistName })
    }, function(err) {
      console.error(err);
    });
  }

  // clickTableAlbums(tracks) {
  //   console.log("album id", tracks)
  // }

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
        <Navbar onChange={this.changeHandler} user={this.state.user.name} userLink={this.state.user.link} />
        <div className="row">
          <div className="sidenav col-sm-2">
            <Sidebar errorMessage={this.state.errorMessage} />
            {this.state.playingUrl && (
              <div className="track-play">
              <h5><strong>Now Playing</strong></h5>
              <div>
                <img src={this.state.preview.image} className="card-img-top track-img" />
                <p className="track-text">{this.state.preview.title}</p>
                <p className="track-text">{this.state.preview.artist}</p>
              </div>
              <div className="track-play-inner" onClick={this.clickHandler} >
                {
                this.state.playing !== true
                ? <span>&#9654;</span>
                : <span>||</span>
                }
              </div>
            </div>
            )}
          </div>
          <div className="col-sm-10 main-content">
              <Gallery query={this.state.query} 
                      artists={this.state.artists}
                      albums={this.state.albums} 
                      tracks={this.state.tracks} 
                      playAudio={this.playAudio}
                      clickArtist={this.clickArtist}
                      clickAlbum={this.clickAlbum}
                      removeArtist={this.removeArtist}
                      artistClicked={this.state.artistClicked}
                      clickTableArtists={this.clickTableArtists}
                      // clickTableAlbums={this.clickTableAlbums}
                      />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
