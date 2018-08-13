import React from 'react';
import './gallery.css';

class Gallery extends React.Component {

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
                    <img src={(artist.images[1] ? artist.images[1].url : './spotify.png')} className="card-img-top artist-img" onClick={() => {
                                                                                                                                this.props.clickArtist(artist);
                                                                                                                                this.props.removeArtist();
                                                                                                                                }} />
                    <div className="card-body d-flex">
                        <p className="card-text" id="image-text">{artist.name}</p>
                    </div>
                    </div> 
        });

        // mapping albums
        let albums = this.props.albums.map( (album, id) => {
            return  <div key={id} className="card">
                     <img src={(album.images[1] ? album.images[1].url : './spotify.png')} className="card-img-top artist-img" onClick={() => this.props.clickAlbum(album)} />
                     <div className="card-body d-flex">
                        <p className="card-text" id="image-text">{album.name}</p>
                    </div>
                    </div>
        })

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
                            <td onClick={() => this.props.playAudio(tracks)}>{(tracks.name ? tracks.name : '')}</td>
                            <td>{(tracks.artists[0] ? tracks.artists[0].name : '')}</td>
                            <td>{tracks.name ? tracks.name : ''}</td>
                            <td>{millisToMinutesAndSeconds(tracks.duration_ms)}</td>
                        </tr>
                    </tbody>
        })

      return (
        <div className="main-content">
            <h4>{searchQuery}</h4>
            <br></br>
            {this.props.artistClicked && (
                <div>
                {this.props.query && (
                    <div>
                    <h5>{searchArtists}</h5>
                    <div>{artists}</div>
                    <br />
                    <br />
                    </div>
                )}
                </div>
            )}

            {this.props.query && (
                <div>
                <h5>Displaying albums...</h5>
                <div>{albums}</div>
                </div>
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

        </div>
      );
    }
  }
  
  export default Gallery;