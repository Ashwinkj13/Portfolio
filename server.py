import http.server
import socketserver
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable caching for frames, assets, and scripts to guarantee instantaneous loading
        if self.path.startswith('/frames/') or self.path.startswith('/frames_alpha/') or self.path.startswith('/frames_png/') or self.path.startswith('/assets/') or self.path.endswith('.js') or self.path.endswith('.webp') or self.path.endswith('.png') or self.path.endswith('.jpg'):
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
        else:
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Suppress routine 200/304 logs for frame requests to keep terminal clean
        if args and ('/frames/' in str(args[0]) or '/frames_alpha/' in str(args[0]) or '/frames_png/' in str(args[0]) or '/lenis.min.js' in str(args[0])):
            return
        super().log_message(format, *args)

def main():
    # Allow address reuse
    socketserver.TCPServer.allow_reuse_address = True
    with http.server.ThreadingHTTPServer(("", PORT), Handler) as httpd:
        print(f"Server started at http://localhost:{PORT}")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass

if __name__ == '__main__':
    main()

