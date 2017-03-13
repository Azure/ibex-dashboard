import * as React from 'react'
import { Media } from 'react-md/lib/Media';
import { Card, CardTitle, CardMedia} from 'react-md/lib/Cards';

export default ({ children = null, title = '', subtitle = '' }) => 
  <Card>
    <CardTitle
        title={ title }
        subtitle={ subtitle } />
    <Media>
      { children }
    </Media>
  </Card>