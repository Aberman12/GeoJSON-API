var express = require("express");
var bodyParser = require("body-parser");
var turf = require("@turf/turf");
var JSON = require("./dma-polygons.json");
var app = express();
let didFind = false;

app.get("/findDMA", function(req, res) {
  if (req.query.lat && req.query.lng) {
    var long = Number(req.query.lng);
    var lat = Number(req.query.lat);
    var points = turf.points([[long, lat]]);
    for (var i = 1; i < JSON.features.length; i++) {
      var newJSONToCheck = JSON.features[i].geometry.coordinates;
      var searchWithin = turf.multiPolygon(newJSONToCheck);
      var doesLandInDMK = turf.pointsWithinPolygon(points, searchWithin);
      if (
        doesLandInDMK.features.length &&
        doesLandInDMK.features[0].geometry.type &&
        doesLandInDMK.features[0].geometry.type === "Point"
      ) {
        didFind = true;
        res.send({ DMA: JSON.features[i].properties.dma_code });
        break;
      }
    }
    if (!didFind) {
      res.sendStatus(400).send("No DMA Match");
    }
  } else {
    res.sendStatus(400).send("error: paramater missing");
  }
});

app.listen(3000, function() {
  console.log("listening on port 3000!");
});
