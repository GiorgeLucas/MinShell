import { App } from "astal/gtk4";
import style from "./ styles/styles.scss";
import windows from "./windows";
import initHyprland from "./utils/hyprland";

App.start({
    css: style,
    main() {
        windows.map((win) => App.get_monitors().map(win));
        initHyprland();
    },
})
