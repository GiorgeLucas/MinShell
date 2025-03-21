import { bind, Binding, GObject, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import { ButtonProps, MenuButtonProps } from "astal/gtk4/widget";

type QSMenuButtonProps = MenuButtonProps & {
  child?: unknown;
  iconName: string;
  label: string;
};

export function QSMenuButton({
  child,
  iconName,
  label,
  setup,
}: QSMenuButtonProps) {
  return (
    <menubutton setup={setup} tooltipText={label} cssClasses={["qs-button"]}>
      <image halign={Gtk.Align.CENTER} iconName={iconName} />
      {child}
    </menubutton>
  );
}

type QSButtonProps<T extends GObject.Object> = ButtonProps & {
  iconName: string | Binding<String>;
  label: string | Binding<String>;
  cssClasses?: string[];
  connection?: [
    T | Variable<any>,
    keyof T | null,
    ((arg0: any) => boolean)?,
  ];
};

export default function QSButton<T extends GObject.Object>({
  iconName,
  label,
  setup,
  onClicked,
  connection,
} :  QSButtonProps<T>) {

  function getCssClasses(): string[] | Binding<string[]> {
    if (!connection) return ["qs-button"];

    const [object, property, cond] = connection;
    const computeClasses = (v: any) => {
      const classes = ["qs-button"];
      if (cond ? cond(v) : v) classes.push("active");
      return classes;
    };

    return object instanceof Variable
      ? bind(object).as(computeClasses)
      : property != null
        ? bind(object, property).as(computeClasses)
        : ["qs-button"];
  }

  return (
    <button
      setup={setup}
      cssClasses={getCssClasses()}
      onClicked={onClicked}
      tooltipText={label}
    >
      <image iconName={iconName} halign={Gtk.Align.CENTER} />
    </button>
  );
}