//prefire image
var prefire_image = ee.Image('COPERNICUS/S2/20161228T052222_20161228T052548_T43PEQ');
print(prefire_image);
Map.addLayer(prefire_image,{bands: ['B4', 'B3', 'B2'], max:4000},'prefire_image');
Export.image.toDrive({
  image: prefire_image.visualize(),
  description: 'prefire_sentinel',
  scale: 30
});

//postfire image
var postfire_image = ee.Image('COPERNICUS/S2/20170308T051641_20170308T052754_T43PEQ');
print(postfire_image);
Map.addLayer(postfire_image, {bands: ['B4', 'B3', 'B2'], max:4000},'postfire_image');

//display geometry
Map.centerObject(table, 9);
Map.addLayer(table,{},'geometry');

//calculate prefire NBR
var pre_nbr = prefire_image.normalizedDifference(['B8', 'B12']).rename('NBR');
var prefire_nbr = prefire_image.addBands(pre_nbr);
print(prefire_nbr);
Map.addLayer(prefire_nbr,{bands: ['NBR'],min:-2, max:2},'prefire_nbr');

//calculate postfire NBR
var post_nbr = postfire_image.normalizedDifference(['B8', 'B12']).rename('NBR');
var postfire_nbr = postfire_image.addBands(post_nbr);
print(postfire_nbr);
Map.addLayer(postfire_nbr,{bands: ['NBR'],min:-2, max:2},'postfire_nbr');

//calculate DNBR
var delta = prefire_nbr.select('NBR').subtract(postfire_nbr.select('NBR'));
var dNBR = delta.multiply(1000);
print(delta);
print(dNBR);

//map classified using color classifiers
var sld_intervals =
  '<RasterSymbolizer>' +
    '<ColorMap type="intervals" extended="false" >' +
      '<ColorMapEntry color="#ffffff" quantity="-500" label="-500"/>' +
      '<ColorMapEntry color="#7a8737" quantity="-250" label="-250" />' +
      '<ColorMapEntry color="#acbe4d" quantity="-100" label="-100" />' +
      '<ColorMapEntry color="#0ae042" quantity="100" label="100" />' +
      '<ColorMapEntry color="#fff70b" quantity="270" label="270" />' +
      '<ColorMapEntry color="#ffaf38" quantity="440" label="440" />' +
      '<ColorMapEntry color="#ff641b" quantity="660" label="660" />' +
      '<ColorMapEntry color="#a41fd6" quantity="2000" label="2000" />' +
    '</ColorMap>' +
  '</RasterSymbolizer>';
  
var grey = ['white', 'black'];
Map.addLayer(dNBR.sldStyle(sld_intervals), {}, 'dNBR classified');
Map.addLayer(dNBR, {min: -1000, max: 1000, palette: grey}, 'NBR classified');
Map.addLayer(delta, {max:2,min:-2}, 'delta');







//
