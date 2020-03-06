var lambert2gps = require('./lambert2gps');

module.exports = {
	lambertI(x, y) {return lambert2gps(x,y,"LambertI");},
	lambertII(x, y) {return lambert2gps(x,y,"LambertII");},
	lambertIII (x, y) {return lambert2gps(x,y,"LambertIII");},
	lamberIV (x, y) {return lambert2gps(x,y,"LamberIV");},
	lambertIIExtend (x, y) {return lambert2gps(x,y,"LambertIIExtend");},
	lambert93 (x, y) {return lambert2gps(x,y,"Lambert93");}
}
