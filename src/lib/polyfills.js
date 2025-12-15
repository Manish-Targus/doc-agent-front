// lib/polyfills.js or in your _app.tsx
if (typeof window === 'undefined') {
  global.DOMMatrix = class DOMMatrix {
    constructor(init) {
      if (init) {
        this.m41 = 0; // e
        this.m42 = 0; // f
      }
    }
    
    multiply() {
      return this;
    }
    
    inverse() {
      return this;
    }
    
    translate() {
      return this;
    }
    
    scale() {
      return this;
    }
    
    // Add other necessary methods
  };
}