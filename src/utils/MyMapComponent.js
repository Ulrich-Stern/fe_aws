import React, { useState } from 'react';
import { compose, withProps } from 'recompose';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} from 'react-google-maps';

const MyMapComponent = compose(
    withProps({
        googleMapURL:
            'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places',
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) => (
    <GoogleMap
        onClick={(ev) => {
            props.setStateFromChild('curLat', ev.latLng.lat());
            props.setStateFromChild('curLong', ev.latLng.lng());
            props.returnParent();

            console.log('latitide = ', ev.latLng.lat());
            console.log('longitude = ', ev.latLng.lng());
        }}
        defaultZoom={10}
        defaultCenter={{
            lat: 10.7758439,
            lng: 106.7017555,
        }}
        center={props.position}
    >
        {props.isMarkerShown && (
            <Marker
                position={{ lat: props.curLat, lng: props.curLong }}
                onClick={props.onMarkerClick}
            />
        )}
    </GoogleMap>
));

class MyFancyComponent extends React.PureComponent {
    state = {
        isMarkerShown: true,
        // init for marker
        curLat: this.props.defaultLat,
        curLong: this.props.defaultLong,
        // init for center of map
        position: {
            lat: this.props.defaultLat,
            lng: this.props.defaultLong,
        },
    };

    componentDidMount() {
        this.delayedShowMarker();
    }

    delayedShowMarker = () => {
        setTimeout(() => {
            this.setState({ isMarkerShown: true });
        }, 3000);
    };

    handleMarkerClick = () => {
        this.setState({ isMarkerShown: false });
        this.delayedShowMarker();
    };

    setStateFromChild = (id, value) => {
        let copyState = { ...this.state };
        copyState[id] = value;
        this.setState({ ...copyState }, () => {});
    };

    // get lat,long return
    returnParent = () => {
        this.props.setStateFromParent('curLat', this.state.curLat);
        this.props.setStateFromParent('curLong', this.state.curLong);
    };

    render() {
        // console.log('props.defaultLat:', this.props.defaultLat);
        // console.log('props.defaultLong:', this.props.defaultLong);
        return (
            <MyMapComponent
                isMarkerShown={this.state.isMarkerShown}
                onMarkerClick={this.handleMarkerClick}
                curLat={this.state.curLat}
                curLong={this.state.curLong}
                setStateFromChild={this.setStateFromChild}
                returnParent={this.returnParent}
                position={this.state.position}
            />
        );
    }
}
export default MyFancyComponent;
