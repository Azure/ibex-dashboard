import * as React from 'react';
import * as PropTypes from 'prop-types';
import FontIcon from 'react-md/lib/FontIcons';
import injectTooltip from 'react-md/lib/Tooltips';

// Material icons shouldn't have any other children other than the child string and
// it gets converted into a span if the tooltip is added, so we add a container
// around the two.
const TooltipFontIcon = injectTooltip(({
  children, iconClassName, className, tooltip, forceIconFontSize, forceIconSize, style, iconStyle, ...props }) => (

  <div {...props} style={style} className={(className || '') + ' inline-rel-container'}>
    {tooltip}
    <FontIcon
      style={iconStyle}
      iconClassName={iconClassName}
      forceFontSize={forceIconFontSize}
      forceSize={forceIconSize}
    >
      {children}
    </FontIcon>
  </div>
));

TooltipFontIcon.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  tooltip: PropTypes.node,
  forceIconFontSize: PropTypes.bool,
  forceIconSize: PropTypes.number,
  style: PropTypes.object,
  iconStyle: PropTypes.object
};

export default TooltipFontIcon;