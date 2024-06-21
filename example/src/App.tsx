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
import Farly, { FeedElement, OfferWallRequest } from 'react-native-farly-sdk';

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
  const [farlyIsSetup, setFarlyIsSetup] = React.useState(false);
  const [isAdvertisingAuthorized, setIsAdvertisingAuthorized] = React.useState<
    boolean | null
  >();
  const [url, setUrl] = React.useState('');
  const [offerwallOffers, setOfferwallOffers] = React.useState<FeedElement[]>(
    []
  );

  React.useEffect(() => {
    Farly.setup({
      publisherId: '',
    }).then(() => {
      setFarlyIsSetup(true);
    });
  }, []);

  React.useEffect(() => {
    Farly.requestAdvertisingIdAuthorization().then((isAuthorized) => {
      console.log('isAuthorized', isAuthorized);
      setIsAdvertisingAuthorized(isAuthorized);
    });
  }, []);

  React.useEffect(() => {
    if (farlyIsSetup) {
      Farly.getHostedOfferwallUrl(request).then((_url) => {
        setUrl(_url ?? '');
      });
    }
  }, [farlyIsSetup]);
  React.useEffect(() => {
    if (farlyIsSetup) {
      Farly.getOfferwall(request).then((offerwall) => {
        setOfferwallOffers(offerwall);
      });
    }
  }, [farlyIsSetup]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={{ fontSize: 17 }}>
            Farly setup: {farlyIsSetup ? 'yes' : 'no'}
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
                paddingVertical: 16,
                paddingLeft: 8,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}
              onPress={() => Linking.openURL(offer.link)}
            >
              <Image
                source={{ uri: offer.icon }}
                style={{ width: 40, height: 40 }}
              />
              <View style={{ flex: 1, paddingHorizontal: 8 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold' }}>{offer.name}</Text>
                    <Text style={{ fontStyle: 'italic' }}>{offer.os}</Text>
                    <Text style={{ fontStyle: 'italic' }}>{offer.status}</Text>
                    <Text>{offer.smallDescription}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold' }}>
                      {offer.rewardAmount}
                    </Text>
                    <Text>{offer.moneyName}</Text>
                    {offer.moneyIcon && (
                      <Image
                        source={{ uri: offer.moneyIcon }}
                        style={{ width: 20, height: 20 }}
                      />
                    )}
                  </View>
                </View>
                <View>
                  {offer.actions.map((action, index) => (
                    <Text style={{ fontWeight: 'bold' }} key={action.id}>
                      {index + 1 + '. '}
                      {action.text}
                      {action.amount > 0 &&
                        ' —> ' + action.amount + ' ' + (offer.moneyName ?? '')}
                    </Text>
                  ))}
                </View>
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
