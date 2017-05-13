import * as React from 'react';
import { GenericComponent, IGenericProps, IGenericState } from './GenericComponent';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AreaChart, Area as AreaFill, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Tooltip, ResponsiveContainer, Legend, defs } from 'recharts';
import Card from '../CardMap';
import { render } from 'react-dom';
import * as L from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import DivIcon from 'react-leaflet-div-icon';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { EsriProvider } from 'leaflet-geosearch';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';

const styles = {
  map: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  center: {
    width: '50px',
    height: '50px',
    position: 'relative',
    top: 'calc(50% - 80px)',
    left: 'calc(50% - 25px)',
  },
  spinner: {
    margin: 0,
    padding: 0,
  }
};

const provider = new EsriProvider(); // does the search from address to lng and lat 

interface IMapDataProps extends IGenericProps {
  mapProps: any;
  props: {
    searchLocations: boolean;
  }
};

interface IMapDataState extends IGenericState {
  markers: Object[];
  locations: any[];
}

export default class MapData extends GenericComponent<IMapDataProps, IMapDataState> {

  static defaultProps = {
    center: [34.704929, -25.210251],
    zoom: 1.4,
    maxZoom: 8,
  };

  state = {
    markers: [],
    locations: [],
  };

  constructor(props: IMapDataProps) {
    super(props);
  }

  componentWillMount() {
    L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.0.2/dist/images/';
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    if (_.isEqual(this.state.locations, nextState.locations) &&
        _.isEqual(this.state.markers, nextState.markers)) {
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    const { searchLocations } = this.props.props;
    const { locations } = this.state;

    if (!locations || !locations.length) { return; }

    if (!searchLocations) {
      this.setState({ markers: locations });
      return;
    }

    let promises = [];
    let markers = [];
    locations.forEach(loc => {
      const { location, location_count } = loc;
      if (location_count === 0) {
        return;
      }

      let promise = provider.search({ query: location });
      promises.push(promise);
      promise.then(results => {
        const popup = location + ' ' + location_count;
        markers.push({ lat: results[0].y, lng: results[0].x, popup: popup });
      });
    });

    Promise.all(promises).then(() => {
      let oldMarkers = this.state.markers;
      markers = markers.sort((a, b) =>
        a.lat > b.lat ? 1 :
          a.lat < b.lat ? -1 :
            a.lng > b.lng ? 1 :
              a.lng < b.lng ? -1 : 0);
      if (!_.isEqual(oldMarkers, markers)) {
        this.setState({ markers });
      }
    });
  }

  render() {
    const { markers } = this.state;
    const { title, subtitle, props, mapProps } = this.props;

    if (!markers) {
      return null;
    }

    if (markers.length === 0) {
      return (
        <Card title={title} subtitle={subtitle}>
          <div style={styles.wrapper}>
            <div style={styles.center}>
              <CircularProgress key="loading" id="spinner" style={styles.spinner} />
            </div>
          </div>
        </Card>
      );
    }

    const mapProperties = { ...MapData.defaultProps, ...mapProps };

    return (
      <Card title={title} subtitle={subtitle}>
        <Map
          className="markercluster-map"
          style={styles.map}
          {...mapProperties}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          <MarkerClusterGroup
            markers={markers}
            options={{
              maxClusterRadius: 10,
            }}
            wrapperOptions={{ enableDefaultStyle: true }}
          />
        </Map>
      </Card>
    );
  }
}