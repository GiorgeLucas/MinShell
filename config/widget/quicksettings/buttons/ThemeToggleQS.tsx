import AstalWp from "gi://AstalWp";
import QSButton from "../QSButton";
import { bind, GLib, Variable } from "astal";
import { App } from "astal/gtk4";
import app from "astal/gtk4/app";

export default function ThemeToggleQS() {
  
  const darkTheme = Variable(false);

  return (
    <QSButton
      connection={[darkTheme, null]}
      iconName={"dark-mode-symbolic"}
      label={"Toggle Dark Mode"}
      onClicked={() => {
        if(darkTheme.get()){
          App.apply_css(GLib.get_user_cache_dir() + "/DarkTheme.css")
          darkTheme.set(false);
        }else{
          App.apply_css(GLib.get_user_cache_dir() + "/LightTheme.css")
          darkTheme.set(true);
        }
        
      }}
    />
  );
}