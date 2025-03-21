import { GLib, Variable } from "astal";
import { App,  } from "astal/gtk4";
import PanelButton from "../common/PanelButton";
import { WINDOW_NAME } from "../datemenu/Datemenu";

const now = () => GLib.DateTime.new_now_local().format("%Y-%m-%d_%H-%M-%S");

const time = Variable(GLib.DateTime.new_now_local()).poll(1000, () =>
    GLib.DateTime.new_now_local(),
);

export default function TimePanelButton({ format = "%H:%M" }) {
  function onClick(){
    if(App.get_window(WINDOW_NAME)){
      App.toggle_window(WINDOW_NAME);
    }else{
      
    }
  }

  return (
    <PanelButton
      window={WINDOW_NAME}
      onClicked={onClick}
    >
      <label label={time((t) => t.format(format)!)} />
    </PanelButton>
  );
}