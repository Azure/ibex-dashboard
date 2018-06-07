import * as React from 'react';
import { Media } from 'react-md/lib/Media';
import { Card as MDCard, CardTitle } from 'react-md/lib/Cards';
import { DropdownMenu } from 'react-md/lib/Menus';
import { ListItem } from 'react-md/lib/Lists';
import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';

import TooltipFontIcon from '../Tooltip/TooltipFontIcon';
import { Settings, SettingsActions } from './Settings';
import { SpinnerActions } from '../Spinner';
import ConfigurationsStore from '../../stores/ConfigurationsStore';
import configurationsStore from '../../stores/ConfigurationsStore';
import configurationsActions from '../../actions/ConfigurationsActions';

const styles = {
  noTitle: {
    margin: 0,
    padding: 0,
    background: 'transparent',
  } as React.CSSProperties,
  noTitleContent: {
    margin: 0,
    padding: 0,
  } as React.CSSProperties
};

interface ICardProps {
  id?: string;
  title?: string;
  subtitle?: string;
  widgets?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  hideTitle?: boolean;
}

interface ICardState {
  hover: boolean;
  askDeleteElement: boolean;
}

export default class Card extends React.PureComponent<ICardProps, ICardState> { 

  static defaultProps = {
    hideTitle: false,
  };

  state = {
    hover: false,
    askDeleteElement: false
  };

  constructor(props: ICardProps) {
    super(props);

    this.showAskToDeleteCard = this.showAskToDeleteCard.bind(this);
    this.hideAskToDeleteCard = this.hideAskToDeleteCard.bind(this);
  }

  render() {
    const { id, title, subtitle, children, className, style, titleStyle, contentStyle, hideTitle } = this.props;
    const { hover, askDeleteElement } = this.state;

    let elements: React.ReactNode[] = [];
    if (title && !hideTitle) {
      elements.push(
        <span key={0}>{title}</span>
      );
    }
    if (subtitle) {
      elements.push(
        <TooltipFontIcon
          key={1}
          tooltipLabel={subtitle}
          tooltipPosition="top"
          forceIconFontSize={true}
          forceIconSize={16}
          className="card-icon"
        >
          info
        </TooltipFontIcon>
      );
    }
    if (hover) {
      elements.push( this.renderWidgets() );
    }

    // NB: Fix for Card scroll content when no title
    let cardTitleStyle = titleStyle || {};
    let cardContentStyle = contentStyle || {};
    if (hideTitle) {
      Object.assign(cardTitleStyle, styles.noTitle);
      Object.assign(cardContentStyle, styles.noTitleContent);
    }

    const askDeleteElementDialog = (
      <Dialog
          id="deleteElement"
          visible={askDeleteElement}
          title="Are you sure?"
          aria-labelledby="deleteElement"
          modal
          actions={[
            { onClick: () => this.onCardDeletePressed(id), primary: false, label: 'Permanently Delete', },
            { onClick: this.hideAskToDeleteCard, primary: true, label: 'Cancel' }
          ]}
        >
          <p id="deleteDashboardDescription" className="md-color--secondary-text">
            Do you want to delete this element?
          </p>
        </Dialog>
    );
    
    return (
      <MDCard 
        onMouseOver={() => this.setState({ hover: true })} 
        onMouseLeave={() => this.setState({ hover: false })}
        className={className}
        style={style}>
        <CardTitle title="" subtitle={elements} style={cardTitleStyle} /> 
        <Media style={cardContentStyle}>
          {children}
          {askDeleteElementDialog}
        </Media>
      </MDCard>
    );
  }

  renderWidgets() {
    const { id, title, widgets } = this.props;

    const settingsButton = (
      <Button
        icon
        key="settings"
        onClick={() => SettingsActions.openDialog(title, id)}
        className="card-settings-btn"
      >
        expand_more
      </Button>
    );

    const settingsButtonWithMenu = (
      <div style={{ zIndex: 2147483647 }}>
        <DropdownMenu
          menuItems={[(<ListItem primaryText="Edit Query"
                                onClick={() => SettingsActions.openDialog(title, id)} />),
                      (<ListItem primaryText="Delete" onClick={this.showAskToDeleteCard} />)]}
          anchor={{
            x: DropdownMenu.HorizontalAnchors.LEFT,
            y: DropdownMenu.VerticalAnchors.CENTER,
          }}
          position={DropdownMenu.Positions.TOP_RIGHT}
          sameWidth
          cascadingZDepth={100}
        >
          <Button
            icon
            key="settings"
            className="card-settings-btn"
          >
            expand_more
          </Button>
        </DropdownMenu>
      </div>
    );

    return !widgets ? (
      <div style={{ zIndex: 2147483647 }}>
        <div className="card-settings" key="widgets">
          {settingsButtonWithMenu}
        </div>
      </div> 
    ) : (
      <div className="card-settings" key="widgets">
        <span>{widgets}</span>
        <span>{settingsButton}</span>
      </div>
    );
  }
  
  private showAskToDeleteCard() {
    this.setState({ askDeleteElement: true });
  }

  private hideAskToDeleteCard() {
    this.setState({ askDeleteElement: false });
  }

  private onCardDeletePressed(id: string) {
    // Given 'id' is in template 'elementId@elementIndex'
    // We need to extract the element id
    let elementId = id.substr(0, id.search('@'));

    let state = ConfigurationsStore.getState();
    let currentDashboard = state.dashboard;

    // Find this card's element
    let filteredElement = currentDashboard.elements.filter(element => element.id !== elementId);
    currentDashboard.elements = filteredElement;

    configurationsActions.saveConfiguration(currentDashboard);
  }
}