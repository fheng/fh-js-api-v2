if(window.$fh){
  var $fh = window.$fh;
  $fh.__dest__ = $fh.__dest__ || {};

  //wp override $fh.data
  $fh.__dest__.data = function(p, s, f) {
    if(!p.key){
      f('data_nokey');
      return;
    }

    var acts = {
      "load" : function(){
        var value = window.localStorage.getItem(p.key);
        s({key: p.key, val: value});
      },
      "save" : function(){
        if (!p.val) {
          f('data_noval');
          return;
        }
        try {
          window.localStorage.setItem(p.key, p.val);
        } catch (e) {
          f('data_error', {}, p);
          return;
        }
        s();
      },
      "remove" : function(){
        window.localStorage.removeItem(p.key);
        s();
      }
    }

    acts[p.act] ? acts[p.act]() : f('data_badact', p);
  };

  
  /** **************************************************
   *  AUDIO
   *  **************************************************
   */

  $fh.__dest__MEDIA_ID = 'default';
  $fh.__dest__.audio = function (p, s, f) {
    var PhoneGap = PhoneGap || {};
    PhoneGap.mediaObjects = PhoneGap.mediaObjects || {};
    var media = PhoneGap.mediaObjects[p.id || $fh.__dest__MEDIA_ID];
    if (!media && p.path) {
      media = new Media(p.path, s, f);
      media.statusCallback = function (st) {
        media.successCallback({
          'id': media.id,
          'status': st,
          'message': 'status_changed'
        });
      }
      $fh.__dest__MEDIA_ID = media.id;
    } else if (!media && !p.path) {

      f("No audio file/path provided to instantiate player");
      return;
    }
    switch (p.act) {
    case 'play':
      media.play();
      break;
    case 'pause':
      media.pause();
      break;
    case 'stop':
      media.stop();
      break;
    case 'seek':
      media.seekTo(p.seekPosition);
      break;
    case 'getcurrentposition':
      media.getCurrentPosition(s, f);
      break;
    case 'release':
      media.release();
      break;
    case 'resume':
      media.play();
      break;
    default:
      f("Data_Act: No Action defined");
      break;
    };
  };

  /** **************************************************
   *  HANDLERS
   *  **************************************************
   */
  $fh.__dest__.handlers = function (p, s, f) {
    if (!p.type) {
      f('handlers_no_type');
      return;
    }
    var types = {
      'back': function () {
        document.addEventListener("backbutton", function () {
          s();
        }, false);
      }
    }
    types[p.type] ? types[p.type]() : f('handlers_invalid_type')
  };

  $fh.__dest__.webview = function (p, s, f) {
    if(!p.url){
      f("webview_no_url", {}, p);
      return;
    }
    var ops = {};
    if(p.url){
      ops.url = p.url;
    }
    if(p.title){
      ops.title = p.title;
    }
    if(typeof navigator.webview !== "undefined"){
      navigator.webview.open(function(){
        s();
      }, function(err){
        f(err, {}, p);
      }, ops);
    } else {
      //use cordova inappbrowser
      var ref = window.open(p.url, "_blank", 'location=no');
      ref.addEventListener('loadstop', function(){
        s();
      });
    }
  };

  //compatible with 7.0
  var openUrl = function(url){
    window.open(url, '_blank', 'location=no');
  }
}

