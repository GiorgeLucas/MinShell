import { execAsync, Gio, GLib, Variable } from "astal";
import GdkPixbuf from "gi://GdkPixbuf";
import { cacheImage, sh } from ".";

export class Wallpaper {
  filename: string;
  path: string;
  cachePath: string;
  isDark: boolean;

  constructor(filename: string, isDark: boolean) {
    this.filename = filename;
    this.path = `${wallpapersManager.wallpapersFolder}/${filename}`;
    this.cachePath = `${GLib.get_user_cache_dir()}/Wallpapers/${filename}`;
    this.isDark = isDark;
  }
}

export class WallpapersManager {
  static #instance: WallpapersManager;

  private constructor() {

  }

  static get instance(): WallpapersManager {
    if (!this.#instance) {
      this.#instance = new WallpapersManager();
    }
    return this.#instance;
  }

  wallpapersFolder: string = GLib.get_home_dir() + "/Wallpapers";
  cacheFolder: string = `${GLib.get_user_cache_dir()}/Wallpapers`;
  oldCache = "";
  wallpapersObjectsList: Variable<Wallpaper[]>  = Variable([]);
  #imageFormats = [".jpeg", ".jpg", ".webp", ".png"];

  generateCache() {
    if(!GLib.file_test(this.cacheFolder, GLib.FileTest.EXISTS)){
      GLib.mkdir(this.cacheFolder, 0o755);
    }

    const wallpapersToCache = this.wallpapersObjectsList.get().filter(
      (wallpaperObj) =>
        !GLib.file_test(
          `${wallpaperObj.cachePath}`,
          GLib.FileTest.EXISTS,
        ),
    );

    wallpapersToCache.forEach((wallpaperObj) => {
      cacheImage(`${wallpaperObj.path}`, wallpapersManager.cacheFolder, 200);
    });
  }

  private loadWallpapersFolder() {
    const dir = Gio.file_new_for_path(this.wallpapersFolder);
    const fileEnum = dir.enumerate_children(
      "standard::name",
      Gio.FileQueryInfoFlags.NONE,
      null,
    );

    const files: string[] = [];
    let i = fileEnum.next_file(null);
    while (i) {
      let fileName = i.get_name();
      if (this.#imageFormats.some((fmt) => fileName.endsWith(fmt))) {
        files.push(fileName);
      }
      i = fileEnum.next_file(null);
    }
    return files;
  }

  private isDarkWallpaper(wallpaperPath: string): boolean {
    try {
      // Carrega o arquivo diretamente como Pixbuf
      const pixbuf = GdkPixbuf.Pixbuf.new_from_file(wallpaperPath);

      // Amostra a cada 10 pixels para melhor performance
      const step = 10;
      let total = 0;
      let count = 0;
      const pixels = pixbuf.get_pixels();
      const rowstride = pixbuf.get_rowstride();
      const channels = pixbuf.get_n_channels();

      for (let y = 0; y < pixbuf.get_height(); y += step) {
        for (let x = 0; x < pixbuf.get_width(); x += step) {
          const offset = y * rowstride + x * channels;
          const r = pixels[offset];
          const g = pixels[offset + 1];
          const b = pixels[offset + 2];
          total += (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          count++;
        }
      }
      return (total / count) < 0.5;
    } catch (e) {
      console.error("Erro ao analisar wallpaper: ", e);
      return false;
    }
  }

  updateWallpapersObjectsList() {
    const wallpapersImageList = this.loadWallpapersFolder();
    wallpapersImageList.forEach((image) => {
      if (!this.wallpapersObjectsList.get().some((wallpaper) => wallpaper.filename == image)) {
        const path = `${this.wallpapersFolder}/${image}`;
        this.wallpapersObjectsList.set([...this.wallpapersObjectsList.get(), new Wallpaper(image, this.isDarkWallpaper(path))])
        console.log("Adicionado novo Wallpaper: [Filename]:" + image);
      }
    });
    this.wallpapersObjectsList.set(this.wallpapersObjectsList.get().filter((wallpaper) => GLib.file_test(wallpaper.path, GLib.FileTest.EXISTS)));
    this.generateCache();
    console.log(this.wallpapersObjectsList.get());
  }

  private initWallpapersObjectsList() {
    const wallpapersImageList = this.loadWallpapersFolder();
    wallpapersImageList.forEach((image) => {
      const path = `${this.wallpapersFolder}/${image}`;
      const wallpaper = new Wallpaper(image, this.isDarkWallpaper(path));
      this.wallpapersObjectsList.set([...this.wallpapersObjectsList.get(), wallpaper]);
    });
    console.log(this.wallpapersObjectsList.get());
  }

  init() {
    this.initWallpapersObjectsList();
    this.generateCache();
  }

  async getCurrentWallpaper(): Promise<string> {
    try {
      const out = await execAsync("swww query");
      const value = out.split("image:")[1]?.trim() || "";
      return value;
    } catch (e) {
      console.error("Erro ao obter o wallpaper atual:", e);
      return "";
    }
  }

  setCurrentWallpaper(wallpaper: Wallpaper) {
    sh([
      "swww",
      "img",
      "--transition-type",
      "wave",
      `${wallpaper.path}`,
    ]).then(() => {
      if (this.oldCache === "") {
        const cacheDir = Gio.File.new_for_path(this.cacheFolder);
        const enumerator = cacheDir.enumerate_children(
          'standard::name',
          Gio.FileQueryInfoFlags.NONE,
          null
        );

        let fileInfo;
        while ((fileInfo = enumerator.next_file(null)) !== null) {
          const fileName = fileInfo.get_name();
          if (fileName.includes('current')) {
            this.oldCache = GLib.build_filenamev([this.cacheFolder, fileName]);
            break;
          }
        }
        enumerator.close(null);
      }

      if (GLib.file_test(this.oldCache, GLib.FileTest.EXISTS)) {
        GLib.remove(this.oldCache);
      }

      if (GLib.file_test(`${wallpaper.path}`, GLib.FileTest.EXISTS)) {

        this.oldCache = cacheImage(
          `${wallpaper.path}`,
          this.cacheFolder,
          450,
          `${wallpaper.filename.split(".").shift()}_current`
        );
      }

    }).catch((e) => console.log(e));
  }
}

// _current é realmente necessário? 
// Eu posso colocar uma propriedade no wallpaper manager 
// que aponta para o wallpaper atual.

export const wallpapersManager = WallpapersManager.instance;
