import AstalNotifd from "gi://AstalNotifd";
import PopupWindow from "../common/PopupWindow";
import { App, Gtk, Gdk } from "astal/gtk4";
import { bind, GObject, Variable } from "astal";
import Notification from "./Notification";

export const WINDOW_NAME = "notifications";
const notifd = AstalNotifd.get_default();

function NotifsScrolledWindow() {
  const notifd = AstalNotifd.get_default();
  return (
    <Gtk.ScrolledWindow vexpand>
      <box vertical hexpand={false} spacing={8}>
        {bind(notifd, "notifications").as((notifs) =>
          notifs.map((e) => <Notification n={e} showActions={false} />),
        )}
        <box
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
          cssClasses={["not-found"]}
          vertical
          vexpand
          visible={bind(notifd, "notifications").as((n) => n.length === 0)}
        >
          <label label="󰪑" cssClasses={["not-found-icon", "text-icon"]}/>
          <label label="Your inbox is empty" />
        </box>
      </box>
    </Gtk.ScrolledWindow>
  );
}

function DNDButton() {
  return (
    <button
      onClicked={() => {
        notifd.set_dont_disturb(!notifd.get_dont_disturb());
      }}
      cssClasses={bind(notifd, "dont_disturb").as((dnd) => {
        const classes = ["notifications-box__dnd"];
        dnd && classes.push("notifications-box__dnd--active");
        return classes;
      })}
      label={"Do Not Disturb"}
    />
  );
}

function ClearButton() {
  return (
    <button
      cssClasses={["notifications-box__clear-btn"]}
      onClicked={() => {
        notifd.notifications.forEach((n) => n.dismiss());
      }}
      sensitive={bind(notifd, "notifications").as((n) => n.length > 0)}
    >
      <image iconName={"user-trash-full-symbolic"} />
    </button>
  );
}

export default function NotificationWindow(_gdkmonitor: Gdk.Monitor) {
  return (
    <PopupWindow
      name={WINDOW_NAME}
      animation="slide right"
      layout="top_right"
    >
      <box
        cssClasses={["window-content", "notifications-box"]}
        vertical
        vexpand={false}
      >
        <box cssClasses={["notifications-box__header"]}>
          <label cssClasses={["notifications-box__title"]} label={"Notifications"} hexpand xalign={0} />
          <DNDButton />
          <ClearButton />
        </box>
        <Gtk.Separator />
        <NotifsScrolledWindow />
      </box>
    </PopupWindow>
  );
}
