import * as React from 'react';
import { GenericComponent, IGenericProps } from './GenericComponent';
import { Media } from 'react-md/lib/Media';
import { Card } from 'react-md/lib/Cards';
import FontIcon from 'react-md/lib/FontIcons';
import * as _ from 'lodash';

interface IScorecardProps extends IGenericProps {
  scorecardWidth?: number;
  colorPosition?: 'bottom' | 'left';
}

export default class Scorecard extends GenericComponent<IScorecardProps, any> {

  constructor(props: IScorecardProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    let { value, icon, className } = this.state;
    let { title, scorecardWidth, colorPosition } = this.props;

    let style = {};
    if (scorecardWidth) {
      style['width'] = scorecardWidth;
    }

    colorPosition = colorPosition || 'bottom';

    value = (value || '').toString();

    var values = [
      {
        value: value || 0,
        heading: title,
        subvalue: '000',
        subheading: 'Avarege',
        color: ''
      },
      {
        value: '0,000.00',
        heading: 'Total Messages',
        subvalue: '000',
        subheading: 'Avarege',
        color: ''
      },
      {
        value: '0,000.00',
        heading: 'Total Messages',
        subvalue: '000',
        subheading: 'Avarege',
        color: ''
      }
    ];

    var cards = values.map((value, idx) => {
      let colorStyle = {};
      let cardstyle = _.extend({}, style);
      let color = value.color || 'transparent';
      if (colorPosition === 'bottom') { colorStyle['borderBottomColor'] = color; }
      if (colorPosition === 'left') { cardstyle['borderLeftColor'] = color; }
      return (
        <div key={idx} className={'scorecard color-' + colorPosition} style={cardstyle}>
          <div className="md-headline">{value.value}</div>
          <div className="md-subheading-2">{value.heading}</div>
          {
            (value.subvalue || value.subheading) &&
            (
              <div className="scorecard-subheading" style={colorStyle}>
                <b>{value.subvalue}</b>{value.subheading}
              </div>
            )
          }
        </div>
      )
    });

    return (
      <Card onClick={this.handleClick}>
        <Media className='md-card-scorecard'>
          {/*<div className='md-grid md-headline'>
            {icon &&
              <div className="ms-cell md-cell--middle md-cell--2 dash-icon">
                <FontIcon className={className}>{icon}</FontIcon>
              </div>
            }
            <div className='md-cell'>{title}</div>
            <div className='md-cell--right dash-value'>{value}</div>
          </div>*/}
          <div className="md-grid--no-spacing">
            {cards}
          </div>
        </Media>
      </Card>
    );
  }

  handleClick(event, index) {
    if (_.isEmpty(this.props.actions)) {
      return;
    }
    var { title } = this.props || '' as any;
    var args = { ...this.state.value, title: title };
    this.trigger('onCardClick', args);
  }
}