import { App } from "astal/gtk4";
import style from "./styles/themes/light/index.scss";
import windows from "./windows";
import initHyprland from "./utils/hyprland";
import { initThemes } from "./utils/styles";
import { wallpapersManager } from "./utils/wallpapers";

initThemes();
wallpapersManager.init();

App.start({
    css: style,
    main() {
        windows.map((win) => App.get_monitors().map(win));
        initHyprland();
    },
})

// Refatorar o power menu e o estilo dele.
