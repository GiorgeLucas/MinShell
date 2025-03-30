import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import AstalTray from "gi://AstalTray?version=0.1";

export default function TrayPanelButton() {
  const tray = AstalTray.get_default();
  return (
    <box cssClasses={["tray-box"]} spacing={6}>
      {bind(tray, "items").as((items) =>
        items.map((item) => (
          <menubutton
            cssClasses={["tray-box__btn"]}
            setup={(self) => {
              self.insert_action_group("dbusmenu", item.actionGroup);
            }}
            tooltipText={bind(item, "tooltipMarkup")}
          >
            <image cssClasses={["tray-box__img"]} gicon={bind(item, "gicon")} />
            {Gtk.PopoverMenu.new_from_model(item.menuModel)}
          </menubutton>
        )),
      )}
    </box>
  
  );
}