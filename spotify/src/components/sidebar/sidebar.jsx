import React from 'react';
import './sidebar.css';

class Sidebar extends React.Component {
    render() {
      return (
        <div>
            {/* <p>Sidebar</p> */}
            <p id="error-message">{this.props.errorMessage}</p>
        </div>
      );
    }
  }
  
  export default Sidebar;