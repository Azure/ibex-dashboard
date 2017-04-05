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
    let { values, value, icon, subvalue, color, className } = this.state;
    let { title, props, scorecardWidth, colorPosition, actions } = this.props;
    let { subheading } = props;

    let style = {};
    if (scorecardWidth) {
      style['width'] = scorecardWidth;
    }

    //colorPosition = colorPosition || 'bottom';

    // In case the user defined a "values" parameter
    if (values) {


    // If not, check the user defined a "value" parameter
    } else if (value) {
      value = (value || '').toString();
      values = [
        {
          value: value || 0,
          icon: icon,
          heading: title,
          subvalue: subvalue,
          subheading: subheading,
          color: color
        }
      ];
    }

    values = values || [];

    var cardClassName = 'scorecard ' + (actions.onCardClick ? 'clickable-card ' : '');
    var cards = values.map((value, idx) => {
      let colorStyle = {};
      let cardstyle = _.extend({}, style);
      let color = value.color || '';
      let iconStyle = icon && {color};

      if (!icon || colorPosition) {
        if (!colorPosition || colorPosition === 'bottom') { colorStyle['borderColor'] = color; }
        if (colorPosition === 'left') { cardstyle['borderColor'] = color; }
      }

      return (
        <div key={idx} className={cardClassName + 'color-' + colorPosition} style={cardstyle}>
          {
            icon && <FontIcon className={className} style={iconStyle}>{icon}</FontIcon>
          }
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