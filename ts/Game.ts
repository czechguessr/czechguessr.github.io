namespace CzechGuessr.Game {
    let PANO: SMap.Pano.Scene;
    let CGMAP: CGMap.Map;
    let MAP: JQuery<HTMLElement>;
    let LMAP: L.Map;
    let MARKER: L.Marker;
    let TMARKER: L.Marker;
    let TARGET: L.Polyline;
    let currentLocation: CGMap.Location;
    let errors: number[] = [];
    let greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    export async function load() {
        $("#results").hide();
        CGMAP = await CGMap.Map.fromUrl(localStorage.getItem(GLOBAL.MAP_KEY) as string);
        MAP = $("#map");
        MAP.hide();
        PANO = new SMap.Pano.Scene($("#pano")[0])
        MARKER = L.marker(CGMAP.center);
        TMARKER = L.marker(CGMAP.center, { icon: greenIcon });
        next();
    }

    function loadLocation(loc: CGMap.Location) {
        SMap.Pano.getBest(CGMap.Location.toSeznamLocation(loc)).then((place: SMap.Pano.Place) => {
            PANO.show(place, { yaw: 1.8 * Math.PI });
        })
    }

    export function update() {
        loadLocation(currentLocation);
    }

    export function end() {
        MAP.hide();
        $("#end").hide();
        $("#pano").hide();
        $("#btn").hide();
        let sum = Math.round((errors.reduce((a, b) => a + b)) * 10) / 10;
        let mean = Math.round((sum / errors.length) * 10) / 10;
        $("#avg-err").text(`Avg. error: ${mean > 1000 ? Math.round(mean / 10) / 100 : mean} ${mean > 1000 ? "km" : "m"}`);
        $("#total-err").text(`Total error: ${sum > 1000 ? Math.round(sum / 10) / 100 : sum}  ${sum > 1000 ? "km" : "m"}`);
        $("#round-count").text(`Rounds played: ${errors.length}`);
        $("#results").show();
    }

    export function next() {
        MARKER.setLatLng(CGMAP.center);
        if (CGMAP.usable.length == 0) {
            end();
            return;
        }
        let random = CGMAP.randomLocation();
        currentLocation = random == null ? currentLocation : random;
        update();
    }
    export namespace Events {
        enum BtnStates {
            closed,
            map,
            waitForNext,
        };
        enum MarkerStates {
            hidden,
            shown,
        };
        let btnState: BtnStates = BtnStates.closed;
        let markerState: MarkerStates = MarkerStates.hidden;

        export function onMapClick(e: L.LeafletMouseEvent) {
            if (markerState === MarkerStates.hidden) {
                MARKER.addTo(LMAP);
                markerState = MarkerStates.shown;
            }
            MARKER.setLatLng(e.latlng);
        }

        export function onBtnClick() {
            if (btnState === BtnStates.map) {
                let dist = Math.round(SMap.Coords.fromWGS84(MARKER.getLatLng().lng, MARKER.getLatLng().lat).distance(SMap.Coords.fromWGS84(currentLocation.lon, currentLocation.lat)) * 10) / 10;
                LMAP.removeEventListener('click');
                errors.push(dist);
                alert(`Error is ${dist > 1000 ? Math.round(dist / 10) / 100 : dist} ${dist > 1000 ? "km" : "m"}`);
                let points: L.LatLngExpression[] = [[currentLocation.lat, currentLocation.lon], MARKER.getLatLng()];
                TMARKER.setLatLng(points[0]);
                TMARKER.addTo(LMAP);
                if (TARGET === undefined)
                    TARGET = L.polyline(points);
                else
                    TARGET.setLatLngs(points);
                TARGET.addTo(LMAP);
                $("#btn").html("<i class=\"bi bi-arrow-right-circle-fill\"></i>");
                btnState = BtnStates.waitForNext;
            } else if (btnState === BtnStates.waitForNext) {
                TARGET.remove();
                MARKER.remove();
                TMARKER.remove();
                markerState = MarkerStates.hidden;
                LMAP.on('click', Events.onMapClick);
                $("#btn").html("<i class=\"bi bi-map\"></i>");
                LMAP.setView(CGMAP.center, CGMAP.centerZoom);
                next();
                btnState = BtnStates.map;
            }
        }

        export function onBtnHover() {
            if (btnState === BtnStates.closed) {
                MAP.show();
                if (LMAP === undefined) {
                    LMAP = L.map(MAP[0]).setView(CGMAP.center, CGMAP.centerZoom);
                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    }).addTo(LMAP);
                    LMAP.on('click', Events.onMapClick);
                }
                $("#btn").html("<i class=\"bi bi-geo-alt\"></i>");
                btnState = BtnStates.map;
            }
        }

        export function onMapHoverOut() {
            if (btnState === BtnStates.map) {
                MAP.hide();
                $("#btn").html("<i class=\"bi bi-map\"></i>");
                btnState = BtnStates.closed;
            }
        }
    }
}

