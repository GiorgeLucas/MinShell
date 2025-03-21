import { App } from "astal/gtk4";
import PanelButton from "../common/PanelButton";
import AstalWp from "gi://AstalWp";
import { bind, Variable } from "astal";
import AstalPowerProfiles from "gi://AstalPowerProfiles";
import AstalNetwork from "gi://AstalNetwork";
import { WINDOW_NAME } from "../quicksettings/QSWindow";

function NetworkIcon() {
  const network = AstalNetwork.get_default();
  if (!network.wifi)
    return <image iconName={bind(network.wired, "iconName")} />;

  const icon = Variable.derive(
    [
      bind(network, "primary"),
      bind(network.wifi, "iconName"),
      bind(network.wired, "iconName"),
    ],
    (primary, wifiIcon, wiredIcon) => {
      if (
        primary == AstalNetwork.Primary.WIRED ||
        primary == AstalNetwork.Primary.UNKNOWN
      ) {
        return wiredIcon;
      } else {
        return wifiIcon;
      }
    },
  );
  return <image iconName={icon()} onDestroy={() => icon.drop()} />;
}

export default function QSPanelButton() {
  const wp = AstalWp.get_default();
  const speaker = wp?.audio.defaultSpeaker!;
  const powerprofile = AstalPowerProfiles.get_default();

  return (
    <PanelButton
      window={WINDOW_NAME}
      onClicked={() => {
        App.toggle_window(WINDOW_NAME);
      }}
    >
      <box spacing={10}>
        <NetworkIcon />
        <image iconName={bind(speaker, "volumeIcon")} />
        <image
          visible={bind(powerprofile, "activeProfile").as(
            (p) => p === "power-saver",
          )}
          iconName={`power-profile-power-saver-symbolic`}
        />
        <image
          visible={wp?.defaultMicrophone && bind(wp.default_microphone, "mute")}
          iconName="microphone-disabled-symbolic"
        />
      </box>
    </PanelButton>
  );
}