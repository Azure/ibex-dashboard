import * as React from 'react';
import { GenericComponent, IGenericProps, IGenericState } from '../GenericComponent';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Card, CardText } from 'react-md/lib/Cards';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import Detail from '../Detail';
import Table from '../Table';
import { ITableProps, ITableState } from '../Table/Table';
import Avatar from 'react-md/lib/Avatars';

const style = {
  lhs: {
    position: "fixed",
    width: "20%",
    height: "calc(100vh - 148px)",
    overflow: "scroll",
    borderRight: "solid 1px #eee",
  },
  rhs: {
    float: "right",
    width: "80%",
    minHeight: "calc(100vh - 148px)",
  }
}

export default class SplitPanel extends GenericComponent<ITableProps, ITableState> {

  state = {
    groups: [],
    values: [],
    selectedIndex: -1,
  };

  constructor(props: ITableProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    var { groups } = nextState;
    if (!this.state.groups && groups && groups.length > 0) {
      // automatically select first group list item
      window.requestAnimationFrame(() => {
        this.handleClick(groups[0], 0);
      });
    }
  }

  render() {
    var { props } = this.props;
    var { cols } = props;
    var { groups, values } = this.state;

    var fieldTitle = props["fieldTitle"] || props.cols[0].field;
    var fieldCount = props["fieldCount"] || props.cols[props.cols.length - 1].field;

    if (!groups) {
      return <CircularProgress key="loading" id="spinner" />;
    }

    const listItems = groups.map((group, i) => {
      let text = group[fieldTitle];
      let badge = group[fieldCount] ? <Avatar>{group[fieldCount]}</Avatar> : null;
      let active = (i === this.state.selectedIndex) ? true : false;
      return <ListItem key={i} primaryText={text} rightAvatar={badge} onClick={this.handleClick.bind(this, group, i)} active={active} />;
    });

    const table = (!values || values.length === 0) ?
      <CircularProgress key="loading" id="spinner" /> :
      <Table props={this.props.props}
        dependencies={this.props.dependencies}
        actions={this.props.actions || {}}
        title={this.props.title}
        subtitle={this.props.subtitle}
        layout={this.props.layout} />;

    return (
      <Card>
        <div style={style.lhs}>
          <List>
            {listItems}
          </List>
        </div>

        <div style={style.rhs} >
          {table}
        </div>
      </Card>
    );
  }

  handleClick(group, index) {
    this.setState({ selectedIndex: index, values: [] });
    this.trigger("select", group);
  }
}