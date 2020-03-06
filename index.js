exports.lambert2gps = function(x, y, lambert) {
      lamberts = {
       "LambertI" : 0,
       "LambertII" : 1,
       "LambertIII": 2,
       "LamberIV": 3,
       "LambertIIExtend": 4,
       "Lambert93": 5
      };
      index = lamberts[lambert];
      ntabs =  [0.7604059656, 0.7289686274, 0.6959127966, 0.6712679322, 0.7289686274, 0.7256077650];
      ctabs =  [11603796.98, 11745793.39, 11947992.52, 12136281.99, 11745793.39, 11754255.426];
      Xstabs = [600000.0, 600000.0, 600000.0, 234.358, 600000.0, 700000.0];
      Ystabs = [5657616.674, 6199695.768, 6791905.085, 7239161.542, 8199695.768, 12655612.050];

      n  = ntabs [index];
      c  = ctabs [index];            // in meters
      Xs = Xstabs[index];          // in meters
      Ys = Ystabs[index];          // in meters
      l0 = 0.0;                    // corresponds to the longitude in radian of Paris (2 ° 20'14.025 "E) compared to Greenwich
      e = 0.08248325676;           //e of NTF (we change it afterwards to switch to WGS)
      eps = 0.00001;     // precision


      /***********************************************************
      *  coordinates in the Lambert 2 projection to convert *
      ************************************************************/
      X = x;
      Y = y;

      /*
       * Conversion of Lambert 2 -> NTF geographic : ALG0004
       */
        R = Math.sqrt(((X - Xs) * (X - Xs)) + ((Y - Ys) * (Y - Ys)));
        g = Math.atan((X - Xs) / (Ys - Y));

        l = l0 + (g / n);
        L = -(1 / n) * Math.log(Math.abs(R / c));


        phi0 = 2 * Math.atan(Math.exp(L)) - (Math.PI / 2.0);
        phiprec = phi0;
        phii = 2 * Math.atan((Math.pow(((1 + e * Math.sin(phiprec)) / (1 - e * Math.sin(phiprec))), e / 2.0) * Math.exp(L))) - (Math.PI / 2.0);

        while (!(Math.abs(phii - phiprec) < eps)) {
                phiprec = phii;
                phii = 2 * Math.atan((Math.pow(((1 + e * Math.sin(phiprec)) / (1 - e * Math.sin(phiprec))), e / 2.0) * Math.exp(L))) - (Math.PI / 2.0);
        }

        phi = phii;

    /*
     * Conversion of NTF geographique -> NTF cartesien : ALG0009
     */
    a = 6378249.2;
    h = 100;         // En mètres

    N = a / (Math.pow((1 - (e * e) * (Math.sin(phi) * Math.sin(phi))), 0.5));
    X_cart = (N + h) * Math.cos(phi) * Math.cos(l);
    Y_cart = (N + h) * Math.cos(phi) * Math.sin(l);
    Z_cart = ((N * (1 - (e * e))) + h) * Math.sin(phi);

    /*
     * Conversion of NTF cartesien -> WGS84 cartesien : ALG0013
     */

    // Il s'agit d'une simple translation
    XWGS84 = X_cart - 168;
    YWGS84 = Y_cart - 60;
    ZWGS84 = Z_cart + 320;


    /*
     * Conversion WGS84 cartesien -> WGS84 geographique : ALG0012
     */
    
    l840 = 0.04079234433;    // 0.04079234433 go to Greenwich meridian, otherwise put 0
    
    e = 0.08181919106;              // We change e to put it in WGS84 instead of NTF
    a = 6378137.0;

    P = Math.sqrt((XWGS84 * XWGS84) + (YWGS84 * YWGS84));

    l84 = l840 + Math.atan(YWGS84 / XWGS84);

    phi840 = Math.atan(ZWGS84 / (P * (1 - ((a * e * e))
                                / Math.sqrt((XWGS84 * XWGS84) + (YWGS84 * YWGS84) + (ZWGS84 * ZWGS84)))));

    phi84prec = phi840;

    phi84i = Math.atan((ZWGS84 / P) / (1 - ((a * e * e * Math.cos(phi84prec))
            / (P * Math.sqrt(1 - e * e * (Math.sin(phi84prec) * Math.sin(phi84prec)))))));

    while (!(Math.abs(phi84i - phi84prec) < eps))
    {
        phi84prec = phi84i;
        phi84i = Math.atan((ZWGS84 / P) / (1 - ((a * e * e * Math.cos(phi84prec))
                / (P * Math.sqrt(1 - ((e * e) * (Math.sin(phi84prec) * Math.sin(phi84prec))))))));

    }

    phi84 = phi84i;

    return [phi84 * 180.0 / Math.PI, l84 * 180.0 / Math.PI];
}