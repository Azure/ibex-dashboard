import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import moment from 'moment';

import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import PersonIcon from 'material-ui/svg-icons/social/person';
import Divider from 'material-ui/Divider';

import colors from './colors';
import styles from './styles';

import UsersStore from '../../stores/UsersStore';
import commonActions from '../../actions/actions-common';

class Users extends Component {

  static getStores() {
    return [UsersStore];
  }

  static getPropsFromStores() {
    return UsersStore.getState();
  }

  median(array, key) {
    if (!array.length) {return 0};
    var numbers = array.slice(0).sort((a,b) =>a[key] - b[key]);
    var middle = Math.floor(numbers.length / 2);
    var isEven = numbers.length % 2 === 0;
    return isEven ? (numbers[middle][key] + numbers[middle - 1][key]) / 2 : numbers[middle][key];
  }

  render() {
    const { users, timespan } = this.props;

    var startDate = moment(commonActions.timespanStartDate(timespan));
    var active = users.filter(user => user.maxTimestamp.isAfter(startDate));

    var newUsers = active.filter(user => user.count === 1);
    var totalUsers = active.length;
    var countMedian = this.median(active, 'count');
    
    //if (!errorItems.length) return null;

    return (
      <Card className='dash-card dash-card-list'>
        <CardHeader
          className='card-header'
          title='Users' 
          subtitle='Active and new' />
        <CardMedia style={styles.cardMediaStyle}>
          <List className='list-compact'>
            <ListItem primaryText={`${newUsers.length} Users`} secondaryText="New users" leftIcon={<PersonIcon color={colors.PersonColor} />}/>
            <ListItem primaryText={`${totalUsers} Users`} secondaryText="Total users" leftIcon={<PersonIcon color={colors.PersonColor} />}/>
          </List>
          <Divider />
          <List className='list-compact'>
            <ListItem primaryText={`${countMedian} Users`} secondaryText="MSG/USR median" leftIcon={<PersonIcon color={colors.PersonColor} />}/>
          </List>
        </CardMedia>
      </Card>
    );
  }
}

export default connectToStores(Users);