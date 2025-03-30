import AstalNotifd from "gi://AstalNotifd";
import QSButton from "../QSButton";
import { bind } from "astal";
import { App } from "astal/gtk4";
import { WINDOW_NAME as QS_WINDOW_NAME } from ".././QSWindow";
import { WINDOW_NAME } from "../../wallpaperpicker/WallpaperPickerWindow";
//import { toggleWallpaperPicker } from "../../wallpaperpicker/WallpaperPicker";;

export default function WallpaperToggleQS() {

  return (
    <QSButton
      onClicked={() => {
        App.toggle_window(QS_WINDOW_NAME);
        App.toggle_window(WINDOW_NAME);
      }}
      iconName={"preferences-desktop-wallpaper-symbolic"}
      label={"Wallpaper Toggle"}
    />
  );
}