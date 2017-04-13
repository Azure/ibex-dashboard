import * as React from 'react';
import { GenericComponent } from './GenericComponent';
import Menu from 'react-md/lib/Menus/Menu';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import Button from 'react-md/lib/Buttons';
import Portal from 'react-md/lib/Helpers/Portal';
import AccessibleFakeButton from 'react-md/lib/Helpers/AccessibleFakeButton';
import cn from 'classnames';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import ListItemControl from 'react-md/lib/Lists/ListItemControl';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import FontIcon from 'react-md/lib/FontIcons';

const style = {
    container: {
        position: "relative",
        backgroundColor: "cyan",
        float: "left"
    },
    list: {
        position: "absolute",
        top: "6px",
        left: "50px",
        zIndex: 17 /* NB: must be 1 higher than md-overlay */
    }
}

export default class MenuFilter extends GenericComponent<any, any> {

    state = {
        overlay: false,
        values: [],
        selectedValues: [],
        originalSelectedValues: []
    };

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.toggleOverlay = this.toggleOverlay.bind(this);
        this.hideOverlay = this.hideOverlay.bind(this);
    }

    toggleOverlay() {
        const { overlay, selectedValues } = this.state;
        this.setState({ overlay: !overlay, originalSelectedValues: selectedValues });
        if (overlay) {
            this.triggerChanges();
        }
    }

    hideOverlay() {
        this.setState({ overlay: false });
        this.triggerChanges();
    }

    triggerChanges() {
        const { selectedValues } = this.state;
        if (!this.didSelectionChange()) {
            return;
        }
        this.trigger('onChange', selectedValues);
    }

    didSelectionChange(): boolean {
        const { selectedValues, originalSelectedValues } = this.state;
        if (!selectedValues || !originalSelectedValues) {
            return false;
        }
        if (selectedValues.length !== originalSelectedValues.length
            || selectedValues.slice(0).sort().join() !== originalSelectedValues.slice(0).sort().join()) {
            return true;
        }
        return false;
    }

    onChange(newValue, checked, event) {
        var { selectedValues } = this.state;
        let newSelectedValues = selectedValues.slice(0);

        const idx = selectedValues.findIndex((x) => x === newValue);
        if (idx === -1 && checked) {
            newSelectedValues.push(newValue);
        } else if (idx > -1 && !checked) {
            newSelectedValues.splice(idx, 1);
        } else {
            console.warn("Unexpected checked filter state:", newValue, checked);
        }
        this.setState({ selectedValues: newSelectedValues });
    }

    render() {
        var { title } = this.props;
        var { selectedValues, values, overlay } = this.state;
        values = values || [];

        let listItems = values.map((value, idx) => {
            return (
                <ListItemControl
                    key={idx}
                    primaryAction={
                        <Checkbox
                            id={idx}
                            name={value}
                            label={value}
                            onChange={this.onChange.bind(null, value)}
                            checked={selectedValues.find((x) => x === value) !== undefined}
                        />
                    } />
            );
        })

        return (
            <div id="filters">
                <Button icon tooltipLabel={title} onClick={this.toggleOverlay} >more_vert</Button>

                <div style={style.container} hidden={!overlay}>
                    <List className="md-paper md-paper--1" style={style.list}>
                        {listItems}
                    </List>
                </div>

                <Portal visible={overlay} >
                    <AccessibleFakeButton
                        className="md-overlay"
                        onClick={this.hideOverlay}
                    />
                </Portal>
            </div>
        );
    }
}
