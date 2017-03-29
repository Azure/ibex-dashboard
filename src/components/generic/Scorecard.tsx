import * as React from 'react';
import { GenericComponent } from './GenericComponent';
import { Media } from 'react-md/lib/Media';
import { Card } from 'react-md/lib/Cards';
import FontIcon from 'react-md/lib/FontIcons';

export default class Scorecard extends GenericComponent<any, any> {

  render() {
    let { value, icon, className } = this.state;
    let { title } = this.props;

    value = (value || '').toString();

    return (
      <Card>
        <Media className='md-card-scorecard'>
          <div className='md-grid md-headline'>
            { icon &&
              <div className="ms-cell md-cell--middle md-cell--2 dash-icon">
                <FontIcon className={className}>{icon}</FontIcon>
              </div>
            }
            <div className='md-cell'>{ title }</div>
            <div className='md-cell--right dash-value'>{ value }</div>
          </div>
        </Media>
      </Card>
    );
  }
}