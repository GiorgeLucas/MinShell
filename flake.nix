{
  description = "MinShell - AGS/Astal Configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: {
    packages.x86_64-linux.minShell = nixpkgs.legacyPackages.x86_64-linux.stdenv.mkDerivation {
      name = "minShell";
      src = ./.;  # Pega todo o conteúdo do diretório atual

      buildInputs = [
        nixpkgs.legacyPackages.x86_64-linux.ags  # Dependência do ags
      ];

      installPhase = ''
        mkdir -p $out/bin

        # Cria um script que roda o ags com a configuração
        echo "#!${nixpkgs.legacyPackages.x86_64-linux.bash}/bin/bash" > $out/bin/minShell
        echo "ags run --gtk4 -d $out/share/minShell/config" >> $out/bin/minShell
        chmod +x $out/bin/minShell

        # Copia a configuração do ags para o diretório do pacote
        mkdir -p $out/share/minShell/config
        cp -r ${./config}/* $out/share/minShell/config
      '';
    };
    packages.x86_64-linux.default = self.packages.x86_64-linux.minShell;
  };
}
