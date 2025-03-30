import { App, Gdk, Gtk } from "astal/gtk4";
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
import PowerMenu from "../powermenu/PowerMenu";
import WallpaperToggleQS from "./buttons/WallpaperToggleQS";
import ThemeToggleQS from "./buttons/ThemeToggleQS";

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
      <WallpaperToggleQS />
      <ThemeToggleQS />
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
                <>
                  <MediaPlayer player={player} />
                  <Gtk.Separator />
                </>
              ))}
            </>
          ) : <Gtk.Separator />
        ))}
    </>
  )
}

function Header(){
  return (
    <box hexpand={true} cssClasses={["qs-box__header"]} spacing={6}>
      <label label={"Quick Settings"} hexpand xalign={0} valign={Gtk.Align.CENTER} />
      <PowerMenu />
    </box>
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
        cssClasses={["window-content", "qs-box"]}
        vertical
        spacing={10}
      >
        <Header />
        <Gtk.Separator />
        <QSButtons />
        <MediaPLayerList />
        <VolumeBox />
      </box>
    </PopupWindow>
  )
}