import AstalNotifd from "gi://AstalNotifd";
import PanelButton from "../common/PanelButton";
import { App, Gtk } from "astal/gtk4";
import { bind, Variable } from "astal";
import { WINDOW_NAME } from "../notification/NotificationWindow";

const notifd = AstalNotifd.get_default();

function NotifIcon() {
  return (
    <image
      cssClasses={["panel-btn__icon"]}
      iconName={bind(notifd, "dont_disturb").as((dnd) =>
        `notifications-${dnd ? "disabled-" : ""}symbolic`
      )}
    />
  );
}

export default function NotifPanelButton() {
  return (
    <PanelButton
      window={WINDOW_NAME}
      onClicked={() => App.toggle_window(WINDOW_NAME)}
    >
      <NotifIcon />
    </PanelButton>
  );
}