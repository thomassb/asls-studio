import * as three from 'three';

const THREE = window.THREE = three;

/**
 * @class
 * @classdesc Singleton extension of THREE.Scene class
 * @extends THREE.Scene
 */
class SceneManager extends THREE.Scene {
  constructor() {
    if (!instance) {
      super();
      this.background = new THREE.Color('#0C0D0A');
      instance = this;
    }
    return instance;
  }
}

var instance = new SceneManager();
export default instance;
