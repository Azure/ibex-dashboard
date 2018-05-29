import * as React from 'react';
import injectTooltip from 'react-md/lib/Tooltips';

const Tooltip = injectTooltip<{ className?: string, children?: React.ReactNode,
                                style?: React.CSSProperties, tooltip?: React.ReactNode,
                                onClick?: (event: React.MouseEvent<HTMLElement>) => void; }>(
  ({children, className, style, tooltip, ...props }) => (
  <div {...props} className={(className || '') + ' inline-rel-container'}
       style={[style, { position: 'relative'}]}>
    {tooltip}
    {children}
  </div>
));

Tooltip.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  tooltip: React.PropTypes.node,
};

export default Tooltip;