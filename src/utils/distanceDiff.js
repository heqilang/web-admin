/**
 * 转换弧度
 * @param d
 * @returns {number}
 */
function getRad(d) {
  const PI = Math.PI;
  return (d * PI) / 180.0;
}

/**
 * 根据经纬度计算两点间距离
 * @param lng1
 * @param lat1
 * @param lng2
 * @param lat2
 * @returns {number|*}
 * @constructor
 */
function CoolWPDistance(lng1, lat1, lng2, lat2) {
  const f = getRad((lat1 + lat2) / 2);
  const g = getRad((lat1 - lat2) / 2);
  const l = getRad((lng1 - lng2) / 2);
  let sg = Math.sin(g);
  let sl = Math.sin(l);
  let sf = Math.sin(f);
  let s;

  const a = 6378137.0; //The Radius of eath in meter.
  const fl = 1 / 298.257;
  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;
  s = sg * (1 - sl) + (1 - sf) * sl;
  const c = (1 - sg) * (1 - sl) + sf * sl;
  const w = Math.atan(Math.sqrt(s / c));
  const r = Math.sqrt(s * c) / w;
  const d = 2 * w * a;
  const h1 = (3 * r - 1) / 2 / c;
  const h2 = (3 * r + 1) / 2 / s;
  s = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));

  return s;
}

export default CoolWPDistance;
