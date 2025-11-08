import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="dashboard">
      <div className="container">
        <div className="text-center">
          <div className="card">
            <div className="card-body">
              <h1 className="dashboard-title mb-4">404 - Page Not Found</h1>
              <p className="dashboard-subtitle mb-4">
                The page you're looking for doesn't exist.
              </p>
              <Link to="/" className="btn btn-primary">
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
