import React, { useState, useEffect } from 'react'
import { Modal, View, SafeAreaView } from 'react-native'
import PropTypes from 'prop-types'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import MapView, { Marker } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'
import Geocoder from 'react-native-geocoding'
import TextButton from 'react-native-button'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'

const locationDelta = { latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
Geocoder.init('AIzaSyBI8oXdc-lbtvRxuVstY6eXG5G9FNCT4fU')
const googleApiKey = 'AIzaSyBI8oXdc-lbtvRxuVstY6eXG5G9FNCT4fU'

function IMLocationSelectorModal(props) {
  const { onCancel, isVisible, onChangeLocation, onDone } = props
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const [region, setRegion] = useState({
    latitude: 36.778259,
    longitude: -119.417931,
  })
  const [address, setAddress] = useState({})
  const [addresses, setAddresses] = useState([])

  useEffect(() => {
    getCurrentPosition()
  }, [])

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        setRegion(position.coords)
        onLocationChange(position.coords)
      },
      error => {
        alert(error.message)
      },
    )
  }

  const onLocationChange = location => {
    Geocoder.from(location.latitude, location.longitude)
      .then(json => {
        const choosenIndex = Math.floor(json.results.length / 2)
        const address_components = json.results[choosenIndex].address_components
        const formatted_address = json.results[choosenIndex].formatted_address

        const addresses = getAddresses(json.results)

        setAddress({ address_components, formatted_address })
        setAddresses(addresses)
        onChangeLocation(address_components, addresses)
      })
      .catch(error => {
        console.log(error)
        setAddress('')
      })
  }

  const getAddresses = addresses => {
    const newAddreses = []
    addresses.slice(-8).forEach((address, index) => {
      newAddreses.push({
        address_components: address.address_components,
        formatted_address: address.formatted_address,
      })
    })

    return newAddreses
  }

  const setLocationDetails = (data, details) => {
    const { geometry, name } = details
    const address_components = {
      address_components: [{ long_name: data.structured_formatting.main_text }],
      formatted_address: details.formatted_address,
    }
    setAddress(address_components)
    onChangeLocation(address_components)
    if (geometry) {
      setRegion({
        longitude: geometry.location.lng,
        latitude: geometry.location.lat,
      })
    }

    if (name) {
      setAddress(name)
      onChangeLocation(name)
    }
  }

  const onMapMarkerDragEnd = location => {
    const region = location.nativeEvent.coordinate
    setRegion(region)
    onLocationChange(region)
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onCancel}>
      <SafeAreaView style={styles.container}>
        <View style={styles.navBarContainer}>
          <View style={styles.leftButtonContainer}>
            <TextButton style={styles.buttonText} onPress={onCancel}>
              Cancel
            </TextButton>
          </View>
          <View style={styles.navBarTitleContainer} />

          <View style={styles.rightButtonContainer}>
            <TextButton
              style={styles.buttonText}
              onPress={() => onDone(address, addresses)}>
              Done
            </TextButton>
          </View>
        </View>
        <GooglePlacesAutocomplete
          placeholder={'Enter location address'}
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
          listViewDisplayed="auto" // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => setLocationDetails(data, details)}
          getDefaultValue={() => ''}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: googleApiKey,
            language: 'en',
          }}
          styles={{
            container: styles.placesAutocompleteContainer,
            textInputContainer: styles.placesAutocompleteTextInputContainer,
            textInput: styles.placesAutocompleteTextInput,
            description: styles.placesAutocompletedDescription,
            predefinedPlacesDescription: styles.predefinedPlacesDescription,
            poweredContainer: styles.predefinedPlacesPoweredContainer,
          }}
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={
            {
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }
          }
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
          }}
          GooglePlacesDetailsQuery={{
            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
            fields: 'formatted_address',
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />
        <MapView
          style={styles.mapContainer}
          region={{
            ...region,
            ...locationDelta,
          }}>
          <Marker
            draggable={true}
            onDragEnd={onMapMarkerDragEnd}
            coordinate={region}
          />
        </MapView>
      </SafeAreaView>
    </Modal>
  )
}

IMLocationSelectorModal.propTypes = {
  isVisible: PropTypes.bool,
  onCancel: PropTypes.func,
  onDone: PropTypes.func,
  onChangeLocation: PropTypes.func,
}

export default IMLocationSelectorModal
