import { basename } from "path";
import { platform } from "os";

const addon = require("bindings")("addon");

interface Process {
  id: number;
  name: string;
  path: string;
}

interface Rectangle {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export class Window {
  public handle: number;
  public process: Process;

  constructor(handle: number) {
    this.handle = handle;

    const processId = addon.getWindowProcessId(handle);
    const processPath = addon.getProcessPath(processId);

    this.process = {
      id: processId,
      path: processPath,
      name: basename(processPath)
    };
  }

  getBounds() {
    if (platform() !== "win32") return;

    return addon.getWindowBounds(this.handle);
  }

  setBounds(bounds: Rectangle) {
    if (platform() !== "win32") return;

    const newBounds = { ...this.getBounds(), ...bounds };

    addon.setWindowBounds(this.handle, newBounds);
  }

  getTitle() {
    if (platform() !== "win32") return;

    return addon.getWindowTitle(this.handle);
  }

  getMonitor() {
    if (platform() !== "win32") return;

    return addon.getMonitorFromWindow(this.handle);
  }
}
