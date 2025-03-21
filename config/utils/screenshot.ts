import { GLib } from "astal";
import { bash, ensureDirectory, notifySend, sh, now } from ".";

const HOME = GLib.get_home_dir();

class ScreenRecord {
  private static instance: ScreenRecord;
  private screenshots = `${HOME}/Pictures`;
  private file = "";

  static get_default(): ScreenRecord {
    if (!this.instance) {
      this.instance = new ScreenRecord();
    }
    return this.instance;
  }

  async screenshot(full = false) {
    const file = `${this.screenshots}/${now()}.png`;

    ensureDirectory(this.screenshots);
    if (full) {
      await sh(`wayshot -f ${file}`);
    } else {
      const size = await sh("slurp -b#00000066 -w 0");
      if (!size) return;

      await sh(`wayshot -f ${file} -s "${size}"`);
    }


    bash(`wl-copy < ${this.file}`);

    notifySend({
      image: this.file,
      appName: "Screenshot",
      summary: "Screenshot saved",
      body: `Available in ${this.screenshots}`,
      actions: {
        "Show in Files": () => sh(`xdg-open ${this.screenshots}`),
        View: () => sh(`xdg-open ${this.file}`),
        Edit: () => sh(`swappy -f ${this.file}`)
      }
    });
  }
}

export default ScreenRecord;
