This repo contains implementation of deprecated $fh APIs. They are only used by Feedhenry V2 apps and not used by FeedHenry V3 apps anymore. However, it can be added as a cordova plugin if the app want to use it.

It DOES depend on FeedHenry JS SDK. Please make sure it's loaded AFTER FeedHenry JS SDK.

NOTE: Most of the on device APIs are not implemented in this repo, e.g. $fh.geo, $fh.cam. You probably need to add the plugin in [this repo](https://github.com/fheng/fh-cordova-plugins-api) as well.