(function () {
// ⩤ ⩥
// ⫷maphop⫸

// map⫸hop  maphop⫷

// Array.forEach

  function url2keys(url){
    var b = url.split('?')[1].split('&');
    var keys = {};
    b.forEach(function(k){ 
      var tmp = k.split('=');
      keys[tmp[0]] = tmp[1];
    });
    return keys;
  }

  function A() {
    var pos = { site: '', lat: 0, lng: 0, dir: 0 };

    function google() {
      var url = gApplication.getPageUrl();
      var keys = url2keys(url);
      pos.lat = keys.ll.split(',')[0];
      pos.lng = keys.ll.split(',')[1];
      if (keys.cbp) pos.dir = keys.cbp.split(',')[1];
      pos.site = 'google';
      return pos;
    }

    function nokia () {
      var arr = window.location.pathname.substr(1).split(',')
      pos.lat = arr[0];
      pos.lng = arr[1];
      pos.dir = arr[3];
      pos.site = 'nokia';
      return pos;
    }

    function bing () {
      pos.site = 'bing';
      pos.lat = map.get_center().latitude;
      pos.lng = map.get_center().longitude;
      return pos;
    }

    if (window.gApplication) return google();
    if (window.Microsoft) return bing();
    if (window.nokia) return nokia();
  }

  function B(site, a) {
    var sites = {
      google: 'https://maps.google.co.uk/?cbp=12,0,,0,0&ie=UTF8&vpsrc=4&layer=c&ll=' 
               + a.lat + ',' + a.lng + '&spn…=15&cbll=' + a.lat + ',' + a.lng,
      bing:   'http://www.bing.com/maps/default.aspx?cp=' + a.lat + '~' + a.lng + '&lvl=18&sty=b',
      nokia:  'http://here.com/'+ a.lat + ',' + a.lng + ',18.8,16,68,3d.day'
    }
    window.location = sites[site];
  }


  var CYCLE = { nokia:'google', google:'bing', bing:'nokia' };

  var a = A();
  a && B(CYCLE[a.site], a);
})();
