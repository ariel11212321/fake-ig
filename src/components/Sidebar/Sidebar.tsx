// Sidebar.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faImages, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css'; // Import custom styles

export default function Sidebar() {
  return (
    <nav
      id="sidebarMenu"
      className="sidebar bg-light border-right shadow-sm"
      style={{ width: '250px', height: '100vh' }}
    >
      <div className="position-sticky">
        <div className="list-group list-group-flush">
          <Link
            to="/home"
            className="list-group-item list-group-item-action py-3 ripple d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faHome} className="me-3" />
            <span>Home</span>
          </Link>
          <Link
            to="/profile"
            className="list-group-item list-group-item-action py-3 ripple d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faUser} className="me-3" />
            <span>Profile</span>
          </Link>
          <Link
            to="/addPost"
            className="list-group-item list-group-item-action py-3 ripple d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faImages} className="me-3" />
            <span>Add Post</span>
          </Link>
          <Link
            to="/settings"
            className="list-group-item list-group-item-action py-3 ripple d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faCog} className="me-3" />
            <span>Settings</span>
          </Link>
          <Link
            to="/"
            className="list-group-item list-group-item-action py-3 ripple d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="me-3" />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
