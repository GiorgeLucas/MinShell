import { execAsync, Gio, GLib, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import GdkPixbuf from "gi://GdkPixbuf";

export function ensureDirectory(path: string) {
  if (!GLib.file_test(path, GLib.FileTest.EXISTS))
    Gio.File.new_for_path(path).make_directory_with_parents(null);
}

export function cacheImage(
  inputPath: string,
  cachePath: string,
  newWidth: number,
  customName?: string,
  fastest?: boolean,
) {
  const baseName = GLib.path_get_basename(inputPath);
  const extension = baseName.split(".").pop()!.toLowerCase();
  const outputFileName = customName ? `${customName}.${extension}` : baseName;
  const outputPath = `${cachePath}/${outputFileName}`;

  try {
    let pixbuf = GdkPixbuf.Pixbuf.new_from_file(inputPath);

    const aspectRatio = pixbuf.get_width() / pixbuf.get_height();
    const scaledHeight = Math.round(newWidth / aspectRatio);

    const scaledPixbuf = pixbuf.scale_simple(
      newWidth,
      scaledHeight,
      fastest ? GdkPixbuf.InterpType.NEAREST : GdkPixbuf.InterpType.BILINEAR,
    );

    const outputFormat = extension === "png" ? "png" : "jpeg";
    scaledPixbuf?.savev(outputPath, outputFormat, [], []);

    return outputPath;
  } catch {
    const black_pixbuf = GdkPixbuf.Pixbuf.new(
      GdkPixbuf.Colorspace.RGB,
      true,
      8,
      newWidth,
      (newWidth * 9) / 16,
    );
    black_pixbuf.fill(0x0);
    black_pixbuf.savev(outputPath, "jpeg", [], []);
    return outputPath;
  }
}

export async function launchDefaultAsync(uri: string) {
  return new Promise((resolve, reject) => {
    Gio.AppInfo.launch_default_for_uri_async(uri, null, null, (_, res) => {
      try {
        resolve(Gio.AppInfo.launch_default_for_uri_finish(res));
      } catch (error) {
        reject(error);
      }
    });
  });
}

export const now = () =>
  GLib.DateTime.new_now_local().format("%Y-%m-%d_%H-%M-%S");

export const time = Variable(GLib.DateTime.new_now_local()).poll(1000, () =>
  GLib.DateTime.new_now_local(),
);

export function range(max: number) {
  return Array.from({ length: max + 1 }, (_, i) => i);
}

type NotifUrgency = "low" | "normal" | "critical";
export function notifySend({
  appName,
  appIcon,
  urgency = "normal",
  image,
  icon,
  summary,
  body,
  actions,
}: {
  appName?: string;
  appIcon?: string;
  urgency?: NotifUrgency;
  image?: string;
  icon?: string;
  summary: string;
  body: string;
  actions?: {
    [label: string]: () => void;
  };
}) {
  const actionsArray = Object.entries(actions || {}).map(
    ([label, callback], i) => ({
      id: `${i}`,
      label,
      callback,
    }),
  );
  execAsync(
    [
      "notify-send",
      `-u ${urgency}`,
      appIcon && `-i ${appIcon}`,
      `-h "string:image-path:${!!icon ? icon : image}"`,
      `"${summary ?? ""}"`,
      `"${body ?? ""}"`,
      `-a "${appName ?? ""}"`,
      ...actionsArray.map((v) => `--action=\"${v.id}=${v.label}\"`),
    ].join(" "),
  )
    .then((out) => {
      if (!isNaN(Number(out.trim())) && out.trim() !== "") {
        actionsArray[parseInt(out)].callback();
      }
    })
    .catch(console.error);
}

export async function sh(cmd: string | string[]) {
  return execAsync(cmd).catch((err) => {
    console.error(typeof cmd === "string" ? cmd : cmd.join(" "), err);
    return "";
  });
}

export async function bash(strings: string | string[], ...values: unknown[]) {
  const cmd =
    typeof strings === "string"
      ? strings
      : strings.flatMap((str, i) => str + `${values[i] ?? ""}`).join("");

  return execAsync(["bash", "-c", cmd]).catch((err) => {
    console.error(cmd, err);
    return "";
  });
}

export const gsettings = new Gio.Settings({
  schema: "org.gnome.desktop.interface",
});

export const cacheDir = `${GLib.get_user_cache_dir()}/epik-shell`;

export function separatorBetween(
  elements: Gtk.Widget[],
  orientation: Gtk.Orientation,
) {
  const spacedElements: Gtk.Widget[] = [];

  elements.forEach((element, index) => {
    if (index > 0) {
      spacedElements.push(new Gtk.Separator({ orientation: orientation }));
    }
    spacedElements.push(element);
  });

  return spacedElements;
}


