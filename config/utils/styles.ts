import { Gio, GLib } from "astal";
import { bash } from ".";
import { App } from "astal/gtk4";

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