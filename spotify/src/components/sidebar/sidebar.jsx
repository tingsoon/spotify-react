import React from 'react';
import './sidebar.css';

class Sidebar extends React.Component {
    render() {
      return (
        <div>
            <p id="error-message">{this.props.errorMessage}</p>
            <a id="error-message" href="http://localhost:8888/login">Click Here if token expires.</a>
            <p id="summary"><span><i class="fas fa-headphones"></i></span> Beats by Tings was made using ReactJs with Spotify API as part of the final project of General Assembly Web Immersive Course.</p>
        </div>
      );
    }
  }
  
  export default Sidebar;