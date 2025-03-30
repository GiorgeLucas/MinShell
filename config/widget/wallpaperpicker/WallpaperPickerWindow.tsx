import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk4";
import PopupWindow from "../common/PopupWindow";
import { FlowBox } from "../common/FlowBox";
import { Gio, GLib, timeout } from "astal";
import { wallpapersManager } from "../../utils/wallpapers";
import { darkTheme } from "../../config";
import { bash } from "../../utils";

export const WINDOW_NAME = "wallpaperpicker"

function populateBox(box: Gtk.FlowBox) {
  timeout(100, () => {
    wallpapersManager.generateCache();

    const wallpapersObjectList = wallpapersManager.wallpapersObjectsList.get().filter(wallpaperObj => wallpaperObj.isDark === darkTheme.get())

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
          widthRequest={100}
          heightRequest={150}
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

export default function WallpaperPicker(_gdkmonitor: Gdk.Monitor) {

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
          <button
            cssClasses={["wlp-box__button"]}
            label={"Folder"}
            onClicked={() => {
              App.get_window(WINDOW_NAME)?.hide();
              const folderChooser = new Gtk.FileDialog({
                title: "Choose Folder",
                initialFolder: Gio.file_new_for_path(wallpapersManager.wallpapersFolder),
              });

              folderChooser.select_folder(App.get_window(WINDOW_NAME), null, (_, res) => {
                try {
                  const result = folderChooser.select_folder_finish(res);
                  if (result != null && result.get_path() != null) {
                    wallpapersManager.wallpapersFolder = (result.get_path()!);
                    App.toggle_window(WINDOW_NAME);
                  }
                } catch (e) {
                  if (`${e}`.toLowerCase().includes("dismissed")) {
                    App.toggle_window(WINDOW_NAME);
                  } else {
                    console.error(`${e}`);
                  }
                }
              });
            }}
          />
          <button
            cssClasses={["wlp-box__button"]}
            label={"Refresh"}
            onClicked={() => {
              wallpapersManager.updateWallpapersObjectsList();
              //código para chamar o populatebox no flowbox abaixo
            }}
          />
          <button
            cssClasses={["wlp-box__button"]}
            label={"Clear Cache"}
            onClicked={() => {
              if (GLib.file_test(wallpapersManager.cacheFolder, GLib.FileTest.IS_DIR)) {
                bash(`rm -r ${wallpapersManager.cacheFolder}`);
              }
            }}
          />
        </box>
        <box
          cssClasses={["wlp-box__body"]}
          halign={Gtk.Align.FILL}
          vexpand
          valign={Gtk.Align.FILL}
          >
          <Gtk.ScrolledWindow 
          hexpand 
          propagateNaturalHeight
          >
            <FlowBox
              maxChildrenPerLine={3}
              activateOnSingleClick={false}
              //homogeneous
              rowSpacing={6}
              columnSpacing={6}
              vexpand={false}
              valign={Gtk.Align.START}
              setup={(self) => {
                wallpapersManager.wallpapersObjectsList.subscribe(() => populateBox(self));
                darkTheme.subscribe(() => populateBox(self));
                populateBox(self);
              }}
            >
            </FlowBox>
          </Gtk.ScrolledWindow>
        </box>
      </box>
    </PopupWindow >
  )
}