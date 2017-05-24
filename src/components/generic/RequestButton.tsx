import * as React from 'react';
import { GenericComponent, IGenericProps, IGenericState } from './GenericComponent';
import Button from 'react-md/lib/Buttons';
import * as request from 'xhr-request';

interface IRequestButtonProps extends IGenericProps {
  props: {
    url: ((dependencies: any) => string) | string;
    icon?: string;
    buttonProps?: { [key: string]: Object };
  };
  theme?: string[];
};

interface IRequestButtonState extends IGenericState {
  body: Object | string;
  headers: Object;
}

export default class RequestButton extends GenericComponent<IRequestButtonProps, IRequestButtonState> {

  state = {
    body: '',
    headers: {},
    disabled: false
  };

  constructor(props: any) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(event: any) {
    let { url } = this.props.props;
    url = this.compileURL(url, this.state);
    this.request(url);
  }

  request(url: string) {
    const { body, headers } = this.state;
    request(url, {
      method: 'POST',
      json: true,
      body: body,
      headers: headers,
    },      function (err: any, data: any) {
      if (err) {
        throw err;
      }
      this.setState({ 'disabled': true });
    }.bind(this));
  }

  render() {
    const { title, props } = this.props;
    const { icon, buttonProps } = props;
    const { disabled } = this.state;

    let isFlat, isRaised, isIcon, isFloating = false;
    isRaised = true; // TODO: button type enum

    return (
      <Button
        onClick={this.onClick}
        label={title}
        flat={isFlat}
        raised={isRaised}
        icon={isIcon}
        {...buttonProps}
        disabled={disabled}
      >
        {icon}
      </Button>
    );
  }

  private compileURL(url: any, params: any): string {
    return typeof url === 'function' ? url(params) : url;
  }

}