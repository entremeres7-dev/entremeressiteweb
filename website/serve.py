#!/usr/bin/env python3
"""Serve le site statique avec repli SPA pour l'app Expo (/app/*)."""

from __future__ import annotations

import http.server
import os
import socketserver
from pathlib import Path

PORT = int(os.environ.get("PORT", "8765"))
ROOT = Path(__file__).resolve().parent
APP_INDEX = ROOT / "app" / "index.html"


class ThreadingHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


class SpaHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self) -> None:
        path = self.path.split("?", 1)[0]
        if path.startswith("/app/_expo/") or path.endswith(".js"):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def send_head(self):
        fs_path = self.translate_path(self.path)
        if not os.path.exists(fs_path):
            clean = self.path.split("?", 1)[0].split("#", 1)[0]
            if clean == "/app" or clean.startswith("/app/"):
                if not APP_INDEX.is_file():
                    self.send_error(
                        404,
                        "Application web non générée",
                        "Lancez npm run build:web depuis EntreMeresExpo/",
                    )
                    return None
                saved = self.path
                self.path = "/app/index.html"
                try:
                    return super().send_head()
                finally:
                    self.path = saved
        return super().send_head()

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")


def main() -> None:
    os.chdir(ROOT)
    with ThreadingHTTPServer(("", PORT), SpaHandler) as httpd:
        print(f"Site : http://localhost:{PORT}/")
        print(f"App  : http://localhost:{PORT}/app/ (repli SPA activé)")
        if not APP_INDEX.is_file():
            print("Attention : app/index.html absent — exécutez npm run build:web")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
