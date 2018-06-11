import * as React from 'react';
import TextField from 'react-md/lib/TextFields';
import Dialog from 'react-md/lib/Dialogs';
import { FontIcon } from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons';

import ConfigurationStore from '../.././../../stores/ConfigurationsStore';
import ConfigurationActions from '../../../../actions/ConfigurationsActions';

interface FilterElementCreatorProps {
  visibility?: boolean;
  onHide?: () => void;
}

interface FilterValue {
  label: string;
  value: string;
}

interface FilterElementCreatorState {
  filterValues: FilterValue[];
  filterName: string;
  filterToken: string;
}

const styles = {
  areaTitleContainer: {
    height: '24px',
    backgroundColor: 'gray',
    paddingLeft: '3px',
    paddingTop: '3px'
  } as React.CSSProperties,
  filterLabelValueInputsContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  } as React.CSSProperties,
  filterValueTextField: {
    width: '40%',
  } as React.CSSProperties,
  bottomAreaContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  } as React.CSSProperties,
  saveFilterButton: {
    marginTop: '9px'
  } as React.CSSProperties
};

export default class FilterElementCreator extends React.Component<FilterElementCreatorProps,
                                                                  FilterElementCreatorState> {
  constructor(props: FilterElementCreatorProps) {
    super(props);
    
    this.addNewFilterOption = this.addNewFilterOption.bind(this);
    this.onOptionLabelChanged = this.onOptionLabelChanged.bind(this);
    this.onOptionValueChanged = this.onOptionValueChanged.bind(this);
    this.onFilterNameChanged = this.onFilterNameChanged.bind(this);
    this.onFilterTokenChanged = this.onFilterTokenChanged.bind(this);
    this.addFilterToDashboard = this.addFilterToDashboard.bind(this);

    this.state = {
      filterValues: [],
      filterName: '',
      filterToken: ''
    };
  }
  
  public render() {
    const { filterValues } = this.state;

    return (
      <div>
        <Dialog
          id="createNewFilterElement"
          visible={this.props.visibility}
          onHide={this.props.onHide}
          dialogStyle={{ width: '30%', height: '70%' }}
          title="Create new filter element"
        >
          <div style={styles.areaTitleContainer}>
            General Settings
          </div>
            <TextField
                    id="FilterName"
                    label="Name"
                    placeholder="MyFilter"
                    lineDirection="center"
                    className="md-cell md-cell--bottom"
                    onChange={this.onFilterNameChanged}
            />
            <TextField
                    id="FilterToken"
                    label="Token"
                    placeholder="MyToken"
                    lineDirection="center"
                    className="md-cell md-cell--bottom"
                    onChange={this.onFilterTokenChanged}
            />
          <div style={styles.areaTitleContainer}>
            Filter Values
          </div>
          {
            filterValues.map((filterOption, index) => 
              (
                <div style={styles.filterLabelValueInputsContainer}>
                  <TextField
                    id="filterLabel"
                    label="Label"
                    placeholder="Place your label here"
                    style={styles.filterValueTextField}
                    onChange={(value: string) => this.onOptionLabelChanged(value, index)}
                  />
                  {/* <TextField
                    id="filterValue"
                    label="Value"
                    placeholder="Place your value here"
                    style={styles.filterValueTextField}
                    onChange={(value: string) => this.onOptionValueChanged(value, index)}
                  /> */}
                </div>
              )
            )
          }

          <div style={styles.bottomAreaContainer}>
            <a onClick={this.addNewFilterOption} href="#">
              <FontIcon style={{ fontSize: '20px',
                                fontWeight: 'bold',
                                marginTop: '15px' }}>
                add
              </FontIcon>
            </a>

            <Button primary style={styles.saveFilterButton} onClick={this.addFilterToDashboard}>
              Add Filter
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }

  private addNewFilterOption() {
    let newFilterOptions = this.state.filterValues;
    newFilterOptions.push({
      label: '',
      value: ''
    });

    this.setState({ filterValues: newFilterOptions });
  }

  private onOptionLabelChanged(value: string, index: number) {
    let newFilterOptions = this.state.filterValues;
    newFilterOptions[index].label = value;

    this.setState({ filterValues: newFilterOptions });
  }

  private onOptionValueChanged(value: string, index: number) {
    let newFilterOptions = this.state.filterValues;
    newFilterOptions[index].value = value;

    this.setState({ filterValues: newFilterOptions });
  }

  private onFilterNameChanged(newName: string) {
    this.setState({ filterName: newName });
  }

  private onFilterTokenChanged(newToken: string) {
    this.setState({ filterToken: newToken });
  }

  private addFilterToDashboard() {
    // 1. Get dashboard from store
    let configurationState = ConfigurationStore.getState();
    let currentDashboard = configurationState.dashboard ? 
                              configurationState.dashboard :
                              configurationState.dashboards[0];

    // 2. Get all required values for filter
    const { filterName, filterToken, filterValues } = this.state;

    // 2. Create a datasource for the new filter
    let newFilterDataSource: ConstantDataSource = {
      id: filterToken,
      type: 'Constant',
      params: {
        values: filterValues.map(option => option.label),
        selectedValue: filterValues[0].label
      },
      format: 'flags'
    };

    // 3. Create a filter element with a source of #2
    let newFilterElement: IFilter = {
      type: 'TextFilter',
      title: filterName,
      source: filterToken,
      actions: { onChange: filterToken + ':updateSelectedValue' },
      first: true
    };

    // 4. Update the dashboard 
    currentDashboard.dataSources.push(newFilterDataSource);
    currentDashboard.filters.push(newFilterElement);

    ConfigurationActions.saveConfiguration(currentDashboard);

    // if (this.props.onHide) {
    //   this.props.onHide();
    // } 
  }
}