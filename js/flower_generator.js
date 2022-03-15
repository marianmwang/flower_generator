// taken from https://github.com/macklab/macklab.github.io/blob/master/flowers/js/flower_generator.js

paper.view.viewSize.width = 400;
paper.view.viewSize.height = 400;
paper.view.autoUpdate = true;

//context = canvas.getContext('2d');
window.globals = {};
//var scope = this;

function drawFlower1(petalColor, petalShape, ringShape) {
  //scope.activate();
  project.activeLayer.removeChildren();

  var xoff = 200;
  var yoff = 200;

  circleColor = 4.5;
  petal_shape_max = 2;

  // calculate color
  //alert(petalColor);
  var a_val = 80 * Math.cos((petalColor * Math.PI) / 180);
  var b_val = 80 * Math.sin((petalColor * Math.PI) / 180);
  var l_val = 60;
  //alert([l_val, a_val, b_val])
  var rgb_color = xyzToRgb(labToXyz([l_val, a_val, b_val]));
  //alert(rgb_color);

  // green leaves
  nleaves = 50;
  for (var x = 0; x < nleaves; x++) {
    var ang = x * (360 / nleaves) + (6 * Math.random() - 3);
    var cx = xoff + 50 * Math.cos((ang * Math.PI) / 180);
    var cy = yoff + 50 * Math.sin((ang * Math.PI) / 180);
    var leaf = new Path.Ellipse({
      center: [cx, cy],
      size: [90, 8],
      fillColor: "green",
      rotation: ang,
    });
    leaf.flatten(5);
  }

  colorRatio = petalColor / 11;
  pcolor = 325 + colorRatio * 12;
  petalRatio = petalShape / 2;
  npetals = Math.round(5 + petalRatio * 10);
  petalSize1 = [100, 30 - 15 * petalRatio];
  petalSize2 = [75, 15 - 7 * petalRatio];
  // larger petals
  for (var x = 0; x < npetals; x++) {
    var ang = x * (360 / npetals) + (6 * Math.random() - 3);
    var cx = xoff + 50 * Math.cos((ang * Math.PI) / 180);
    var cy = yoff + 50 * Math.sin((ang * Math.PI) / 180);
    var petal = new Path.Ellipse({
      center: [cx, cy],
      size: petalSize1,
      fillColor: "red",
      rotation: ang,
      shadowColor: new Color(0.9, 0.9, 0.9),
      shadowBlur: 8,
      shadowOffset: new Point(0, 0),
    });
    petal.fillColor.hue = pcolor + 5 * Math.random() - 2.5;
    petal.fillColor.brightness += 0.1 * Math.random() - 0.05;
    new Path.Ellipse({
      center: [cx, cy],
      size: [80, 3],
      fillColor: new Color(1, 1, 1, 0.3),
      rotation: ang,
    });
  }

  // smaller petals
  for (var x = 0; x < npetals; x++) {
    var ang =
      x * (360 / npetals) + 360 / (npetals * 2) + (6 * Math.random() - 3);
    var cx = xoff + 25 * Math.cos((ang * Math.PI) / 180);
    var cy = yoff + 25 * Math.sin((ang * Math.PI) / 180);
    var petal = new Path.Ellipse({
      center: [cx, cy],
      size: petalSize2,
      fillColor: "red",
      rotation: ang,
      shadowColor: new Color(0.2, 0.2, 0.2),
      shadowBlur: 8,
      shadowOffset: new Point(0, 0),
    });
    petal.fillColor.hue = pcolor + 5 * Math.random() - 2.5;
    petal.fillColor.brightness -= 0.1 * Math.random() - 0.05;
    new Path.Ellipse({
      center: [cx, cy],
      size: [50, 2],
      fillColor: new Color(0, 0, 0, 0.3),
      rotation: ang,
    });
  }

  // inner ring
  var ringRatio = ringShape / 9;
  var nring = Math.round(15 + 30 * ringRatio);
  var ringSize = [35, 15 - 12 * ringRatio];
  var rcolor = new Color(225 / 255, 229 / 255, 20 / 255, 0.95);
  for (var x = 1; x < nring + 1; x++) {
    var ang = x * (360 / nring);
    var cx =
      xoff + 15 * Math.cos((ang * Math.PI) / 180) + (1 * Math.random() - 0.5);
    var cy =
      yoff + 15 * Math.sin((ang * Math.PI) / 180) + (1 * Math.random() - 0.5);
    var ring = new Path.Ellipse({
      center: [cx, cy],
      size: ringSize,
      fillColor: rcolor,
      rotation: ang,
    });
  }

  // inner circle
  var circleRatio = circleColor / 9;
  var icircle = new Path();
  icircle.fillColor = new Color(104 / 255, 50 / 255, 14 / 255);
  icircle.fillColor.hue += circleRatio * 35;
  for (var x = 0; x < 100; x++) {
    var ang = x * (360 / 60);
    var cx =
      xoff + 18 * Math.cos((ang * Math.PI) / 180) + (1 * Math.random() - 0.5);
    var cy =
      yoff + 18 * Math.sin((ang * Math.PI) / 180) + (1 * Math.random() - 0.5);
    icircle.add(new Point(cx, cy));
  }
  icircle.closePath();
  icircle.shadowColor = new Color(0.1, 0.1, 0.1);
  icircle.shadowBlur = 5;
  icircle.shadowOffset = new Point(0, 0);
  for (var xr = 1; xr <= 16; xr = xr + 3) {
    var ndots = 30 - (25 * (16 - xr)) / 16;
    var rangbeg = Math.PI * Math.random();
    for (var x = 1; x < ndots + 1; x++) {
      rang = rangbeg + (x * 2 * Math.PI) / ndots + 0.1 * Math.random();
      rrad = xr + 0.1 * Math.random();
      var cx = xoff + rrad * Math.cos(rang);
      var cy = yoff + rrad * Math.sin(rang);
      var spot = new Path.Ellipse({
        center: [cx, cy],
        size: [3, 3],
        fillColor: icircle.fillColor,
      });
      spot.fillColor.hue += 5 * Math.random() - 2.5;
      spot.fillColor.brightness += 0.3 - 0.15 * Math.random(); //(1-(rrad/15));
      spot.fillColor.alpha = 0.2;
    }
  }

  paper.view.draw();
  //paper.view.element.toBlob(function(blob) { saveAs(blob, "image.png");});
}

function download_img(petalColor, petalShape, ringShape) {
  var link = document.createElement("a");
  link.href = paper.view.element.toDataURL();
  link.download =
    "flower1_c" + petalColor + "s" + petalShape + ringShape + ".png";
  link.click();
}

drawFlower1(1, 1, 1);
globals.drawFlower1 = drawFlower1;
globals.download_img = download_img;
