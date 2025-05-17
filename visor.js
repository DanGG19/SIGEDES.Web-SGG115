
// Obtener los años disponibles desde GeoServer dinámicamente
let selectedYear;

fetch('http://68.233.126.108:8080/geoserver/sigedes/wms?service=WMS&request=GetCapabilities')
    .then(res => res.text())
    .then(text => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");

        const capaBase = "sigedes:mapa_indicador_departamento";
        const layer = [...xml.getElementsByTagName("Layer")]
            .find(l => l.getElementsByTagName("Name")[0]?.textContent === capaBase);

        const dimension = layer?.getElementsByTagName("Dimension")[0];
        if (!dimension) {
            console.warn("No se encontró la dimensión temporal.");
            selectedYear = yearSelect.value;
            return;
        }

        const years = [...new Set(dimension.textContent.trim().split(",").map(y => y.slice(0, 4)))]
            .sort((a, b) => b - a);

        yearSelect.innerHTML = ""; // limpiar el select

        years.forEach(y => {
            const opt = document.createElement("option");
            opt.value = y;
            opt.textContent = y;
            yearSelect.appendChild(opt);
        });

        selectedYear = years[0];
        yearSelect.value = selectedYear;
    })
    .catch(err => {
        console.warn("Error al cargar años desde GeoServer:", err);
        selectedYear = yearSelect.value || new Date().getFullYear();
    });



const capas = {
    capa1: crearCapa('sigedes:mapa_centros_departamento'),
    capa2: crearCapa('sigedes:mapa_centros_municipio'),
    capa3: crearCapa('sigedes:mapa_centros_distrito'),
    capa4: crearCapa('sigedes:mapa_indicador_departamento'),
    capa5: crearCapa('sigedes:mapa_indicador_municipio'),
    capa6: crearCapa('sigedes:mapa_indicador_distrito'),
    capa7: crearCapa('sigedes:pendiente_elsalvador'),
    capa8: crearCapa('sigedes:riosCortos'),
    capa9: crearCapa('sigedes:riosLargos'),
    capa10: crearCapa('sigedes:zonas_bajas_inundacion')

};

function crearCapa(layerName) {
    return new ol.layer.Image({
        source: new ol.source.ImageWMS({
            url: 'http://68.233.126.108:8080/geoserver/sigedes/wms',
            params: {
                'LAYERS': layerName,
                'TILED': true,
                'TIME': selectedYear
            },
            serverType: 'geoserver',
            ratio: 1
        }),
        opacity: 0.7,
        visible: false
    });
}

capas.capa1.setVisible(true);
capas.capa4.setVisible(true);

const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({ source: new ol.source.OSM() }),
        capas.capa1,
        capas.capa2,
        capas.capa3,
        capas.capa4,
        capas.capa5,
        capas.capa6,
        capas.capa7,
        capas.capa8,
        capas.capa9,
        capas.capa10
    ],
view: new ol.View({
  center: ol.proj.fromLonLat([-88.95, 13.7]),
  zoom: 6,
  minZoom: 5,
  maxZoom: 18,
  extent: ol.proj.transformExtent(
    [-90.2, 13.0, -88.4, 14.3],
    'EPSG:4326',
    'EPSG:3857'
  )
})

});

document.getElementById('yearSelect').addEventListener('change', function () {
    selectedYear = this.value;
    for (let i = 1; i <= 10; i++) {
        capas[`capa${i}`].getSource().updateParams({ 'TIME': selectedYear });
    }
});

for (let i = 1; i <= 10; i++) {
    document.getElementById(`capa${i}`).addEventListener('change', function () {
        capas[`capa${i}`].setVisible(this.checked);
    });
}

document.getElementById('activateAll').addEventListener('click', function () {
    for (let i = 1; i <= 10; i++) {
        document.getElementById(`capa${i}`).checked = true;
        capas[`capa${i}`].setVisible(true);
    }
});

document.getElementById('deactivateAll').addEventListener('click', function () {
    for (let i = 1; i <= 10; i++) {
        document.getElementById(`capa${i}`).checked = false;
        capas[`capa${i}`].setVisible(false);
    }
});

map.on('singleclick', function (evt) {
    const resolution = map.getView().getResolution();
    const projection = map.getView().getProjection();
    const infoDiv = document.getElementById('info');
    const infoContent = document.getElementById('infoContent');
    infoDiv.style.display = 'block';
    infoContent.innerHTML = '<em>Consultando...</em>';

    let found = false;

    for (let i = 1; i <= 10; i++) {
        const capa = capas[`capa${i}`];
        if (capa.getVisible()) {
            const url = capa.getSource().getFeatureInfoUrl(
                evt.coordinate, resolution, projection.getCode(),
                {
                    INFO_FORMAT: 'application/json',
                    TIME: selectedYear
                }
            );

            if (url) {
                fetch(url)
                    .then(res => res.json())
                    .then(json => {
                        if (json.features.length > 0) {
                            const props = json.features[0].properties;
                            let html = `<strong>Capa ${i}</strong>`;

                            if (props.anio || props.ANIO || props.Año || props.año) {
                              const rawYear = props.anio || props.ANIO || props.Año || props.año;
                              const yearValue = typeof rawYear === "string" ? rawYear.slice(0, 4) : rawYear;
                              html += `<div style="margin-top: 4px; font-size: 13px;"><em>Año: ${yearValue}</em></div>`;
                            }
                            
                            html += '<ul>';
                            for (const [key, value] of Object.entries(props)) {
                                const keyLower = key.toLowerCase();
                              
                                // OMITIR: año ya mostrado arriba
                                if (keyLower === 'anio' || keyLower === 'año') continue;
                              
                                // OMITIR: cualquier campo que contenga 'id'
                                if (keyLower.includes('id')) continue;
                              
                                let label = key.replace(/_/g, ' ');
                                let displayValue = value;
                              
                                if (keyLower.includes('porcentaje') || keyLower.includes('percent')) {
                                  const num = parseFloat(value);
                                  if (!isNaN(num)) {
                                    displayValue = `${num.toFixed(2)}%`;
                                  }
                                }
                              
                                label = label.split(' ')
                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(' ');
                              
                                html += `<li><strong>${label}:</strong> ${displayValue}</li>`;
                              }
                              
                            html += '</ul>';
                            
                            mostrarInfo(html);
                        } else {
                            infoContent.innerHTML = "<em>No hay datos en este punto.</em>";
                        }
                    })
                    .catch(() => {
                        infoContent.innerHTML = "<em>Error al obtener información.</em>";
                    });

                found = true;
                break;
            }
        }
    }

    if (!found) {
        infoContent.innerHTML = "<em>No hay capas visibles para consulta.</em>";
    }
});

document.getElementById("toggleControls").addEventListener("click", () => {
    document.getElementById("controls").classList.toggle("minimized");
  });
  
  
document.getElementById('closeInfo').addEventListener('click', () => {
    document.getElementById('info').style.display = 'none';
});


function mostrarInfo(html) {
    const info = document.getElementById('info');
    const content = document.getElementById('infoContent');
    info.style.display = 'block';
    content.innerHTML = html;
}

