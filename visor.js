
// Obtener los años disponibles desde GeoServer dinámicamente
let selectedYear = new Date().getFullYear();

const mapStyles = {
    normal: new ol.source.OSM(),
    grayscale: new ol.source.XYZ({
        url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        attributions: '&copy; CARTO, OpenStreetMap contributors',
        crossOrigin: 'anonymous'
    }),
    humanitarian: new ol.source.XYZ({
        url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attributions: '&copy; OpenTopoMap & contributors',
        crossOrigin: 'anonymous'
    })
};



fetch('https://geoserver.gg19083.me/geoserver/SIGEDES/wms?service=WMS&request=GetCapabilities')
    .then(res => res.text())
    .then(text => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");

        const capaBase = "SIGEDES:mapa_indicador_departamento";
        const layer = [...xml.getElementsByTagName("Layer")]
            .find(l => l.getElementsByTagName("Name")[0]?.textContent === capaBase);


        const dimension = [...layer?.getElementsByTagName("*") || []].find(e => e.tagName.toLowerCase() === "dimension");
        if (!dimension || !dimension.textContent) {
            console.warn("No se encontró la dimensión temporal.");
            selectedYear = yearSelect.value;
            return;
        }
        if (!dimension) {
            console.warn("No se encontró la dimensión temporal.");
            selectedYear = yearSelect.value;
            return;
        }

        const years = [...new Set(dimension.textContent.trim().split(",").map(y => y.slice(0, 4)))].sort((a, b) => b - a);

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
    // Centros Educativos
    capa1: crearCapa('SIGEDES:mapa_centros_departamento'),
    capa2: crearCapa('SIGEDES:mapa_centros_municipio'),
    capa3: crearCapa('SIGEDES:mapa_centros_distrito'),

    // Indicadores de Deserción
    capa4: crearCapa('SIGEDES:mapa_indicador_departamento'),
    capa5: crearCapa('SIGEDES:mapa_indicador_municipio'),
    capa6: crearCapa('SIGEDES:mapa_indicador_distrito'),

    // Límites Administrativos
    capa7: crearCapa('SIGEDES:DEPART_LL'),
    capa8: crearCapa('SIGEDES:DEPART_LP'),
    capa9: crearCapa('SIGEDES:DEPART_SS'),
    capa10: crearCapa('SIGEDES:DISTRI_LL'),
    capa11: crearCapa('SIGEDES:DISTRI_LP'),
    capa12: crearCapa('SIGEDES:DISTRI_SS'),
    capa13: crearCapa('SIGEDES:El Salvador'),
    capa14: crearCapa('SIGEDES:MUNIS_LL'),
    capa15: crearCapa('SIGEDES:MUNIS_LP'),
    capa16: crearCapa('SIGEDES:MUNIS_SS'),

    // Capas Base - Hidro y Relieve
    capa17: crearCapa('SIGEDES:pendiente_elsalvador'),
    capa18: crearCapa('SIGEDES:riosCortos'),
    capa19: crearCapa('SIGEDES:riosLargos'),
    capa20: crearCapa('SIGEDES:zonas_bajas_inundacion'),

    // Terreno e Infraestructura
    capa21: crearCapa('SIGEDES:carreteras'),
    capa22: crearCapa('SIGEDES:curvas_nivel'),
    capa23: crearCapa('SIGEDES:dem_elsalvador'),
    capa24: crearCapa('SIGEDES:lagos'),
    capa25: crearCapa('SIGEDES:renderDeserciono75'),
    capa26: crearCapa('SIGEDES:renderCentros')
};


function crearCapa(layerName) {
    return new ol.layer.Image({
        source: new ol.source.ImageWMS({
            url: 'https://geoserver.gg19083.me/geoserver/SIGEDES/wms',
            params: {
                'LAYERS': layerName,
                'TILED': true,
                get TIME() { return selectedYear }
            },
            serverType: 'geoserver',
            transition: 0
        }),
        opacity: 0.7,
        visible: false
    });
}

capas.capa1.setVisible(true);
capas.capa4.setVisible(true);

let baseLayer = new ol.layer.Tile({
    source: mapStyles.normal
});

document.querySelectorAll('.style-thumb').forEach(thumb => {
    thumb.addEventListener('click', function () {
        const selected = this.getAttribute('data-style');

        // Actualizar estilo base
        if (mapStyles[selected]) {
            baseLayer.setSource(mapStyles[selected]);
        }

        // Quitar selección anterior
        document.querySelectorAll('.style-thumb').forEach(el => el.classList.remove('selected'));
        this.classList.add('selected');
    });
});



