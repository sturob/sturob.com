(function () {
// ⩤ ⩥
// ⫷maphop⫸

  if (! [].forEach) {
    alert('browser not supported')
    return;
  }

  function url2keys(url){
    var b = url.split('?')[1].split('&');
    var keys = {};
    b.forEach(function(k){ 
      var tmp = k.split('=');
      keys[tmp[0]] = tmp[1];
    });
    return keys;
  }

  var pos = { site: '', lat: 0, lng: 0, dir: 0 };

  function A() {
    function google() { 
    // // _.VV.lat
    // window.location.hash.split('!').splice(5, 2).map(function(n){ return n.substr(2) }) -> [ lat, lng ]
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
      pos.dir = map.get_heading() ? map.get_heading() : 0;
      return pos;
    }

    if (window.gApplication) return google();
    if (window.Microsoft) return bing();
    if (window.nokia) return nokia();
  }

  function B(site, a) {
    if (site == 'bing') {
      var offset = a.dir % 90;   
      if (offset < 45) {           // 220 % 90 -> 40
        a.dir = a.dir - offset;
      } else {                     // 230 % 90 -> 50
        a.dir = a.dir - 0 + (90 - offset);
      }
    }

    if (site == 'google' && a.dir == 0) {
      dir = 0.1;
    }
    var sites = {
      google: 'http://maps.google.com/?cbp=11,' + a.dir + ',,0,-10&layer=c&ie=UTF8&vpsrc=4&layer=c&ll=' 
               + a.lat + ',' + a.lng + '&t=h&z=17&spn…=15&cbll=' + a.lat + ',' + a.lng,
      bing:   'http://www.bing.com/maps/default.aspx?cp=' + a.lat + '~' + a.lng + '&lvl=18&sty=b&dir=' + a.dir,
      nokia:  'http://here.com/'+ a.lat + ',' + a.lng + ',18,' + a.dir + ',65,3d.day' // 0->65
    }
    return sites[site];
  }

  if (window.gumtree) {
    if (! gumtree.state.vip_mapLarge) {
      alert('load large map first')
      return;
    }
    pos.lng = gumtree.state.vip_mapLarge.lon;
    pos.lat = gumtree.state.vip_mapLarge.lat;
    window.location = B('bing', pos);
  }

  var CYCLE = { nokia:'google', google:'bing', bing:'nokia' };

  var a = A();
  if (! a) {
    console.log('hindenburg: unsupported site')
    return;
  }

  var b = B(CYCLE[a.site], a);
  if (b) window.location = b;
})();
