import React from 'react';
import { H2, Box, Link } from '@deity/falcon-ui';

// based on https://reactjs.org/docs/error-boundaries.html
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box m="md" css={{ textAlign: 'center' }}>
          <H2 mb="md">Something went wrong....</H2>
          <Link onClick={() => window.location.reload()}>Refresh</Link>
        </Box>
      );
    }

    return this.props.children;
  }
}