const map = new ol.Map({
    target: 'map',
    layers: [baseLayer, ...Object.values(capas)],
    view: new ol.View({
        center: ol.proj.fromLonLat([-88.9, 13.8]),
        zoom: 7,
        minZoom: 7,
        maxZoom: 18,
        extent: ol.proj.transformExtent([-90.15, 13.0, -87.6, 14.45], 'EPSG:4326', 'EPSG:3857')
    })
});

// Estilo dinámico del mapa base
const mapStyleSelect = document.getElementById('mapStyle');
if (mapStyleSelect) {
    mapStyleSelect.addEventListener('change', function () {
        const selected = this.value;
        if (mapStyles[selected]) {
            baseLayer.setSource(mapStyles[selected]);
        }
    });
}




document.getElementById('yearSelect').addEventListener('change', function () {
    selectedYear = this.value;
    for (let i = 1; i <= 26; i++) {
        capas[`capa${i}`].getSource().updateParams({ 'TIME': selectedYear });
    }
});

const capasConTiempo = [4, 5, 6];  // Las que usan TIME

for (let i = 1; i <= 26; i++) {
    document.getElementById(`capa${i}`).addEventListener('change', function () {
        const capa = capas[`capa${i}`];
        capa.setVisible(this.checked);

        if (this.checked && capasConTiempo.includes(i)) {
            // Forzar recarga cuando se active una capa con dimensión temporal
            const source = capa.getSource();
            const params = source.getParams();
            params.TIME = selectedYear;
            source.updateParams(params);
        }
    });
}


document.getElementById('activateAll').addEventListener('click', function () {
    for (let i = 1; i <= 26; i++) {
        document.getElementById(`capa${i}`).checked = true;
        capas[`capa${i}`].setVisible(true);
    }
});

document.getElementById('deactivateAll').addEventListener('click', function () {
    for (let i = 1; i <= 26; i++) {
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

    for (let i = 1; i <= 26; i++) {
        const capa = capas[`capa${i}`];
        if (capa.getVisible()) {
            const params = capa.getSource().getParams();
            params.TIME = selectedYear;
            capa.getSource().updateParams(params);

            const url = capa.getSource().getFeatureInfoUrl(
                evt.coordinate,
                resolution,
                projection.getCode(),
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

                                if (keyLower === 'anio' || keyLower === 'año') continue;
                                if (keyLower.includes('id')) continue;

                                let label = key.replace(/_/g, ' ');
                                let displayValue = value;

                                // Personalización según número de capa
                                if (i === 17) label = 'Pendiente estimada (%)';
                                else if (i === 20) label = 'Zona de Inundación';
                                else if (i === 22) label = 'Altura estimada (curva) (m)';
                                else if (i === 23) label = 'Altura DEM (m)';

                                // Otros ajustes
                                if (keyLower.includes('porcentaje') || keyLower.includes('percent')) {
                                    const num = parseFloat(value);
                                    if (!isNaN(num)) {
                                        displayValue = `${num.toFixed(2)}%`;
                                    }
                                }

                                if (!isNaN(value)) {
                                    displayValue = parseFloat(value).toFixed(2);
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

const toggleBtn = document.getElementById("toggleControls");
const panel = document.getElementById("controls");

toggleBtn.addEventListener("click", () => {
    const isMinimized = panel.classList.toggle("minimized");
    toggleBtn.classList.toggle("minimized", isMinimized);
    toggleBtn.textContent = isMinimized ? "☰" : "❮";
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


document.querySelectorAll('.group-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        content.classList.toggle('collapsed');
        if (content.classList.contains('collapsed')) {
            btn.textContent = btn.textContent.replace('➖', '➕');
        } else {
            btn.textContent = btn.textContent.replace('➕', '➖');
        }
    });
});

window.addEventListener('load', () => {
    const modal = document.getElementById('welcomeModal');
    const closeBtn = document.getElementById('closeModal');

    modal.style.display = 'flex';

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});

document.getElementById("zoomIn").addEventListener("click", () => {
    const view = map.getView();
    view.setZoom(view.getZoom() + 1);
});

document.getElementById("zoomOut").addEventListener("click", () => {
    const view = map.getView();
    view.setZoom(view.getZoom() - 1);
});

window.addEventListener('load', () => {
    // Inicializa tu mapa aquí
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-88.9, 13.8]),
            zoom: 7
        })
    });

    // Escucha el evento de carga completa del mapa
    map.once('rendercomplete', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.transition = 'opacity 1s ease';
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1000);
        } else {
            console.warn("⚠️ Elemento con id='preloader' no encontrado.");
        }
    });
});



document.getElementById('dashboardBtn').addEventListener('click', () => {
    window.open('dashboard.html', '_blank');
});

document.getElementById('vista3DBtn').addEventListener('click', () => {
    window.open('3d.html', '_blank');
});
