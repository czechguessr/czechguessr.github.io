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
    var CGMap;
    (function (CGMap) {
        var build_path = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.map(function (part, i) {
                if (i === 0) {
                    return part.trim().replace(/[\/]*$/g, '');
                }
                else {
                    return part.trim().replace(/(^[\/]*|[\/]*$)/g, '');
                }
            }).filter(function (x) { return x.length; }).join('/');
        };
        var Config = /** @class */ (function () {
            function Config(obj) {
                if (obj === void 0) { obj = {}; }
                this.maps = [];
                Object.assign(this, obj);
            }
            Config.fromDir = function (dir) {
                return __awaiter(this, void 0, void 0, function () {
                    var config, url, json, _i, _a, map, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                config = new Config();
                                url = build_path(dir, "/CzechGuessr.json");
                                return [4 /*yield*/, $.getJSON(url)];
                            case 1:
                                json = _d.sent();
                                if (json.version !== CzechGuessr.GLOBAL.FILE_VERSION)
                                    throw new Error("File version incorrect: ".concat(url, " has version ").concat(json.version, ", but the current FILE_VERSION is ").concat(CzechGuessr.GLOBAL.FILE_VERSION));
                                _i = 0, _a = json.maps;
                                _d.label = 2;
                            case 2:
                                if (!(_i < _a.length)) return [3 /*break*/, 5];
                                map = _a[_i];
                                _c = (_b = config.maps).push;
                                return [4 /*yield*/, Map.fromUrl(build_path(dir, map))];
                            case 3:
                                _c.apply(_b, [_d.sent()]);
                                _d.label = 4;
                            case 4:
                                _i++;
                                return [3 /*break*/, 2];
                            case 5: return [2 /*return*/, config];
                        }
                    });
                });
            };
            return Config;
        }());
        CGMap.Config = Config;
        var Map = /** @class */ (function () {
            function Map(obj) {
                if (obj === void 0) { obj = {}; }
                this.name = "";
                this.author = "";
                this.locations = [];
                this.usable = [];
                this.path = "";
                this.center = SMap.Coords.fromWGS84(0, 0);
                this.centerZoom = 13;
                Object.assign(this, obj);
                this.usable = Object.assign([], this.locations);
            }
            Map.fromUrl = function (url) {
                return __awaiter(this, void 0, void 0, function () {
                    var map, json;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                map = new Map();
                                map.path = url;
                                return [4 /*yield*/, $.getJSON(url)];
                            case 1:
                                json = _a.sent();
                                if (json.version !== CzechGuessr.GLOBAL.FILE_VERSION)
                                    throw new Error("File version incorrect: ".concat(url, " has version ").concat(json.version, ", but the current FILE_VERSION is ").concat(CzechGuessr.GLOBAL.FILE_VERSION));
                                map.name = json.name;
                                map.author = json.author;
                                map.center = SMap.Coords.fromWGS84(json.center[1], json.center[0]);
                                map.centerZoom = json.center[2];
                                json.locations.forEach(function (loc) {
                                    map.locations.push({ lat: loc[0], lon: loc[1] });
                                });
                                map.usable = Object.assign([], map.locations);
                                return [2 /*return*/, map];
                        }
                    });
                });
            };
            Map.prototype.randomLocation = function () {
                if (this.usable.length === 0)
                    return null;
                var idx = Math.floor(Math.random() * this.usable.length);
                var loc = Object.assign({}, this.usable[idx]);
                this.usable.splice(idx, 1);
                return loc;
            };
            return Map;
        }());
        CGMap.Map = Map;
        var Location;
        (function (Location) {
            Location.toSeznamLocation = function (CGloc) {
                return SMap.Coords.fromWGS84(CGloc.lon, CGloc.lat);
            };
        })(Location = CGMap.Location || (CGMap.Location = {}));
    })(CGMap = CzechGuessr.CGMap || (CzechGuessr.CGMap = {}));
})(CzechGuessr || (CzechGuessr = {}));
