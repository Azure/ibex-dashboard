import * as React from 'react';
import { GenericComponent, IGenericProps, IGenericState } from './GenericComponent';
import Button from 'react-md/lib/Buttons';
import * as request from 'xhr-request';

enum Method {
  GET,
  POST,
  PUT,
  DELETE
}

interface IRequestButtonProps extends IGenericProps {
  props: {
    url: ((dependencies: any) => string) | string;
    method?: Method;
    link?: boolean;
    icon?: string;
    once?: boolean;
    buttonProps?: { [key: string]: Object };
  };
  theme?: string[];
};

interface IRequestButtonState extends IGenericState {
  body: Object | string;
  headers: Object;
  disabled: boolean;
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
    let { url, link } = this.props.props;
    url = this.compileURL(url, this.state);
    if (link) {
      return this.open(url);
    }
    return this.request(url);
  }

  open(url: string) {
    const { once } = this.props.props;
    window.open(url);
    if (once) {
      this.setState({ 'disabled': true });
    }
  }

  request(url: string) {
    const { once } = this.props.props;
    const { body, headers } = this.state;
    let { method } = this.props.props;
    if (method === undefined) {
      method = Method.GET;
    }
    request(url, {
      method: method.toString(),
      json: true,
      body: body,
      headers: headers,
    },      function (err: any, data: any) {
      if (err) {
        throw err;
      }
      if (once) {
        this.setState({ 'disabled': true });
      }
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