import React from 'react';
import './navbar.css';

class Navbar extends React.Component {
    render() {
      return (
        <div>
            <nav className="navbar fixed-top">
            <div className="form-group">
                <form className="form-inline">
                    <input onChange={this.props.onChange} className="form-control form-control-sm" id="input-width" type="search" placeholder="Search for artists, songs & albums.." aria-label="Search" />
                </form>
            </div>
            <p id="welcome">Welcome <a id="user-link" href={this.props.userLink}>{this.props.user}</a></p>
            </nav>
        </div>
      );
    }
  }
  
  export default Navbar;