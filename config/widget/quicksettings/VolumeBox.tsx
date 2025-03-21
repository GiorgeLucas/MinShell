import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import AstalWp from "gi://AstalWp";

export default function VolumeBox() {
  const speaker = AstalWp.get_default()?.audio!.defaultSpeaker!;

  const isMuted = Variable(false);

  function mute(){
    if(isMuted.get()){
        isMuted.set(false);
        speaker.volume = 1;
    }else{
        isMuted.set(true);
        speaker.volume = 0;
    }
  }

  return (
    
    <box
      cssClasses={["qs-box", "volume-box"]}
      valign={Gtk.Align.CENTER}
      spacing={10}
    >
        <button onClicked={mute}>
            <image iconName={bind(speaker, "volumeIcon")} valign={Gtk.Align.CENTER} />  
        </button>
      
      <slider
        onChangeValue={(self) => {
          speaker.volume = self.value;
        }}
        value={bind(speaker, "volume")}
        max={1.53}
        hexpand
      />
    </box>
  );
}