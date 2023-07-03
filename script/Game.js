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
        var _this = this;
        var PANO;
        var CGMAP;
        var MAP;
        var SMAP;
        var MARKER;
        var M_LAYER;
        var currentLocation;
        var errors = [];
        Game.load = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        $("#results").hide();
                        return [4 /*yield*/, CzechGuessr.CGMap.Map.fromUrl(localStorage.getItem(CzechGuessr.GLOBAL.MAP_KEY))];
                    case 1:
                        CGMAP = _a.sent();
                        MAP = $("#map");
                        MAP.hide();
                        PANO = new SMap.Pano.Scene($("#pano")[0]);
                        M_LAYER = new SMap.Layer.Marker();
                        MARKER = new SMap.Marker(CGMAP.center, "CGMarker");
                        //@ts-expect-error
                        MARKER.decorate(SMap.Marker.Feature.Draggable);
                        M_LAYER.addMarker(MARKER);
                        Game.next();
                        return [2 /*return*/];
                }
            });
        }); };
        var loadLocation = function (loc) {
            //@ts-expect-error
            SMap.Pano.getBest(CzechGuessr.CGMap.Location.toSeznamLocation(loc)).then(function (place) {
                PANO.show(place, { yaw: 1.8 * Math.PI });
            });
        };
        Game.update = function () {
            loadLocation(currentLocation);
        };
        var end = function () {
            MAP.hide();
            $("#pano").hide();
            $("#btn").hide();
            var sum = Math.round((errors.reduce(function (a, b) { return a + b; })) * 10) / 10;
            var mean = Math.round((sum / errors.length) * 10) / 10;
            $("#avg-err").text("Avg. error: ".concat(mean > 1000 ? Math.round(mean / 10) / 100 : mean, " ").concat(mean > 1000 ? "km" : "m"));
            $("#total-err").text("Total error: ".concat(sum > 1000 ? Math.round(sum / 10) / 100 : sum, "  ").concat(sum > 1000 ? "km" : "m"));
            $("#results").show();
        };
        Game.next = function () {
            MARKER.setCoords(CGMAP.center);
            if (CGMAP.usable.length == 0) {
                end();
                return;
            }
            var random = CGMAP.randomLocation();
            currentLocation = random == null ? currentLocation : random;
            Game.update();
        };
        var Button;
        (function (Button) {
            var BtnStates;
            (function (BtnStates) {
                BtnStates[BtnStates["closed"] = 0] = "closed";
                BtnStates[BtnStates["map"] = 1] = "map";
            })(BtnStates || (BtnStates = {}));
            ;
            var btnState = BtnStates.closed;
            Button.onBtnClick = function () {
                if (btnState === BtnStates.map) {
                    var dist = Math.round(MARKER.getCoords().distance(SMap.Coords.fromWGS84(currentLocation.lon, currentLocation.lat), 430) * 10) / 10;
                    errors.push(dist);
                    alert("Error is ".concat(dist > 1000 ? Math.round(dist / 10) / 100 : dist, " ").concat(dist > 1000 ? "km" : "m"));
                    Game.next();
                }
            };
            Button.onBtnHover = function () {
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
            };
            Button.onMapHoverOut = function () {
                if (btnState === BtnStates.map) {
                    MAP.hide();
                    $("#btn").html("<i class=\"bi bi-map\"></i>");
                    btnState = BtnStates.closed;
                }
            };
        })(Button = Game.Button || (Game.Button = {}));
    })(Game = CzechGuessr.Game || (CzechGuessr.Game = {}));
})(CzechGuessr || (CzechGuessr = {}));
