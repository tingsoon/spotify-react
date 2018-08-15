import React from 'react';
import './navbar.css';

class Navbar extends React.Component {
    render() {
      return (
        <div className="container">
            <nav className="navbar fixed-top">
            <div className="form-group">
                <form className="form-inline">
                    <input onChange={this.props.onChange} className="form-control form-control-sm" id="input-width" type="search" placeholder="Search for artists, songs & albums.." aria-label="Search" />
                </form>
            </div>
            <div id="nav-title">
            <div id="title"><i className="fas fa-headphones"></i></div>
            <div id="title"><h4>Beats By Tings</h4></div>
            </div>
            <p id="welcome">Welcome <a id="user-link" href={this.props.userLink}>{this.props.user}</a></p>
            </nav>
        </div>
      );
    }
  }
  
  export default Navbar;