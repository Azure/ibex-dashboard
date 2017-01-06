import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import ReportProblem from 'material-ui/svg-icons/action/report-problem';
import Divider from 'material-ui/Divider';

import colors from './colors';
import styles from './styles';

import ErrorHandlers from './ErrorHandlers';
import ErrorDetails from './ErrorDetails';
import ErrorsStore from '../../stores/ErrorsStore';
import ErrorsActions from '../../actions/ErrorsActions';

class Errors extends Component {
  // static propTypes = {}
  // static defaultProps = {}

  static getStores() {
    return [ErrorsStore];
  }

  static getPropsFromStores() {
    return ErrorsStore.getState();
  }

  selectHandler(handledAt) {
    ErrorsActions.selectHandler(handledAt);
  }

  render() {
    const { handlers } = this.props;

    var errorsCount = 0;
    var errorItems = handlers.map((handledAt, idx) => {
      errorsCount += handledAt.count;
      return <ListItem 
                key={idx}
                primaryText={handledAt.count} 
                secondaryText={handledAt.name} 
                onClick={this.selectHandler.bind(this, handledAt.name)}
                leftIcon={<ReportProblem color={colors.DangerColor} />} />
    });
    
    //if (!errorItems.length) return null;

    return (
      <Card className='dash-card dash-card-list'>
        <CardHeader
          style={styles.cardHeaderStyle}
          title="Errors"
          subtitle="Click errors" />
        <CardMedia style={styles.cardMediaStyle}>
          <List className='list-compact'>
            {errorItems}
          </List>
          <Divider />
          <List className='list-compact'>
            <ListItem key={0} primaryText={errorsCount} secondaryText="Total errors" leftIcon={<ReportProblem color={colors.DangerColor} />}/>
          </List>
        </CardMedia>
        <ErrorHandlers />
        <ErrorDetails />
      </Card>
    );
  }
}

export default connectToStores(Errors);