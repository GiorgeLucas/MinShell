import networkSpeed from "../../utils/networkspeed";
import PanelButton from "../common/PanelButton";

export default function NetworkSpeedPanelButton() {
  return (
    <PanelButton window="">
      <label
          cssClasses={["panel-btn__label"]}
          label={networkSpeed((value) => {
            const downloadSpeed = value.download;
            const uploadSpeed = value.upload;
            const higherSpeed =
              downloadSpeed >= uploadSpeed ? downloadSpeed : uploadSpeed;

            const speed = (higherSpeed / 1000).toFixed(2);

            const symbol = downloadSpeed >= uploadSpeed ? "" : "";

            return `${speed} MB/s ${symbol}`;
          })}
        />
    </PanelButton>
  );
}