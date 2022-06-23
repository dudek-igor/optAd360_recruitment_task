import "./style.css";
import { ToggleBackground } from "./services";
/**
 * @class BoostrapProject
 * @info  Class responsible for run services after browser window is loaded
 */
class BoostrapProject {
  constructor(public window: Window) {
    this.init();
  }
  init() {
    this.window.onload = () => {
      new ToggleBackground(this.window);
    };
  }
}

window && new BoostrapProject(window);
