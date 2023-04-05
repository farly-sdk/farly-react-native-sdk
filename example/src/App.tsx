/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

import {
  Button,
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Farly from 'react-native-farly-sdk';
import type { FeedElement, OfferWallRequest } from 'src/types';

const request: OfferWallRequest = {
  userId: '123',
  // zipCode: '75017',
  // countryCode: 'FR',
  // userAge: 32,
  // userGender: 'Male',
  // userSignupDate: new Date('2021-01-01 03:12:32'),
  // callbackParameters: ['first', 'second'],
};

export default function App() {
  const [farlySetup, setFarlySetup] = React.useState(false);
  const [isAdvertisingAuthorized, setIsAdvertisingAuthorized] = React.useState<
    boolean | null
  >();
  const [url, setUrl] = React.useState('');
  const [offerwallOffers, setOfferwallOffers] = React.useState<FeedElement[]>(
    []
  );

  React.useEffect(() => {
    Farly.setup({
      apiKey: '',
      publisherId: '',
    }).then(() => {
      console.log('FarlySdk did setup');
      setFarlySetup(true);
    });
  }, []);

  React.useEffect(() => {
    Farly.requestAdvertisingIdAuthorization().then((isAuthorized) => {
      console.log('isAuthorized', isAuthorized);
      setIsAdvertisingAuthorized(isAuthorized);
    });
  }, []);

  React.useEffect(() => {
    if (farlySetup) {
      Farly.getHostedOfferwallUrl(request).then((_url) => {
        setUrl(_url ?? '');
      });
    }
  }, [farlySetup]);
  React.useEffect(() => {
    if (farlySetup) {
      Farly.getOfferwall(request).then((offerwall) => {
        setOfferwallOffers(offerwall);
      });
    }
  }, [farlySetup]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={{ fontSize: 17 }}>
            Farly setup: {farlySetup ? 'yes' : 'no'}
          </Text>
          {Platform.OS === 'ios' && (
            <Text style={{ fontSize: 17 }}>
              Advertising ID authorized:{' '}
              {isAdvertisingAuthorized ? 'yes' : 'no'}
            </Text>
          )}
          <View style={{ paddingVertical: 32 }}>
            <Button
              title="Show offerwall in browser"
              onPress={() => Farly.showOfferwallInBrowser(request)}
            />
          </View>
          <View style={{ paddingBottom: 32 }}>
            <Button
              title="Show offerwall in webview"
              onPress={() => Farly.showOfferwallInWebview(request)}
            />
          </View>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              paddingHorizontal: 8,
            }}
          >
            URL to open in browser or webview
          </Text>
          <Text style={{ paddingTop: 8 }} selectable>
            {url}
          </Text>
        </View>
        <View style={{ paddingTop: 32 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              paddingHorizontal: 8,
            }}
          >
            {offerwallOffers.length} offers fetched programatically
          </Text>
          {offerwallOffers.map((offer) => (
            <Pressable
              key={offer.id}
              style={{
                flexDirection: 'row',
                paddingVertical: 4,
                borderBottomWidth: 1,
              }}
              onPress={() => Linking.openURL(offer.link)}
            >
              <Image
                source={{ uri: offer.icon }}
                style={{ width: 40, height: 40 }}
              />
              <View style={{ flex: 1, paddingHorizontal: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>{offer.name}</Text>
                <Text>{offer.smallDescription}</Text>
                <Text style={{ fontWeight: 'bold' }}>
                  {offer.actions[0]?.text}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
