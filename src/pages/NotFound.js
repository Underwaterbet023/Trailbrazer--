import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Page not found</h2>
          <p className="mt-2 text-base text-gray-500">Sorry, we couldn't find the page you're looking for.</p>
          <div className="mt-6">
            <Link to="/" className="text-base font-medium text-primary-600 hover:text-primary-500">
              Go back home<span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;