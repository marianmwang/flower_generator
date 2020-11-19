/**
 * Converts RGB color to CIE 1931 XYZ color space.
 * https://www.image-engineering.de/library/technotes/958-how-to-convert-between-srgb-and-ciexyz
 * @param  {string} hex
 * @return {number[]}
 * 
 * source : https://stackoverflow.com/questions/15408522/rgb-to-xyz-and-lab-colours-conversion
 * explanation: http://poynton.ca/PDFs/coloureq.pdf
 */

function rgbToXyz(hex) {

    // 1) gamma transfer function (relationship between input image values and displayed intensity)
    const [r, g, b] = hexToRgb(hex).map(_ => _ / 255).map(sRGBtoLinearRGB)

    /* 2) displayed R, G, B to CIE X, Y, Z 
     * 
     * X    | Xr Xg Xb |    R
     * Y  = | Yr Yg Yb | *  G
     * Z    | Zr Zg Zb |    B
     * 
     * matrix values (Xr, Yg, etc.) are CIE values for CRT's RBG channels (not measurable in many cases -> use manufacturer's or standards)
     * In this case they "refer to a D65/2degree standard illuminent" (http://www.easyrgb.com/en/math.php)
    */
    const X =  0.4124 * r + 0.3576 * g + 0.1805 * b
    const Y =  0.2126 * r + 0.7152 * g + 0.0722 * b
    const Z =  0.0193 * r + 0.1192 * g + 0.9505 * b

    // For some reason, X, Y and Z are multiplied by 100.
    return [X, Y, Z].map(_ => _ * 100)
}

function xyzToRgb([X, Y, Z]) {

    [X,Y,Z] = [X, Y, Z].map(_ => _ / 100)

    /* 2) displayed R, G, B to CIE X, Y, Z 
     * 
     * X    | Xr Xg Xb |    R
     * Y  = | Yr Yg Yb | *  G
     * Z    | Zr Zg Zb |    B
     * 
     * matrix values (Xr, Yg, etc.) are CIE values for CRT's RBG channels (not measurable in many cases -> use manufacturer's or standards)
     * In this case they "refer to a D65/2degree standard illuminent" (http://www.easyrgb.com/en/math.php)
    */
    var var_R = X *  3.2406 + Y * -1.5372 + Z * -0.4986
    var var_G = X * -0.9689 + Y *  1.8758 + Z *  0.0415
    var var_B = X *  0.0557 + Y * -0.2040 + Z *  1.0570

    if ( var_R > 0.0031308 ) {
        var_R = 1.055 * ( Math.pow(var_R,(1 / 2.4 )) ) - 0.055;
    } else {
        var_R = 12.92 * var_R;
    }
    if ( var_G > 0.0031308 ){
        var_G = 1.055 * ( Math.pow(var_G,( 1 / 2.4 )) ) - 0.055;
    } else   {
        var_G = 12.92 * var_G;
    }                 
    if ( var_B > 0.0031308 ){
        var_B = 1.055 * ( Math.pow(var_B,( 1 / 2.4 )) ) - 0.055;
    } else {
        var_B = 12.92 * var_B;
    }                    
/* 
    sR = var_R * 255;
    sG = var_G * 255;
    sB = var_B * 255; */
    
    return [var_R, var_G, var_B];
}

/**
 * Undoes gamma-correction from an RGB-encoded color.
 * https://en.wikipedia.org/wiki/SRGB#Specification_of_the_transformation
 * https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
 * @param  {number}
 * @return {number}
 */
function sRGBtoLinearRGB(color) {
    // Send this function a decimal sRGB gamma encoded color value
    // between 0.0 and 1.0, and it returns a linearized value.
    if (color <= 0.04045) {
        return color / 12.92
    } else {
        return Math.pow((color + 0.055) / 1.055, 2.4)
    }
}

/**
 * Converts hex color to RGB.
 * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 * @param  {string} hex
 * @return {number[]} [rgb]
 */
function hexToRgb(hex) {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (match) {
        match.shift()
        return match.map(_ => parseInt(_, 16))
    }
}

/**
 * Converts CIE 1931 XYZ colors to CIE L*a*b*.
 * The conversion formula comes from <http://www.easyrgb.com/en/math.php>.
 * https://github.com/cangoektas/xyz-to-lab/blob/master/src/index.js
 * @param   {number[]} color The CIE 1931 XYZ color to convert which refers to
 *                           the D65/2° standard illuminant.
 * @returns {number[]}       The color in the CIE L*a*b* color space.
 */
// X, Y, Z of a "D65" light source.
// "D65" is a standard 6500K Daylight light source.
// https://en.wikipedia.org/wiki/Illuminant_D65
const D65 = [95.047, 100, 108.883] // Xn, Yn, Zn (dependent on white point of system)
function xyzToLab([x, y, z]) {

  /*        t^(1/3) if t > 0.008856
  * f(t) = 
  *         7.787*t + 16/116 if t <= 0.008856
  */

  // f(x), f(y), f(z)
  [x, y, z] = [x, y, z].map((v, i) => {
    v = v / D65[i]
    return v > 0.008856 ? Math.pow(v, 1 / 3) : v * 7.787 + 16 / 116
  })

  // luminance = 116(y)^(1/3)   
  const l = 116 * y - 16

  // a = 500(f(x) - f(y))
  const a = 500 * (x - y)

  // b = 200(f(y) - f(z))
  const b = 200 * (y - z)

  return [l, a, b]
}

function labToXyz([l, a, b]) {
    var var_Y = ( l + 16 ) / 116;
    var var_X = a / 500 + var_Y;
    var var_Z = var_Y - b / 200;

    if ( Math.pow(var_Y,3)  > 0.008856 ){
        var_Y = Math.pow(var_Y,3)
    } else {
        var_Y = ( var_Y - 16 / 116 ) / 7.787
    }                      
    if ( Math.pow(var_X,3)  > 0.008856 ) {
        var_X = Math.pow(var_X,3)
    } else   {
        var_X = ( var_X - 16 / 116 ) / 7.787
    }                    
    if ( Math.pow(var_Z,3)  > 0.008856 ) {
        var_Z = Math.pow(var_Z,3)
    } else   {
        var_Z = ( var_Z - 16 / 116 ) / 7.787
    }                    

    const X = var_X * D65[0]
    const Y = var_Y * D65[1]
    const Z = var_Z * D65[2]

    return [X, Y, Z];
}

// compute colour difference between two L*a*b* colour points
// formula from http://www.easyrgb.com/en/math.php and http://poynton.ca/PDFs/coloureq.pdf
function deltaELab([l1, a1, b1], [l2, a2, b2]) {

    // delta E* = [ (delta L*)^2 + (delta a*)^2 + (delta b*)^2]^(1/2)
    const delta_e = Math.sqrt( Math.pow(l1-l2, 2) + Math.pow(a1-a2, 2) + Math.pow(b1-b2, 2))

    return delta_e
}

function radToDeg(radians) {
    return radians * (180 / Math.PI)
}

function deg2Rad(degrees) {
    return degrees * Math.PI / 180
}

function main(){
    colour1 = [50, 0, -63]
    colour2 = [50, 55, -63]

    delta = deltaELab(colour1, colour2)
    //print(delta)
}
main()