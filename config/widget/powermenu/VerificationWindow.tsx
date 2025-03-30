import Powermenu from "../../utils/powermenu";
import PopupWindow from "../common/PopupWindow";
import { App, Astal, Gdk, Gtk, hook } from "astal/gtk4";
import { exec, bind } from "astal";

const WINDOW_NAME = "verification";

export default function VerificationWindow(_gdkmonitor: Gdk.Monitor) {
  const powermenu = Powermenu.get_default();

  return (
    <PopupWindow
      name={WINDOW_NAME}
      exclusivity={Astal.Exclusivity.NORMAL}
      animation="slide top"
      layout="top_center"
    >
      <box
        cssClasses={["window-content", "verification-box"]}
        vertical
        spacing={6}
      >
        <label
          label={bind(powermenu, "title").as(String)}
          cssClasses={["verification-box__title"]}
        />
        <label label={"Are you sure?"} cssClasses={["verification-box__body"]} />
        <box cssClasses={["verification-box__buttons"]} homogeneous spacing={6}>
          <button
            cssClasses={["verification-box__button"]}
            label={"No"}
            onClicked={() => App.toggle_window(WINDOW_NAME)}
            setup={(self) => {
              hook(self, App, "window-toggled", (_, win) => {
                if (win.name === WINDOW_NAME && win.visible) self.grab_focus();
              });
            }}
          />
          <button
            cssClasses={["verification-box__button"]}
            label={"Yes"}
            onClicked={() => {
              exec(powermenu.cmd);
              App.toggle_window(WINDOW_NAME);
            }}
          />
        </box>
      </box>
    </PopupWindow>
  );
}
