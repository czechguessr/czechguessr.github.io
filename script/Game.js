"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CzechGuessr;
(function (CzechGuessr) {
    var Game;
    (function (Game) {
        var PANO;
        var CGMAP;
        var MAP;
        var LMAP;
        var MARKER;
        var TMARKER;
        var TARGET;
        var DIST_POPUP;
        var currentLocation;
        var distances = [];
        var rounds = [];
        var greenIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        function load() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            $("#results").hide();
                            return [4 /*yield*/, CzechGuessr.CGMap.Map.fromUrl(localStorage.getItem(CzechGuessr.GLOBAL.MAP_KEY))];
                        case 1:
                            CGMAP = _a.sent();
                            MAP = $("#mapContainer");
                            MAP.hide();
                            PANO = new SMap.Pano.Scene($("#pano")[0]);
                            MARKER = L.marker(CGMAP.center);
                            TMARKER = L.marker(CGMAP.center, { icon: greenIcon });
                            next();
                            return [2 /*return*/];
                    }
                });
            });
        }
        Game.load = load;
        function loadLocation(loc) {
            SMap.Pano.getBest(CzechGuessr.CGMap.Location.toSeznamLocation(loc)).then(function (place) {
                PANO.show(place, { yaw: 1.8 * Math.PI });
            });
        }
        function update() {
            loadLocation(currentLocation);
        }
        Game.update = update;
        Game.popups = [];
        function end() {
            document.exitFullscreen().catch(function () { });
            MAP.hide();
            $("#end").hide();
            $("#fs").hide();
            $("#pano").hide();
            $("#btn").hide();
            $("#results").show();
            var resMAP = L.map($("#resMap")[0]).setView(CGMAP.center, CGMAP.centerZoom);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(resMAP);
            var points = [];
            var i = 0;
            for (var _i = 0, rounds_1 = rounds; _i < rounds_1.length; _i++) {
                var round = rounds_1[_i];
                var dist = distances[i];
                var content = "".concat(dist > 1000 ? Math.round(dist / 10) / 100 : dist, " ").concat(dist > 1000 ? "km" : "m");
                L.marker(round[0], { icon: greenIcon }).addTo(resMAP).bindPopup("<div style=\"text-align: center;\"><b style=\"color: green;\">Correct</b><br>".concat(content, " from your answer</div>"));
                L.marker(round[1]).addTo(resMAP).bindPopup("<div style=\"text-align: center;\"><b style=\"text-align: center; color: ".concat(dist > 10 ? "red" : "green", ";\">Your answer</b><br>").concat(content, " from the correct answer</div>"));
                L.polyline(round).addTo(resMAP).bindPopup(content);
                points.push.apply(points, round);
                i++;
            }
            resMAP.fitBounds(L.latLngBounds(points).pad(0.25));
        }
        Game.end = end;
        function next() {
            MARKER.setLatLng(CGMAP.center);
            if (CGMAP.usable.length == 0) {
                end();
                return;
            }
            var random = CGMAP.randomLocation();
            currentLocation = random == null ? currentLocation : random;
            update();
        }
        Game.next = next;
        var Events;
        (function (Events) {
            var TIMEOUT = 100;
            var BtnStates;
            (function (BtnStates) {
                BtnStates[BtnStates["closed"] = 0] = "closed";
                BtnStates[BtnStates["map"] = 1] = "map";
                BtnStates[BtnStates["waitForNext"] = 2] = "waitForNext";
                BtnStates[BtnStates["none"] = 3] = "none";
            })(BtnStates || (BtnStates = {}));
            ;
            var MarkerStates;
            (function (MarkerStates) {
                MarkerStates[MarkerStates["hidden"] = 0] = "hidden";
                MarkerStates[MarkerStates["shown"] = 1] = "shown";
            })(MarkerStates || (MarkerStates = {}));
            ;
            var Modes;
            (function (Modes) {
                Modes[Modes["PC"] = 0] = "PC";
                Modes[Modes["mobile"] = 1] = "mobile";
            })(Modes || (Modes = {}));
            var ScreenStates;
            (function (ScreenStates) {
                ScreenStates[ScreenStates["normal"] = 0] = "normal";
                ScreenStates[ScreenStates["fs"] = 1] = "fs";
            })(ScreenStates || (ScreenStates = {}));
            var btnState = BtnStates.closed;
            var markerState = MarkerStates.hidden;
            var mode;
            if (navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i)
                || navigator.userAgent.match(/Windows Phone/i))
                mode = Modes.mobile;
            else
                mode = Modes.PC;
            var screenState = ScreenStates.normal;
            function onFullscreenRequest() {
                var origPlace = PANO.getPlace().getCoords();
                if (screenState === ScreenStates.normal) {
                    document.documentElement.requestFullscreen();
                    screenState = ScreenStates.fs;
                }
                else {
                    document.exitFullscreen();
                    screenState = ScreenStates.normal;
                }
                $("#pano")[0].innerHTML = "";
                setTimeout(function () {
                    PANO = new SMap.Pano.Scene($("#pano")[0]);
                    loadLocation({ lat: origPlace.toWGS84()[1], lon: origPlace.toWGS84()[0] });
                }, TIMEOUT);
            }
            Events.onFullscreenRequest = onFullscreenRequest;
            function onMapClick(e) {
                if (markerState === MarkerStates.hidden) {
                    MARKER.addTo(LMAP);
                    markerState = MarkerStates.shown;
                }
                MARKER.setLatLng(e.latlng);
            }
            Events.onMapClick = onMapClick;
            function onBtnClick() {
                onBtnHover();
                if (btnState === BtnStates.map) {
                    if (mode === Modes.mobile) {
                        $("#map").width("80%");
                        $("#map").height("80%");
                    }
                    else {
                        $("#map").width("50%");
                        $("#map").height("50%");
                    }
                    var dist = Math.round(SMap.Coords.fromWGS84(MARKER.getLatLng().lng, MARKER.getLatLng().lat).distance(SMap.Coords.fromWGS84(currentLocation.lon, currentLocation.lat)) * 10) / 10;
                    LMAP.removeEventListener('click');
                    distances.push(dist);
                    DIST_POPUP = L.popup({ closeButton: false, closeOnClick: false, closeOnEscapeKey: false, autoClose: false })
                        .setLatLng(L.latLngBounds([MARKER.getLatLng(), L.latLng(currentLocation.lat, currentLocation.lon)]).getCenter())
                        .setContent("".concat(dist > 1000 ? Math.round(dist / 10) / 100 : dist, " ").concat(dist > 1000 ? "km" : "m"))
                        .openOn(LMAP);
                    var points = [L.latLng(currentLocation.lat, currentLocation.lon), MARKER.getLatLng()];
                    rounds.push(points);
                    TMARKER.setLatLng(points[0]);
                    TMARKER.addTo(LMAP);
                    if (TARGET === undefined)
                        TARGET = L.polyline(points);
                    else
                        TARGET.setLatLngs(points);
                    TARGET.addTo(LMAP);
                    $("#btn").html("<i class=\"bi bi-arrow-right-circle-fill\"></i>");
                    LMAP.fitBounds(L.latLngBounds([MARKER.getLatLng(), [currentLocation.lat, currentLocation.lon]]).pad(0.25));
                    if (mode === Modes.mobile) {
                        btnState = BtnStates.none;
                        setTimeout(function () {
                            btnState = BtnStates.waitForNext;
                        }, TIMEOUT);
                    }
                    else {
                        btnState = BtnStates.waitForNext;
                    }
                }
                else if (btnState === BtnStates.waitForNext) {
                    TARGET.remove();
                    MARKER.remove();
                    TMARKER.remove();
                    DIST_POPUP.remove();
                    markerState = MarkerStates.hidden;
                    LMAP.on('click', Events.onMapClick);
                    $("#btn").html("<i class=\"bi bi-map\"></i>");
                    LMAP.setView(CGMAP.center, CGMAP.centerZoom);
                    next();
                    if (mode === Modes.mobile) {
                        btnState = BtnStates.none;
                        setTimeout(function () {
                            btnState = BtnStates.map;
                            onMapHoverOut(true);
                        }, TIMEOUT);
                    }
                    else {
                        btnState = BtnStates.map;
                        onMapHoverOut(true);
                    }
                }
            }
            Events.onBtnClick = onBtnClick;
            function onBtnHover() {
                if (btnState === BtnStates.closed) {
                    MAP.show();
                    if (mode === Modes.mobile) {
                        $("#map").width("80%");
                        $("#map").height("80%");
                    }
                    else {
                        $("#map").width("");
                        $("#map").height("");
                    }
                    if (LMAP === undefined) {
                        LMAP = L.map(MAP[0]).setView(CGMAP.center, CGMAP.centerZoom);
                        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 19,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }).addTo(LMAP);
                        LMAP.on('click', Events.onMapClick);
                    }
                    $("#btn").html("<i class=\"bi bi-geo-alt\"></i>");
                    if (mode === Modes.mobile) {
                        btnState = BtnStates.none;
                        setTimeout(function () {
                            btnState = BtnStates.map;
                        }, TIMEOUT);
                    }
                    else {
                        btnState = BtnStates.map;
                    }
                }
            }
            Events.onBtnHover = onBtnHover;
            function onMapHoverOut(force) {
                if (force === void 0) { force = false; }
                if (btnState === BtnStates.map && (mode === Modes.PC || force)) {
                    $("#map").width("4rem");
                    $("#map").height("4rem");
                    MAP.hide();
                    $("#btn").html("<i class=\"bi bi-map\"></i>");
                    if (mode === Modes.mobile) {
                        btnState = BtnStates.none;
                        setTimeout(function () {
                            btnState = BtnStates.closed;
                        }, TIMEOUT);
                    }
                    else {
                        btnState = BtnStates.closed;
                    }
                }
            }
            Events.onMapHoverOut = onMapHoverOut;
        })(Events = Game.Events || (Game.Events = {}));
    })(Game = CzechGuessr.Game || (CzechGuessr.Game = {}));
})(CzechGuessr || (CzechGuessr = {}));
