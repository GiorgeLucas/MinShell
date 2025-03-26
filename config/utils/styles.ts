import { Gio, GLib } from "astal";
import { bash } from ".";
import { App } from "astal/gtk4";
import GdkPixbuf from "gi://GdkPixbuf";

async function compileTheme(theme: string ) {
  const inputFile = `${GLib.get_current_dir()}/styles/themes/${theme}/index.scss`;
  
   // Verificar se arquivo de entrada existe
   const file = Gio.File.new_for_path(inputFile);
   if (!file.query_exists(null)) {
     console.error(`Arquivo ${inputFile} não existe!`);
     return;
   }

  const outputFile = `${GLib.get_user_cache_dir()}/${theme}.css`;

  try {
    await bash(`sass ${inputFile} ${outputFile}`);
    console.log(`✅ Tema ${theme} compilado em ${outputFile}`);
  } catch (error) {
    console.error(`❌ Falha ao compilar ${theme}:`, error);
  }
}

export function applyTheme(theme: string) {
  const cssFile = `${GLib.get_user_cache_dir()}/${theme}.css`;
  App.apply_css(cssFile, true); 
  console.log(`🎨 Tema ${theme} aplicado!`);
}

export async function initThemes() {
  await compileTheme("light");
  await compileTheme("dark");
}

export function isDarkWallpaper(wallpaperPath: string): boolean {
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
      console.log((total / count) < 0.5);
      return (total / count) < 0.5;
  } catch (e) {
      console.error("Erro ao analisar wallpaper:", e);
      return false;
  }
}
