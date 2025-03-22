import { timeout } from "astal";
import { App, Astal, hook, Gdk, Widget, Gtk } from "astal/gtk4";
import AstalNotifd from "gi://AstalNotifd";
import Notification from "./Notification";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

const hyprland = AstalHyprland.get_default();

export const sendBatch = (batch: string[]) => {
    const cmd = batch
      .filter((x) => !!x)
      .map((x) => `keyword ${x}`)
      .join("; ");
  
    hyprland.message(`[[BATCH]]/${cmd}`);
};

export default function NotificationPopup(gdkmonitor: Gdk.Monitor) {
  const { TOP } = Astal.WindowAnchor;
  const notifd = AstalNotifd.get_default();

  return (
    <window
      namespace={"notification-popup"}
      setup={(self) => {

        self.hexpand = false;
        self.vexpand = false;
        self.widthRequest = 400; 

        sendBatch([`layerrule animation slide top, ${self.namespace}`]);

        const container = Widget.Box({ vertical: true });
        self.set_child(container);

        const notificationQueue: number[] = [];
        let isProcessing = false;

        hook(self, notifd, "notified", (_, id: number) => {
          if (
            notifd.dont_disturb &&
            notifd.get_notification(id).urgency != AstalNotifd.Urgency.CRITICAL
          ) {
            return;
          }
          notificationQueue.push(id);
          processQueue();
        });

        hook(self, notifd, "resolved", (_, __) => {
          self.visible = false;
          isProcessing = false;
          timeout(300, () => {
            processQueue();
          });
        });

        function processQueue() {
          if (isProcessing || notificationQueue.length === 0) return;
          isProcessing = true;
          const id = notificationQueue.shift();

          const notification = notifd.get_notification(id!);
          if (!notification) {
            isProcessing = false;
            processQueue();
            return;
          }

          const notificationWidget = Notification({ n: notification });
        
          container.children = [notificationWidget, Widget.Box({ vexpand: true })];

          notificationWidget.measure(Gtk.Orientation.HORIZONTAL, -1);
          notificationWidget.measure(Gtk.Orientation.VERTICAL, -1);

          self.visible = true;

          timeout(5000, () => {
            self.visible = false;
            timeout(300, () => {
              container.children = [];
              isProcessing = false;
              processQueue();
            });
          });
        }
      }}
      gdkmonitor={gdkmonitor}
      application={App}
      anchor={TOP}
      cssClasses={["notification-window"]}
    ></window>
  );
}