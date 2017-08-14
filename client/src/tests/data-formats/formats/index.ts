import { IFormatTest } from './formats';
import bars from './bars';
import filter from './filter';
import flags from './flags';
import retention from './retention';
import scorecard from './scorecard';
import timeline from './timeline';

export const formatTests = <IDict<IFormatTest>>{ bars, filter, flags, retention, scorecard, timeline };