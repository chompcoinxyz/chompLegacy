import React, { Component } from 'react';

class NotFoundErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("NotFoundErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1 className='p-8 text-white'>Something went wrong. We're working on it.</h1>;
    }

    return this.props.children; 
  }
}

export default NotFoundErrorBoundary;
