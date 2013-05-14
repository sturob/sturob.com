(function () {

  // Array.map

  function A() {
    var pos = { site: '', lat: 0, lng: 0, dir: 0 };

    function google() {
      var url = gApplication.getPageUrl();
      var b = url.split('?')[1].split('&');
      var keys = {};
      b.forEach(function(k){ 
        var tmp = k.split('=');
        keys[tmp[0]] = tmp[1];
      });
      pos.lat = keys.ll.split(',')[0];
      pos.lng = keys.ll.split(',')[1];
      pos.dir = keys.cbp.split(',')[1];
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
      bing:   'http://www.bing.com/maps/default.aspx?cp=' + a.lat + '~' + a.lng + '&lvl=19&sty=b',
      nokia:  'http://here.com/'+ a.lat + ',' + a.lng + ',18.8,15.57,68,3d.day'
    }
    window.location = sites[site];
  }


  // 
  var CYCLE = { nokia:'google', google:'bing', bing:'nokia' };

  var a = A();
  a && B(CYCLE[a.site], a);

  // https://maps.google.co.uk/?ie=UTF8&cbp=12,345.58,,0,0&ll=51.544574,-0.051724&spn=0.002415,0.01074&t=h&z=17&vpsrc=0&layer=c&cbll=51.544206,-0.051439
  // http://here.com/51.544206,-0.052367,18.8,15.57,68,3d.day        
  // http://www.bing.com/maps/default.aspx?cp=51.544206~-0.052367&lvl=19&sty=b
  // http://stackoverflow.com/questions/11104956/is-it-possible-to-pass-data-needed-for-driving-directions-to-the-bing-maps-websi
})();
