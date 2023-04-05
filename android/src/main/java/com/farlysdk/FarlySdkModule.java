package com.farlysdk;

import static com.farly.farly.Farly.*;

import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;
import com.farly.farly.Farly;
import com.farly.farly.jsonmodel.Action;
import com.farly.farly.jsonmodel.FeedItem;
import com.farly.farly.model.Gender;
import com.farly.farly.model.OfferWallRequest;
import com.farly.farly.model.OfferWallRequestBuilder;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@ReactModule(name = FarlySdkModule.NAME)
public class FarlySdkModule extends ReactContextBaseJavaModule {
  public static final String NAME = "FarlySdk";

  public FarlySdkModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void setup(ReadableMap info, Promise promise) {
    getInstance().setApiKey(info.getString("apiKey"));
    getInstance().setPublisherId(info.getString("publisherId"));
    promise.resolve(null);
  }

  private OfferWallRequest parseOfferwallRequest(ReadableMap info) throws Exception {
    String userId = info.getString("userId");
    if (userId == null || TextUtils.isEmpty(userId)) {
      throw new Exception("User id is mandatory");
    }

    Gender userGender = null;
    String userGenderRaw = info.getString("userGender");
    if ("Male".equals(userGenderRaw)) {
      userGender = Gender.MALE;
    } else if ("Female".equals(userGenderRaw)) {
      userGender = Gender.FEMALE;
    }

    Date userSignupDate = null;
    if (info.hasKey("userSignupDate")) {
      double userSignupDateInMs = info.getDouble("userSignupDate");
      userSignupDate = new Date((long) userSignupDateInMs);
    }

    ReadableArray callbackParametersRaw = info.getArray("callbackParameters");
    String[] cps = new String[callbackParametersRaw == null ? 0 : callbackParametersRaw.size()];
    if (callbackParametersRaw != null) {
      for (int i = 0; i < callbackParametersRaw.size(); i++) {
        cps[i] = callbackParametersRaw.getString(i);
      }
    }
    return new OfferWallRequestBuilder()
      .setUserId(userId)
      .setZipCode(info.getString("zipCode"))
      .setCountryCode(info.getString("countryCode"))
      .setUserAge(info.hasKey("userAge") ? info.getInt("userAge") : null)
      .setUserGender(userGender)
      .setUserSignupDate(userSignupDate)
      .setCallbackParameters(cps)
      .build();
  }

  @ReactMethod
  public void getHostedOfferwallUrl(ReadableMap info, Promise promise) {
    try {
      OfferWallRequest request = parseOfferwallRequest(info);
      String url = getInstance().getHostedOfferWallUrl(getReactApplicationContext(), request);
      promise.resolve(url);
    } catch (Exception e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void showOfferwallInBrowser(ReadableMap info, Promise promise) {
    try {
      OfferWallRequest request = parseOfferwallRequest(info);
      getInstance().showOfferWall(getCurrentActivity(), request, OfferWallPresentationMode.BROWSER);
      promise.resolve(null);
    } catch (Exception e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void showOfferwallInWebview(ReadableMap info, Promise promise) {
    try {
      OfferWallRequest request = parseOfferwallRequest(info);
      getInstance().showOfferWall(getCurrentActivity(), request, OfferWallPresentationMode.WEB_VIEW);
      promise.resolve(null);
    } catch (Exception e) {
      promise.reject(e);
    }
  }

  private WritableMap feedItemToMap(FeedItem feedItem) {
    WritableMap map = new WritableNativeMap();
    map.putString("id", feedItem.getId());
    map.putString("name", feedItem.getName());
    map.putString("devName", feedItem.getDevName());
    map.putString("link", feedItem.getLink());
    map.putString("icon", feedItem.getIcon());
    map.putString("smallDescription", feedItem.getSmallDescription());
    map.putString("smallDescriptionHTML", feedItem.getSmallDescriptionHTML());
    WritableArray actions = new WritableNativeArray();
    for (Action action : feedItem.getActions()) {
      WritableMap actionMap = new WritableNativeMap();
      actionMap.putString("id", action.getId());
      actionMap.putDouble("amount", action.getAmount());
      actionMap.putString("text", action.getText());
      actionMap.putString("html", action.getHtml());
      actions.pushMap(actionMap);
    }
    map.putArray("actions", actions);
    return map;
  }

  @ReactMethod
  public void getOfferwall(ReadableMap info, Promise promise) {
    try {
      OfferWallRequest request = parseOfferwallRequest(info);
      getInstance().getOfferWall(getReactApplicationContext(), request, new OfferWallRequestCompletionHandler() {
        @Override
        public void onComplete(List<FeedItem> feed) {
          WritableArray results = new WritableNativeArray();
          for (FeedItem feedItem : feed) {
            results.pushMap(feedItemToMap(feedItem));
          }
          promise.resolve(results);
        }

        @Override
        public void onError(Exception e) {
          promise.reject(e);
        }
      });
    } catch (Exception e) {
      promise.reject(e);
    }
  }
}
