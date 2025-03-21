import { timeout } from "astal";
import { App, Astal, hook, Gdk } from "astal/gtk4";
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
        sendBatch([`layerrule animation slide top, ${self.namespace}`]);
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
            // Chama processQueue novamente para processar a próxima notificação na fila
            processQueue();
            return;
          }

          self.set_child(
            <box vertical>
              {Notification({ n: notifd.get_notification(id!) })}
              <box vexpand />
            </box>,
          );
          self.visible = true;

          timeout(5000, () => {
            self.visible = false;
            isProcessing = false;
            self.set_child(null);
            timeout(300, () => {
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