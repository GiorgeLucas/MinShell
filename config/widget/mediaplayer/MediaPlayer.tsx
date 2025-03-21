import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import AstalMpris from "gi://AstalMpris";
import Pango from "gi://Pango";

export default function MediaPlayer({ player } : {player: AstalMpris.Player}) {
  if (!player) {
    return <box />;
  }
  const title = bind(player, "title").as((t) => t || "Unknown Track");
  const artist = bind(player, "artist").as((a) => a || "Unknown Artist");
  const coverArt = bind(player, "coverArt").as((c) => c || "audio-x-generic-symbolic");

  const playIcon = bind(player, "playbackStatus").as((s) =>
    s === AstalMpris.PlaybackStatus.PLAYING
      ? "media-playback-pause-symbolic"
      : "media-playback-start-symbolic",
  );

  return (
    <box cssClasses={["media-player"]} hexpand>
      <image
        overflow={Gtk.Overflow.HIDDEN}
        pixelSize={65}
        cssClasses={["cover"]}
        file={coverArt}
      />
      <box vertical hexpand>
        <label
          ellipsize={Pango.EllipsizeMode.END}
          halign={Gtk.Align.START}
          label={title}
          maxWidthChars={15}
        />
        <label halign={Gtk.Align.START} label={artist} />
      </box>
      <button
        halign={Gtk.Align.END}
        valign={Gtk.Align.END}
        onClicked={() => player.previous()}
        visible={bind(player, "canGoPrevious")}
      >
        <image iconName="media-skip-backward-symbolic" pixelSize={24} />
      </button>
      <button
        halign={Gtk.Align.END}
        valign={Gtk.Align.END}
        onClicked={() => player.play_pause()}
        visible={bind(player, "canControl")}
      >
        <image iconName={playIcon} pixelSize={24} />
      </button>
      <button
        halign={Gtk.Align.END}
        valign={Gtk.Align.END}
        onClicked={() => player.next()}
        visible={bind(player, "canGoNext")}
      >
        <image iconName="media-skip-forward-symbolic" pixelSize={24} />
      </button>
    </box>
  );
}