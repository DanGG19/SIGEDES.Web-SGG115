// Opcional: Cesium ion token (si quieres usar recursos protegidos de Cesium Ion)
// Cesium.Ion.defaultAccessToken = 'your_access_token';

const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  timeline: false,
  animation: false,
});


const ElSalvadorURL = 'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3AEl%20Salvador&outputFormat=application%2Fjson&maxFeatures=50';

const departamentosURLS = [

  //0 LA LIBERTAD
  //1 LA PAZ  
  //2 SAN SALVADOR

  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3ADEPART_LL&outputFormat=application%2Fjson&maxFeatures=50',
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3ADEPART_LP&outputFormat=application%2Fjson&maxFeatures=50',
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3ADEPART_SS&outputFormat=application%2Fjson&maxFeatures=50',
];

const ElSalvador = await Cesium.GeoJsonDataSource.load(
  ElSalvadorURL, {
  stroke: Cesium.Color.BLACK,
  fill: Cesium.Color.NONE,
  strokeWidth: 3,
  markerSymbol: '?',
  clampToGround: true  // importante: no debe estar pegado al terreno
});

viewer.dataSources.add(ElSalvador);


const LaLibertad = await Cesium.GeoJsonDataSource.load(
  departamentosURLS[0], {
  stroke: Cesium.Color.YELLOW,
  fill: Cesium.Color.YELLOW,
  strokeWidth: 3,
  markerSymbol: '?',
  clampToGround: true  // importante: no debe estar pegado al terreno
});

viewer.dataSources.add(LaLibertad);

const LaPaz = await Cesium.GeoJsonDataSource.load(
  departamentosURLS[1], {
  stroke: Cesium.Color.BLUE,
  fill: Cesium.Color.BLUE,
  strokeWidth: 3,
  markerSymbol: '?',
  clampToGround: false  // importante: no debe estar pegado al terreno
});

viewer.dataSources.add(LaPaz);

const SanSalvador = await Cesium.GeoJsonDataSource.load(
  departamentosURLS[2], {
  stroke: Cesium.Color.RED,
  fill: Cesium.Color.RED,
  strokeWidth: 3,
  markerSymbol: '?',
  clampToGround: true  // importante: no debe estar pegado al terreno
});


viewer.dataSources.add(SanSalvador);

// Elevar cada entidad a 100m
LaLibertad.entities.values.forEach(entity => {
  
  const area = entity.properties.AREA_KM.getValue();
  
  
  if (entity.polygon) {
    entity.polygon.extrudedHeight = 1000; // para polígonos
    entity.polygon.height = area ; // para polígonos
  }
  if (entity.position) {
    const cartographic = Cesium.Cartographic.fromCartesian(entity.position.getValue(Cesium.JulianDate.now()));
    entity.position = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      100
    );
  }
});

LaPaz.entities.values.forEach(entity => {
  
  const area = entity.properties.AREA_KM.getValue();
  
  
  if (entity.polygon) {
    entity.polygon.extrudedHeight = 0; // para polígonos
    entity.polygon.height = area ; // para polígonos
  }
  if (entity.position) {
    const cartographic = Cesium.Cartographic.fromCartesian(entity.position.getValue(Cesium.JulianDate.now()));
    entity.position = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      100
    );
  }
});

SanSalvador.entities.values.forEach(entity => {
  
  const area = entity.properties.AREA_KM.getValue();
  
  
  if (entity.polygon) {
    entity.polygon.extrudedHeight = 0; // para polígonos
    entity.polygon.height = area ; // para polígonos
  }
  if (entity.position) {
    const cartographic = Cesium.Cartographic.fromCartesian(entity.position.getValue(Cesium.JulianDate.now()));
    entity.position = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      100
    );
  }
});


async function cargarDatos() {
  try {
    const response = await fetch(ElSalvadorURL);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error al cargar:', error);
  }
}

cargarDatos();




viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(-89.19137812643355,13.697214555555721,1000000),
});

// Cargar edificios 3D de OSM
const buildingTileset = await Cesium.createOsmBuildingsAsync();
viewer.scene.primitives.add(buildingTileset);
