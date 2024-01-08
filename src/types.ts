export interface OfferWallRequest {
  /**
   * Your unique id for the current user
   */
  userId: string;
  /**
   * Current zipCode of the user, should be fetched from geolocation, not from geoip
   */
  zipCode?: string;
  /**
   * Current 2 letters country code of the user,
   * if not provided will default to the user's preferred region
   */
  countryCode?: string;
  /**
   * Your user's age
   */
  userAge?: number;
  /**
   * Gender of the user, to access targetted campaigns
   */
  userGender?: 'Male' | 'Female' | 'Unknown';
  /**
   * Date at which your user did signup
   */
  userSignupDate?: Date;
  /**
   * parameters you wish to get back in your callback
   */
  callbackParameters?: string[];
}

export interface Action {
  id: string;
  amount: number;
  text: string;
  html: string;
}

export interface TotalPayout {
  amount: number;
  currency: string;
}

export interface FeedElement {
  id: string;
  name: string;
  devName: string;
  os?: string;
  status?: string;
  link: string;
  icon: string;
  priceApp?: string;
  moneyIcon?: string;
  moneyName?: string;
  rewardAmount?: number;
  smallDescription: string;
  smallDescriptionHTML: string;
  actions: Action[];
  totalPayout?: TotalPayout;
  categories?: string[];
}
