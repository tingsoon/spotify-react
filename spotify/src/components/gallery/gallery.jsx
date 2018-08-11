import React from 'react';
import './gallery.css';

class Gallery extends React.Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind( this );
        this.state = {
            playingUrl: '',
            audio: null,
            playing: false
        }
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

    playAudio(previewUrl) {
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


    render() {
        let searchQuery;
        let searchArtists;
        if (this.props.query.length === 0) {
            searchQuery = ''
        } else {
            searchQuery = "Showing results for " + this.props.query + " ..."
        };
        if (this.props.query.length === 0) {
            searchArtists = ''
        } else {
            searchArtists = "Displaying artists... "
        };

        // mapping artists
        let artists = this.props.artists.map( (artist, id) => { 
          return  <div key={id} className="card">
                    <img src={(artist.images[1] ? artist.images[1].url : './spotify.png')} className="card-img-top artist-img" />
                    <div className="card-body">
                        <p className="card-text">{artist.name}</p>
                    </div>
                  </div> 
        });

        // convert ms to mins & secs
        function millisToMinutesAndSeconds(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
          }

        // mapping tracks
        let tracks = this.props.tracks.map( (tracks, id) => {
            return  <tbody key={id}>
                        <tr>
                            <td onClick={() => this.playAudio(tracks.preview_url)}>{(tracks.name ? tracks.name : '')}</td>
                            <td>{(tracks.artists[0] ? tracks.artists[0].name : '')}</td>
                            <td>{tracks.album.name ? tracks.album.name : ''}</td>
                            <td>{millisToMinutesAndSeconds(tracks.duration_ms)}</td>
                        </tr>
                    </tbody>
        })

      return (
        <div className="main-content">
            <h4>{searchQuery}</h4>
            <br></br>
            <h5>{searchArtists}</h5>
            {this.props.query && (
                <div>{artists}</div>
            )}
            <br />
            <br />
            {this.props.query && (
                <div>
                <h5>Displaying songs...</h5>
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">Songs</th>
                        <th scope="col">Artist</th>
                        <th scope="col">Album</th>
                        <th scope="col">Time</th>
                        </tr>
                    </thead>
                    {tracks}
                </table>
                </div>
            )}
            <div className="track-play">
                <div className="track-play-inner" onClick={this.clickHandler} >
                {
                this.state.playing === true
                ? <span>||</span>
                : <span>&#9654;</span>
                }
                </div>
            </div>
        </div>
      );
    }
  }
  
  export default Gallery;