import Powermenu from "../../utils/powermenu";

const powermenu = Powermenu.get_default();

const icons = {
  sleep: "weather-clear-night-symbolic",
  reboot: "system-reboot-symbolic",
  logout: "system-log-out-symbolic",
  shutdown: "system-shutdown-symbolic",
};

function SysButton({ action, label }: { action: string; label: string }) {
  return (
    <button
      onClicked={() => powermenu.action(action)}
      tooltipText={label}
    >
      <image iconName={icons[action]} />
    </button>
  );
}

export default function PowerMenu() {
  return (
    <>
      <SysButton action={"sleep"} label={"Sleep"} />
      <SysButton action={"logout"} label={"Log Out"} />
      <SysButton action={"reboot"} label={"Reboot"} />
      <SysButton action={"shutdown"} label={"Shutdown"} />
    </>
  );
}
