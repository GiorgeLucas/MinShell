import { Astal, Gdk, Gtk } from "astal/gtk4";
import PopupWindow from "../common/PopupWindow";
import { FlowBox } from "../common/FlowBox";
import { Gio, timeout } from "astal";
import { wallpapersManager } from "../../utils/wallpapers";
import { darkTheme } from "../../config";

export const WINDOW_NAME = "newwallpaperpicker"

function populateBox(box: Gtk.FlowBox) {
  timeout(100, () => {
    wallpapersManager.generateCache();

    const wallpapersObjectList = wallpapersManager.wallpapersObjectsList.filter(wallpaperObj => wallpaperObj.isDark === darkTheme.get())
    
    const elems = wallpapersObjectList.map((wallpaperObj) => (
      <button
        cssClasses={["wlp-box__wallpaper-btn"]}
        tooltipText={wallpaperObj.path}
        onClicked={() => {
          wallpapersManager.setCurrentWallpaper(wallpaperObj);
        }}
      >
        <Gtk.Picture
          cssClasses={["wlp-box__wallpaper-img"]}
          overflow={Gtk.Overflow.HIDDEN}
          contentFit={Gtk.ContentFit.COVER}
          widthRequest={200}
          file={Gio.file_new_for_path(`${wallpaperObj.cachePath}`)}
        />
      </button>
    ));

    box.remove_all();
    elems.forEach((w) => {
      box.append(w);
    });
  });
}

export default function newWallpaperPicker(_gdkmonitor: Gdk.Monitor) {

  return (
    <PopupWindow
      name={WINDOW_NAME}
      animation="slide top"
      layout="top"
    >
      <box
        cssClasses={["window-content", "wlp-box"]}
        vertical
      >
        <box halign={Gtk.Align.CENTER} cssClasses={["wlp-box__header"]} spacing={6}>
          <button cssClasses={["wlp-box__button"]} label={"Folder"} />
          <button cssClasses={["wlp-box__button"]} label={"Refresh"} />
          <button cssClasses={["wlp-box__button"]} label={"Clear Cache"} />
        </box>
        <box halign={Gtk.Align.CENTER}>
          <FlowBox
            cssClasses={["wlp-box__body"]}
            maxChildrenPerLine={3}
            activateOnSingleClick={false}
            homogeneous
            rowSpacing={6}
            columnSpacing={6}
            vexpand={false}
            setup={(self) => {
              populateBox(self);
            }}
          >
          </FlowBox>
        </box>
      </box>
    </PopupWindow>
  )
}