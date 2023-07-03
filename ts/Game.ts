namespace CzechGuessr.Game {
    let PANO: SMap.Pano.Scene;
    let CGMAP: CGMap.Map;
    let MAP: JQuery<HTMLElement>;
    let SMAP: SMap;
    let MARKER: SMap.Marker;
    let M_LAYER: SMap.Layer.Marker;
    let currentLocation: CGMap.Location;
    let errors: number[] = [];

    export let load = async () => {
        $("#results").hide();
        CGMAP = await CGMap.Map.fromUrl(localStorage.getItem(GLOBAL.MAP_KEY) as string);
        MAP = $("#map");
        MAP.hide();
        PANO = new SMap.Pano.Scene($("#pano")[0]);
        M_LAYER = new SMap.Layer.Marker();
        MARKER = new SMap.Marker(CGMAP.center, "CGMarker");
        //@ts-expect-error
        MARKER.decorate(SMap.Marker.Feature.Draggable);
        M_LAYER.addMarker(MARKER);
        next();
    }

    let loadLocation = (loc: CGMap.Location) => {
        //@ts-expect-error
        SMap.Pano.getBest(CGMap.Location.toSeznamLocation(loc)).then((place: SMap.Pano.Place) => {
            PANO.show(place, { yaw: 1.8 * Math.PI });
        })
    }

    export let update = () => {
        loadLocation(currentLocation);
    }

    let end = () => {
        MAP.hide();
        $("#pano").hide();
        $("#btn").hide();
        var sum = Math.round((errors.reduce((a, b) => a + b)) * 10) / 10;
        var mean = Math.round((sum / errors.length) * 10) / 10;
        $("#avg-err").text(`Avg. error: ${mean > 1000 ? Math.round(mean / 10) / 100 : mean} ${mean > 1000 ? "km" : "m"}`);
        $("#total-err").text(`Total error: ${sum > 1000 ? Math.round(sum / 10) / 100 : sum}  ${sum > 1000 ? "km" : "m"}`);
        $("#results").show();
    }

    export let next = () => {
        MARKER.setCoords(CGMAP.center);
        if (CGMAP.usable.length == 0) {
            end();
            return;
        }
        let random = CGMAP.randomLocation();
        currentLocation = random == null ? currentLocation : random;
        update();
    }
    export namespace Button {
        enum BtnStates {
            closed,
            map,
        };
        let btnState: BtnStates = BtnStates.closed;

        export let onBtnClick = () => {
            if (btnState === BtnStates.map) {
                var dist = Math.round(MARKER.getCoords().distance(SMap.Coords.fromWGS84(currentLocation.lon, currentLocation.lat), 430) * 10) / 10;
                errors.push(dist);
                alert(`Error is ${dist > 1000 ? Math.round(dist / 10) / 100 : dist} ${dist > 1000 ? "km" : "m"}`)
                next();
            }
        }

        export let onBtnHover = () => {
            if (btnState === BtnStates.closed) {
                MAP.show();
                $("#btn").html("<i class=\"bi bi-geo-alt\"></i>");
                if (SMAP == undefined) {
                    SMAP = new SMap(MAP[0], CGMAP.center, CGMAP.centerZoom);
                    SMAP.addDefaultLayer(SMap.DEF_BASE).enable();
                    SMAP.addDefaultControls();
                    SMAP.addLayer(M_LAYER).enable();
                }
                btnState = BtnStates.map;
            }
        }

        export let onMapHoverOut = () => {
            if (btnState === BtnStates.map) {
                MAP.hide();
                $("#btn").html("<i class=\"bi bi-map\"></i>");
                btnState = BtnStates.closed;
            }
        }
    }
}

