const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  timeline: false,
  animation: false,
});

const elSalvadorURL = 'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3AEl%20Salvador&outputFormat=application%2Fjson&maxFeatures=50';

const departamentosURLS = [

  //0 LA LIBERTAD
  //1 LA PAZ  
  //2 SAN SALVADOR

  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3ADEPART_LL&outputFormat=application%2Fjson&maxFeatures=50',
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3ADEPART_LP&outputFormat=application%2Fjson&maxFeatures=50',
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3ADEPART_SS&outputFormat=application%2Fjson&maxFeatures=50',
];

const capasPuntosURLS = [

  // mapa_centros_departamento
  // mapa_centros_distrito
  // mapa_centros_municipio  

  // mapa_indicador_departamento
  // mapa_indicador_distrito
  // mapa_indicador_municipio

  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3Amapa_centros_departamento&outputFormat=application%2Fjson&maxFeatures=50',
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3Amapa_centros_distrito&outputFormat=application%2Fjson&maxFeatures=50',
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3Amapa_centros_municipio&outputFormat=application%2Fjson&maxFeatures=50',
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3Amapa_indicador_departamento&outputFormat=application%2Fjson&maxFeatures=50',
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3Amapa_indicador_distrito&outputFormat=application%2Fjson&maxFeatures=50',
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3Amapa_indicador_municipio&outputFormat=application%2Fjson&maxFeatures=50',
]

const distritosURLS = [
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3ADISTRI_LL&outputFormat=application%2Fjson&maxFeatures=50',
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3ADISTRI_LP&outputFormat=application%2Fjson&maxFeatures=50',
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3ADISTRI_SS&outputFormat=application%2Fjson&maxFeatures=50',
]

const municipiosURLS = [
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3AMUNIS_LL&outputFormat=application%2Fjson&maxFeatures=50',
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3AMUNIS_LP&outputFormat=application%2Fjson&maxFeatures=50',
  'https://geoserver.gg19083.me/geoserver/SIGEDES/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIGEDES%3AMUNIS_SS&outputFormat=application%2Fjson&maxFeatures=50',
]

const capas = [
  {
    id: "CENTROS_DEP",
    url: capasPuntosURLS[0],
    color: Cesium.Color.BROWN,
  },
  {
    id: "CENTROS_DIS",
    url: capasPuntosURLS[1],
    color: Cesium.Color.BROWN,
  },
  {
    id: "CENTROS_MUN",
    url: capasPuntosURLS[2],
    color: Cesium.Color.BROWN,
  },
  {
    id: "INDICADOR_DEP",
    url: capasPuntosURLS[3],
    color: Cesium.Color.DARKBLUE,
  },
  {
    id: "INDICADOR_DIS",
    url: capasPuntosURLS[4],
    color: Cesium.Color.ORANGE,
  },
  {
    id: "INDICADOR_MUN",
    url: capasPuntosURLS[5],
    color: Cesium.Color.RED,
  },
  {
    id: "LL_DEP",
    url: departamentosURLS[0],
    color: Cesium.Color.BLUE,
  },
  {
    id: "LP_DEP",
    url: departamentosURLS[1],
    color: Cesium.Color.GREEN,
  },
  {
    id: "SS_DEP",
    url: departamentosURLS[2],
    color: Cesium.Color.PINK,
  },
  {
    id: "LL_DIS",
    url: distritosURLS[0],
    color: Cesium.Color.LIGHTBLUE,
  },
  {
    id: "LP_DIS",
    url: distritosURLS[1],
    color: Cesium.Color.LIGHTGREEN,
  },
  {
    id: "SS_DIS",
    url: distritosURLS[2],
    color: Cesium.Color.PINK,
  },
  {
    id: "LL_MUN",
    url: municipiosURLS[0],
    color: Cesium.Color.LIGHTBLUE,
  },
  {
    id: "LP_MUN",
    url: municipiosURLS[1],
    color: Cesium.Color.LIGHTGREEN,
  },
  {
    id: "SS_MUN",
    url: municipiosURLS[2],
    color: Cesium.Color.PINK,
  }
];

