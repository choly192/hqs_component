/**
 * handle component catch Error
 */
import * as React from "react";

interface Iprops {
  errorEle?: any;
}

class ErrorBoundary extends React.Component<Iprops, any> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      isError: false
    };
  }
  // error  catch
  componentDidCatch() {
    this.setState({ isError: true });
  }
  render() {
    return !this.state.isError
      ? this.props.children
      : this.props?.errorEle ?? null;
  }
}

export default ErrorBoundary;
