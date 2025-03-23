import AstalNotifd from "gi://AstalNotifd";
import QSButton from "../QSButton";
import { bind } from "astal";
import { App } from "astal/gtk4";
import { toggleWallpaperPicker } from "../../wallpaperpicker/WallpaperPicker";
import { WINDOW_NAME } from "../QSWindow";

export default function WallpaperToggleQS() {

  return (
    <QSButton
      onClicked={() => {
        App.toggle_window(WINDOW_NAME);
        toggleWallpaperPicker();
      }}
      iconName={"preferences-desktop-wallpaper-symbolic"}
      label={"Wallpaper Toggle"}
    />
  );
}