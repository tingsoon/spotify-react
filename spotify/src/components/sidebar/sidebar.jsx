import React from 'react';
import './sidebar.css';

class Sidebar extends React.Component {
    render() {
      return (
        <div>
            {/* <p>Sidebar</p> */}
            <p id="error-message">{this.props.errorMessage}</p>
            <a href="http://localhost:8888/login">Click Here if refresh token expires.</a>
        </div>
      );
    }
  }
  
  export default Sidebar;