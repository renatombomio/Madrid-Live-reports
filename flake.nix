{
  description = "Madrid Live Reports — development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          name = "madrid-live-reports";

          packages = with pkgs; [
            # JavaScript runtime + package manager
            nodejs_22
            pnpm

            # Task runner (replaces make/npm scripts for multi-step workflows)
            just

            # Container tooling — use Docker Desktop on macOS, these CLI tools
            # talk to its daemon
            docker
            docker-compose

            # Database client (useful for quick inspection)
            postgresql_16

            # Code quality
            nodePackages.prettier

            # Secret generation helper
            openssl
          ];

          shellHook = ''
            echo ""
            echo "  Madrid Live Reports — dev shell"
            echo "  ─────────────────────────────────────────"
            echo "  node   $(node --version)"
            echo "  pnpm   $(pnpm --version)"
            echo "  just   $(just --version)"
            echo ""
            echo "  Quick start:"
            echo "    just setup    — install deps + copy .env"
            echo "    just db-up    — start postgres container"
            echo "    just migrate  — run DB migrations"
            echo "    just dev      — start dev server"
            echo ""

            # Auto-load .env if present
            if [ -f .env ]; then
              export $(grep -v '^#' .env | xargs)
            fi
          '';
        };
      });
}