const dataSources = {};

async function cargarCapas() {
  for (const capa of capas) {
    const ds = await Cesium.GeoJsonDataSource.load(capa.url, {
      stroke: Cesium.Color.BLACK,
      fill: capa.color.withAlpha(0.9),
      strokeWidth: 6,
      clampToGround: false,

    });

    ds.entities.values.forEach(entity => {


      if (entity.polygon) {
        entity.polygon.height = 0;
        entity.polygon.extrudedHeight = 1000;
        entity.polygon.material = capa.color.withAlpha(0.5);
        entity.polygon.outlineColor = capa.color;
        entity.polygon.clampToGround = true;
      }

      if (entity.polyline) {
        entity.polyline.width = 2;
        entity.polyline.material = capa.color;
      }

      if (!entity.polygon && !entity.polyline) {
        const pos = entity.position.getValue(Cesium.JulianDate.now());
        const cartographic = Cesium.Cartographic.fromCartesian(pos);
        const elevatedPos = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          1200 // altura sobre el terreno y sobre el polígono
        );
        entity.position = elevatedPos;

        entity.billboard = undefined;


        entity.point = new Cesium.PointGraphics({
          color: capa.color,
          pixelSize: 10,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.NONE,
        });
      }
    });

    viewer.dataSources.add(ds);
    dataSources[capa.id] = ds;
  }
}
const ElSalvador = await Cesium.GeoJsonDataSource.load(
  elSalvadorURL, {
  stroke: Cesium.Color.BLACK,
  fill: Cesium.Color.YELLOW.withAlpha(0.5),
  strokeWidth: 6,
  markerSymbol: '?',
  clampToGround: true  // importante: no debe estar pegado al terreno
});

viewer.dataSources.add(ElSalvador);
dataSources["El Salvador"] = ElSalvador;
console.log(dataSources);

function configurarMenu() {
  const checkboxes = document.querySelectorAll(".layer-checkbox");
  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const id = cb.dataset.layer;
      const ds = dataSources[id];
      if (ds) {
        ds.show = cb.checked;
      }
    });
  });
}



// Rango de años para el spinner
const yearSelect = document.getElementById("yearSelect");
for (let y = 2024; y >= 2015; y--) {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
}

function filtrarPorAño(año) {
  capas.forEach(capa => {
    const ds = dataSources[capa.id];
    if (!ds) return;
    ds.entities.values.forEach(entity => {

      if (entity.point) {
        const props = entity.properties;
        if (props && props.anio) {
          const anioEntidad = parseInt(props.anio.getValue().substring(0,4));
          entity.show = (anioEntidad === parseInt(año));
        } 
      }

    });
  });
}

// Lógica del modal
document.getElementById("toggleModalBtn").addEventListener("click", () => {
  document.getElementById("layerModal").classList.toggle("hidden");
});

document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("layerModal").classList.add("hidden");
});

// Ejecutar
cargarCapas().then(() => {
  configurarMenu();
  filtrarPorAño(document.getElementById("yearSelect").value);
});


viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(-89.19137812643355, 13.697214555555721, 500000),
  orientation:
  {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-80.0)
  }

});

document.querySelectorAll('.dropdown-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const dropdown = button.parentElement;
    dropdown.classList.toggle('show');
  });
});

document.getElementById("desmarcarTodoBtn").addEventListener("click", () => {
  document.querySelectorAll(".layer-checkbox").forEach(checkbox => {
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change")); // por si tienes eventos asociados
  });
});

document.getElementById("marcarTodoBtn").addEventListener("click", () => {
  document.querySelectorAll(".layer-checkbox").forEach(checkbox => {
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change"));
  });
});



yearSelect.addEventListener("change", (e) => {
  filtrarPorAño(e.target.value);
});


