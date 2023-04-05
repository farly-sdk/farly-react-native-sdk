# react-native-farly-sdk

Farly SDK for react-native

## Installation

```sh
yarn add react-native-farly-sdk
```

## Usage

### Initialization

```js
import Farly from 'react-native-farly-sdk';

// init once in your app
Farly.setup({
  apiKey: '',
  publisherId: '',
})

// iOS only, request tracking
Farly.requestAdvertisingIdAuthorization()
```

### Showing offers

```js
import Farly from 'react-native-farly-sdk';

// userId is mandatory, other fields are optional
const request: OfferWallRequest = {
  userId: '123', // required
  // zipCode: '75017', // optional
  // countryCode: 'FR', // optional
  // userAge: 32, // optional
  // userGender: 'Male', // optional
  // userSignupDate: new Date('2021-01-01 03:12:32'), // optional
  // callbackParameters: ['first', 'second'], // optional
};

// show the offerwall in the system browser (outside of the app)
Farly.showOfferwallInBrowser(request)

// show the offerwall in a webview inside your app
Farly.showOfferwallInWebview(request)

// get the url as a string, to open it wherever you want (for example in a custom webview you own)
const offerwalUrl = await Farly.getHostedOfferwallUrl(request)

// list offers programmatically (you are responsible to display them)
const offers = await Farly.getOfferwall(request)
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Releasing

Prefer to run manually the GH workflow `publish`

Or you can run locally `yarn release`

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
