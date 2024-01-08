import Farly
import AppTrackingTransparency


enum FarlyRNError: Error {
    case runtimeError(String)
}
extension FarlyRNError: LocalizedError {
    public var errorDescription: String? {
        switch self {
        case .runtimeError(let msg):
            return msg
        }
    }
}

@objc(FarlySdk)
class FarlySdk: NSObject {
    
    @objc
    func setup(_ info: [String: Any],
               resolver resolve: @escaping RCTPromiseResolveBlock,
               rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let apiKey = info["apiKey"] as? String, let publisherId = info["publisherId"] as? String else {
            reject("ERROR", "Missing apiKey or publisherId", nil)
            return
        }
        Farly.shared.apiKey = apiKey
        Farly.shared.publisherId = publisherId
        resolve(nil)
    }
    
    @objc
    func requestAdvertisingIdAuthorization(_ resolve: @escaping RCTPromiseResolveBlock,
                                           rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        if #available(iOS 14, *) {
            ATTrackingManager.requestTrackingAuthorization { status in
                resolve(status == .authorized)
            }
        } else {
            // On earlier version the advertising identifier is available without a system popup.
            // We recommend you to implement your own.
            resolve(true)
        }
    }
    
    private func parseOfferwallRequest(_ info: [String: Any]) throws -> OfferWallRequest {
        guard let userId = info["userId"] as? String else {
            let error = "userId is mandatory in request"
            throw FarlyRNError.runtimeError(error)
        }
        let req = OfferWallRequest(userId: userId)
        req.zipCode = info["zipCode"] as? String
        req.countryCode = info["countryCode"] as? String
        req.userAge = info["userAge"] as? NSNumber
        if let gender = info["userGender"] as? String {
            switch gender {
            case "Male":
                req.userGender = .Male
            case "Female":
                req.userGender = .Female
            default:
                req.userGender = .Unknown
            }
        }
        if let userSignupDate = info["userSignupDate"] as? Double {
            req.userSignupDate = Date(timeIntervalSince1970: userSignupDate * 1000)
        }
        if let callbackParameters = info["callbackParameters"] as? [String] {
            req.callbackParameters = callbackParameters
        }
        
        return req
    }
    
    @objc
    func getHostedOfferwallUrl(_ info: [String: Any],
                               resolver resolve: @escaping RCTPromiseResolveBlock,
                               rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let request = try parseOfferwallRequest(info)
            let url = Farly.shared.getHostedOfferwallUrl(request: request)
            resolve(url?.absoluteString)
        } catch let e {
            reject("Farly", e.localizedDescription, e)
        }
    }
    
    @objc
    func showOfferwallInBrowser(_ info: [String: Any],
                                resolver resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let request = try parseOfferwallRequest(info)
            Farly.shared.showOfferwallInBrowser(request: request) { error in
                if let error = error {
                    reject("Farly", error.localizedDescription, error)
                } else {
                    resolve(nil)
                }
            }
        } catch let e {
            reject("Farly", e.localizedDescription, e)
        }
    }
    
    @objc
    func showOfferwallInWebview(_ info: [String: Any],
                                resolver resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let request = try parseOfferwallRequest(info)
            Farly.shared.showOfferwallInWebview(request: request) { error in
                if let error = error {
                    reject("Farly", error.localizedDescription, error)
                } else {
                    resolve(nil)
                }
            }
        } catch let e {
            reject("Farly", e.localizedDescription, e)
        }
    }
    
    private func toJson(_ fe: FeedElement) -> [String: Any?] {
        let result = [
            "id": fe.id,
            "name": fe.name,
            "devName": fe.devName,
            "os": fe.os,
            "status": fe.status,
            "link": fe.link,
            "icon": fe.icon,
            "priceApp": fe.priceApp,
            "moneyIcon": fe.moneyIcon,
            "moneyName": fe.moneyName,
            "rewardAmount": fe.rewardAmount,
            "smallDescription": fe.smallDescription,
            "smallDescriptionHTML": fe.smallDescriptionHTML,
            "actions": fe.actions.map({ action in
                return [
                    "id": action.id,
                    "amount": action.amount,
                    "text": action.text,
                    "html": action.html
                ] as [String: Any?]
            }),
            "totalPayout": fe.totalPayout != nil ? [
                "amount": fe.totalPayout?.amount,
                "currency": fe.totalPayout?.currency
            ] as [String: Any?] : nil,
            "categories": fe.categories
        ] as [String: Any?]
        
        return result
    }
    
    @objc
    func getOfferwall(_ info: [String: Any],
                      resolver resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let request = try parseOfferwallRequest(info)
            Farly.shared.getOfferWall(request: request) { error, offers in
                if let error = error {
                    reject("Farly", error, nil)
                } else {
                    guard let offers = offers else {
                        resolve(nil)
                        return
                    }
                    let json = offers.map(self.toJson)
                    resolve(json)
                }
            }
        } catch let e {
            reject("Farly", e.localizedDescription, e)
        }
    }
}
