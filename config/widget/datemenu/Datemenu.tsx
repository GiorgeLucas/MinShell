import { App, Gtk, Gdk } from "astal/gtk4";
import PopupWindow from "../common/PopupWindow";
import { Variable } from "astal";

export const WINDOW_NAME = "datemenu-window";

export default function DateMenu(_gdkmonitor: Gdk.Monitor) {
  return (
    <PopupWindow
      name={WINDOW_NAME}
      animation="slide top"
      layout={"top_center"}
    >
      <box vertical cssClasses={["window-content", "datemenu-container"]}>
        <Gtk.Calendar />
      </box>
    </PopupWindow>
  );
}

