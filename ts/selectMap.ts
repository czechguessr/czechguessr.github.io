namespace CzechGuessr.SelectMap {
    let wrongPaths: string[] = [];
    let okPaths = new Map<string, CGMap.Config>();
    let maps = new Map<string, CGMap.Map>();

    let FOLDER_PATH: JQuery<HTMLElement>;

    let MAP_SELECT: JQuery<HTMLElement>;
    const MAP_SELECT_DEFAULT = '<option value="" disabled selected>Select map...</option>';

    let STATUS: JQuery<HTMLElement>;
    const STATUS_ERROR = '<i class="bi bi-x-circle-fill"></i>&nbsp;Not found';
    const STATUS_OK = '<i class="bi bi-check-circle-fill"></i>&nbsp;OK';

    let PLAY_BUTTON: JQuery<HTMLElement>;

    export let bodyOnLoad = () => {
        FOLDER_PATH = $('#folder-path');
        MAP_SELECT = $('#map');
        PLAY_BUTTON = $('#play-form-btn');
        STATUS = $("#folder-state");
        if (typeof FOLDER_PATH !== "object" || typeof MAP_SELECT !== "object" || typeof PLAY_BUTTON !== "object") return;
        check();
    }

    let showMaps = (CGConf: CGMap.Config) => {
        maps = new Map<string, CGMap.Map>();
        STATUS.html(STATUS_OK);
        STATUS.removeClass("text-danger");
        STATUS.addClass("text-success");
        MAP_SELECT.removeAttr("disabled");
        PLAY_BUTTON.removeAttr("disabled");
        CGConf.maps.forEach(map => {
            maps.set(map.path, map);
            MAP_SELECT.append(`<option value="${map.path}">${map.name} by ${map.author}</option>`);
        });
    }

    let wrongPath = (path: string) => {
        wrongPaths.push(path);
        STATUS.html(STATUS_ERROR);
        STATUS.removeClass("text-success");
        STATUS.addClass("text-danger");
        MAP_SELECT.attr("disabled", "true");
        PLAY_BUTTON.attr("disabled", "true");
    }

    export let check = async () => {
        MAP_SELECT.html(MAP_SELECT_DEFAULT);
        let root = FOLDER_PATH.val();
        if (typeof root !== "string") return;
        if (wrongPaths.indexOf(root) !== -1) return;
        if (okPaths.has(root)) {
            showMaps(okPaths.get(root) as CGMap.Config);
            return;
        }
        try {
            let config = await CGMap.Config.fromDir(root);

            if (config.maps.length === 0) {
                wrongPath(root);
                return;
            }

            okPaths.set(root, Object.assign({}, config) as CGMap.Config);

            showMaps(config);
        } catch { wrongPath(root); }
    }

    export let ok = () => {
        let mapPath = MAP_SELECT.val();
        if (typeof mapPath !== "string") return;

        let map = maps.get(mapPath);
        if (map == undefined) return;

        localStorage.setItem(GLOBAL.MAP_KEY, mapPath);
        window.location.href = "/game";
    }
}