import { Vector2 } from "../engine/math/Vector2";
import { UIPanel } from "./UIPanel";
import { UIText } from "./UIText";
import { Color } from "../engine/math/Color";
import { UIElement } from "./UIElement";
import { createTextObjectSkin } from "../utils/misc";

export class UIDebugPanel extends UIPanel {
    private fpsText: UIText;
    private upsText: UIText;
    
    private frameCount: number = 0;
    private updateCount: number = 0;
    private lastTime: number = 0;
    private fps: number = 0;
    private ups: number = 0;

    constructor(parent: UIElement | null, position: Vector2) {
        const size = new Vector2(12, 4);
        super(parent, position, size);

        // Hide by default
        this.visible = false;

        // Create FPS text
        this.fpsText = new UIText(
            this,
            "FPS: 0",
            Color.fromHexString('#00FF00'),
            undefined
        );
        this.fpsText.position = new Vector2(1, 1);

        // Create UPS text
        this.upsText = new UIText(
            this,
            "UPS: 0",
            Color.fromHexString('#00FFFF'),
            undefined
        );
        this.upsText.position = new Vector2(1, 2);
    }

    toggle(): void {
        this.visible = !this.visible;
    }

    update(ticks: number): void {
        super.update(ticks);
        
        // Update the counter for updates per second
        this.updateCount++;
    }

    // Called when a frame is rendered
    onFrameRendered(): void {
        this.frameCount++;
        
        const currentTime = performance.now();
        
        // Calculate FPS and UPS every second
        if (this.lastTime === 0) {
            this.lastTime = currentTime;
        }
        
        const elapsed = currentTime - this.lastTime;
        if (elapsed >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / elapsed);
            this.ups = Math.round((this.updateCount * 1000) / elapsed);
            
            // Update text displays
            this.fpsText.text = `FPS: ${this.fps}`;
            this.upsText.text = `UPS: ${this.ups}`;
            
            // Recreate skins with new text
            this.fpsText.skin = createTextObjectSkin(this.fpsText.text, this.fpsText.color, undefined);
            this.upsText.skin = createTextObjectSkin(this.upsText.text, this.upsText.color, undefined);
            
            // Reset counters
            this.frameCount = 0;
            this.updateCount = 0;
            this.lastTime = currentTime;
        }
    }
}

