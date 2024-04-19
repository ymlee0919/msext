
/**
 * converts pixel coordinates to geo
 * @param pixPos coordinate in pixel
 * @param pixMin minimum pix coordinate
 * @param pixMax maximum pix coordinate
 * @param geoMin minimum geo coordinate
 * @param geoMax maximum geo coordinate
 */
function pix2Geo(pixPos, pixMin, pixMax, geoMin, geoMax) {
  return geoMin + (pixPos - pixMin) * (geoMax - geoMin) / (pixMax - pixMin);
};

/**
 * converts geo coordinates to pix
 * @param geoPos coordinate in geo
 * @param pixMin minimum pix coordinate
 * @param pixMax maximum pix coordinate
 * @param geoMin minimum geo coordinate
 * @param geoMax maximum geo coordinate
 */
function geo2Pix(geoPos, geoMin, geoMax, pixMin, pixMax) {
  return pixMin + (geoPos - geoMin) * (pixMax - pixMin) / (geoMax - geoMin);
};