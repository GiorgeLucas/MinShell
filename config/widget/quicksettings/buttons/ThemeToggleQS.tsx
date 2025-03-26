import AstalWp from "gi://AstalWp";
import QSButton from "../QSButton";
import { bind, GLib, Variable } from "astal";
import { App } from "astal/gtk4";
import app from "astal/gtk4/app";
import { applyTheme } from "../../../utils/styles";
import { darkTheme } from "../../../config";

export default function ThemeToggleQS() {
  
  //const darkTheme = Variable(false);

  return (
    <QSButton
      connection={[darkTheme, null]}
      iconName={"dark-mode-symbolic"}
      label={"Toggle Dark Mode"}
      onClicked={() => {
        if(darkTheme.get()){
          //App.apply_css(GLib.get_user_cache_dir() + "/dark.css")
          applyTheme("light");
          darkTheme.set(false);
        }else{
          //App.apply_css(GLib.get_user_cache_dir() + "/light.css")
          applyTheme("dark");
          darkTheme.set(true);
        }
        
      }}
    />
  );
}