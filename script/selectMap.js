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
    var SelectMap;
    (function (SelectMap) {
        var _this = this;
        var wrongPaths = [];
        var okPaths = new Map();
        var maps = new Map();
        var FOLDER_PATH;
        var MAP_SELECT;
        var MAP_SELECT_DEFAULT = '<option value="" disabled selected>Select map...</option>';
        var STATUS;
        var STATUS_ERROR = '<i class="bi bi-x-circle-fill"></i>&nbsp;Not found';
        var STATUS_OK = '<i class="bi bi-check-circle-fill"></i>&nbsp;OK';
        var PLAY_BUTTON;
        SelectMap.bodyOnLoad = function () {
            FOLDER_PATH = $('#folder-path');
            MAP_SELECT = $('#map');
            PLAY_BUTTON = $('#play-form-btn');
            STATUS = $("#folder-state");
            if (typeof FOLDER_PATH !== "object" || typeof MAP_SELECT !== "object" || typeof PLAY_BUTTON !== "object")
                return;
            SelectMap.check();
        };
        var showMaps = function (CGConf) {
            maps = new Map();
            STATUS.html(STATUS_OK);
            STATUS.removeClass("text-danger");
            STATUS.addClass("text-success");
            MAP_SELECT.removeAttr("disabled");
            PLAY_BUTTON.removeAttr("disabled");
            CGConf.maps.forEach(function (map) {
                maps.set(map.path, map);
                MAP_SELECT.append("<option value=\"".concat(map.path, "\">").concat(map.name, " by ").concat(map.author, "</option>"));
            });
        };
        var wrongPath = function (path) {
            wrongPaths.push(path);
            STATUS.html(STATUS_ERROR);
            STATUS.removeClass("text-success");
            STATUS.addClass("text-danger");
            MAP_SELECT.attr("disabled", "true");
            PLAY_BUTTON.attr("disabled", "true");
        };
        SelectMap.check = function () { return __awaiter(_this, void 0, void 0, function () {
            var root, config, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        MAP_SELECT.html(MAP_SELECT_DEFAULT);
                        root = FOLDER_PATH.val();
                        if (typeof root !== "string")
                            return [2 /*return*/];
                        if (wrongPaths.indexOf(root) !== -1)
                            return [2 /*return*/];
                        if (okPaths.has(root)) {
                            showMaps(okPaths.get(root));
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, CzechGuessr.CGMap.Config.fromDir(root)];
                    case 2:
                        config = _b.sent();
                        if (config.maps.length === 0) {
                            wrongPath(root);
                            return [2 /*return*/];
                        }
                        okPaths.set(root, Object.assign({}, config));
                        showMaps(config);
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        wrongPath(root);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        SelectMap.ok = function () {
            var mapPath = MAP_SELECT.val();
            if (typeof mapPath !== "string")
                return;
            var map = maps.get(mapPath);
            if (map == undefined)
                return;
            localStorage.setItem(CzechGuessr.GLOBAL.MAP_KEY, mapPath);
            window.location.href = "/game";
        };
    })(SelectMap = CzechGuessr.SelectMap || (CzechGuessr.SelectMap = {}));
})(CzechGuessr || (CzechGuessr = {}));
