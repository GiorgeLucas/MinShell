import { Gdk, Gtk } from "astal/gtk4";
import PopupWindow from "../common/PopupWindow";
import VolumeBox from "./VolumeBox";
import ColorPickerQS from "./buttons/ColorPickerQS";
import ScreenshotQS from "./buttons/ScreenshotQS";
import { FlowBox } from "../common/FlowBox";
import DontDisturbQS from "./buttons/DontDisturbQS";
import MicQS from "./buttons/MicQS";
import MediaPlayer from "../mediaplayer/MediaPlayer";
import { bind } from "astal";
import AstalMpris from "gi://AstalMpris";

export const WINDOW_NAME = "quicksettings";

function QSButtons() {
  return (
    <FlowBox
      maxChildrenPerLine={3}
      activateOnSingleClick={false}
      homogeneous
      rowSpacing={6}
      columnSpacing={6}
    >
      <ColorPickerQS />
      <ScreenshotQS />
      <DontDisturbQS />
      <MicQS />
    </FlowBox>
  );
}

function MediaPLayerList(){
  const mpris = AstalMpris.get_default();
  return (
    <>
      {bind(mpris, "players").as((players) => (
          players.length > 0 ? (
            <>
              <Gtk.Separator />
              {players.map((player) => (
                <MediaPlayer player={player} />
              ))}
            </>
          ) : null
        ))}
    </>
  )
}

export default function QSWindow(_gdkmonitor: Gdk.Monitor) {
  
  return (
    <PopupWindow
      name={WINDOW_NAME}
      animation="slide right"
      layout="top_right"
    >
      <box
        cssClasses={["window-content", "qs-container"]}
        vertical
        spacing={10}
      >
        <QSButtons />
        <MediaPLayerList />
        <Gtk.Separator />
        <VolumeBox />
      </box>
    </PopupWindow>
  )
}