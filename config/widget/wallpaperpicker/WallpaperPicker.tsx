import { GLib, timeout } from "astal";
import PopupWindow from "../common/PopupWindow";
import { App, Astal, Gtk, hook } from "astal/gtk4";
import { Gio } from "astal";
import { bash, ensureDirectory } from "../../utils";
import { sendBatch } from "../../utils/hyprland";
import { darkTheme } from "../../config";
import { wallpapersManager } from "../../utils/wallpapers";

function populateBox(box: Astal.Box) {
  timeout(100, () => {
    wallpapersManager.generateCache();

    const wallpapersObjectList = wallpapersManager.wallpapersObjectsList.filter(wallpaperObj => wallpaperObj.isDark === darkTheme.get())

    box.set_children(
      wallpapersObjectList.map((wallpaperObj) => (
        <button
          tooltipText={wallpaperObj.path}
          onClicked={() => {
            wallpapersManager.setCurrentWallpaper(wallpaperObj);
          }}
        >
          <Gtk.Picture
            cssClasses={["image"]}
            overflow={Gtk.Overflow.HIDDEN}
            contentFit={Gtk.ContentFit.COVER}
            widthRequest={200}
            file={Gio.file_new_for_path(`${wallpaperObj.cachePath}`)}
          />
        </button>
      )),
    );
  });
}

function wallpaperPicker() {
  ensureDirectory(wallpapersManager.cacheFolder);

  return (
    <PopupWindow
      name={"wallpaperpicker"}
      visible
      setup={(self) => {
        sendBatch([
          `layerrule animation slide top, ${self.namespace}`,
          `layerrule blur, ${self.namespace}`,
          `layerrule ignorealpha 0.3, ${self.namespace}`,
        ]);

        hook(self, App, "window-toggled", (_, win) => {
          if (win.name == "wallpaperpicker" && !win.visible) {
            self.set_child(null);
            self.destroy();
          }
        });
      }}
      layout="top"
    >
      <box
        vertical
        vexpand={false}
        cssClasses={["window-content", "wallpaperpicker-container"]}
        setup={(self) => {
          hook(self, App, "window-toggled", (_, win) => {
            if (win.name == "wallpaperpicker" && !win.visible) {
              self.set_children([]);
            }
          });
        }}
      >
        <box
          spacing={6}
          setup={(self) => {
            hook(self, App, "window-toggled", (_, win) => {
              if (win.name == "wallpaperpicker" && !win.visible) {
                self.set_children([]);
              }
            });
          }}
        >
          <label hexpand xalign={0} label={"Wallpaper"} />
          <label cssClasses={["directory"]} label={wallpapersManager.wallpapersFolder} />
          <button
            tooltipText={"Clear cache"}
            onClicked={() => {
              if (GLib.file_test(wallpapersManager.cacheFolder, GLib.FileTest.IS_DIR)) {
                bash(`rm -r ${wallpapersManager.cacheFolder}`);
              }
            }}
            iconName="user-trash-full-symbolic"
          />
          <button
            tooltipText={"Reload Wallpapers"}
            onClicked={() => {
              wallpapersManager.updateWallpapersObjectsList();
            }}
            iconName="view-refresh-symbolic"
          />
          <button
            tooltipText={"Change folder"}
            onClicked={() => {
              App.get_window("wallpaperpicker")?.hide();
              const folderChooser = new Gtk.FileDialog({
                title: "Choose Folder",
                initialFolder: Gio.file_new_for_path(wallpapersManager.wallpapersFolder),
              });

              folderChooser.select_folder(null, null, (_, res) => {
                try {
                  const result = folderChooser.select_folder_finish(res);
                  if (result != null && result.get_path() != null) {
                    wallpapersManager.wallpapersFolder = (result.get_path()!);
                    wallpaperPicker();
                  }
                } catch (e) {
                  if (`${e}`.toLowerCase().includes("dismissed")) {
                    wallpaperPicker();
                  } else {
                    console.error(`${e}`);
                  }
                }
              });
            }}
            iconName={"folder-symbolic"}
          />
        </box>
        <Gtk.Separator />
        <Gtk.ScrolledWindow>
          <box
            spacing={6}
            vexpand
            setup={(self) => {
              populateBox(self);
              hook(self, App, "window-toggled", (_, win) => {
                if (win.name == "wallpaperpicker" && !win.visible) {
                  self.set_children([]);
                }
              });
            }}
          >
            <label
              label={"Caching wallpapers..."}
              hexpand
              halign={Gtk.Align.CENTER}
            />
          </box>
        </Gtk.ScrolledWindow>
      </box>
    </PopupWindow>
  );
}

export function toggleWallpaperPicker() {
  const windowExist = App.get_windows().some(
    ({ name }) => name == "wallpaperpicker",
  );
  if (!windowExist) {
    wallpaperPicker();
  } else {
    const window = App.get_window("wallpaperpicker");
    window!.hide();
  }
}
