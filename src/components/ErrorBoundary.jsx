// src/components/ErrorBoundary.jsx
import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
    if (this.props.logError) {
      this.props.logError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return (
          <div>
            {this.props.fallback}
            <button onClick={this.handleRetry}>Retry</button>
          </div>
        );
      }
      return (
        <div>
          <h2>Something went wrong. Please try again later.</h2>
          <button onClick={this.handleRetry}>Retry</button>
        </div>
      );
    }
    return this.props.children; 
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  logError: PropTypes.func,
};

export default ErrorBoundary;
