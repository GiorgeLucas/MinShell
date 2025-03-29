import { App, Astal, Gtk, Gdk } from "astal/gtk4"
import { Variable } from "astal"
import WorkspacesPanelButton from "./Workspaces"
import TimePanelButton from "./TimePanelButton"
import NotifPanelButton from "./NotifPanelButton"
import NetworkSpeedPanelButton from "./NetworkSpeedPanelButton"
import QSPanelButton from "./QSPanelButton"
import TrayPanelButton from "./TrayPanelButton"
import { separatorBetween } from "../../utils";
import { darkTheme } from "../../config"
import { wallpapersManager } from "../../utils/wallpapers"

const time = Variable("").poll(1000, "date +'%H:%M - %d/%m/%Y'")

const startButtons = [
  <WorkspacesPanelButton />,
];

function Start() {
  return <box>
    {separatorBetween(startButtons, Gtk.Orientation.VERTICAL)}
  </box>
}

const centerButtons = [
  <TimePanelButton />
];

function Center() {
  return <box>
    {separatorBetween(centerButtons, Gtk.Orientation.VERTICAL)}
  </box>
}

const endButtons = [
  <TrayPanelButton />,
  <NetworkSpeedPanelButton />,
  <NotifPanelButton />,
  <QSPanelButton />
];

function End() {
  return <box>
    {separatorBetween(endButtons, Gtk.Orientation.VERTICAL)}
  </box>
}

export default function Bar(gdkmonitor: Gdk.Monitor = App.get_monitors()[0]) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return <window
    visible
    cssClasses={["Bar"]}
    gdkmonitor={gdkmonitor}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={TOP | LEFT | RIGHT}
    application={App}
    setup={(self) => {
      darkTheme.subscribe((isDarkTheme) => {
        const newWallpaper = wallpapersManager.wallpapersObjectsList
          .filter((wallpaperObj) => wallpaperObj.isDark === isDarkTheme)[0];

        wallpapersManager.setCurrentWallpaper(newWallpaper)
      });
    }}>
    <centerbox cssName="bar-container">
      <Start />
      <Center />
      <End />
    </centerbox>
  </window>
}
