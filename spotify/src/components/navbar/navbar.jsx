import React from 'react';
import './navbar.css';

class Navbar extends React.Component {
    render() {
      return (
        <div>
            <nav className="navbar navbar-light bg-light">
            <div className="form-group">
                <form className="form-inline">
                    <input onChange={this.props.onChange} className="form-control form-control-sm" id="input-width" type="search" placeholder="Search for artists, songs & albums.." aria-label="Search" />
                </form>
            </div>
            <p>Welcome {this.props.user}</p>
            </nav>
        </div>
      );
    }
  }
  
  export default Navbar;