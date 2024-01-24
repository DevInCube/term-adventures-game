export class Performance {
    static enabled: boolean = false;

    stats: { [name: string]: { time: number; }; } = {};
    item: { name: string, startTime: Date } | null = null;

    measure(f: () => void) {
        if (!f) {
            return;
        }
        
        this.start(f.name);
        f();
        this.stop();
    }

    report() {
        if (!Performance.enabled) {
            return;
        }

        const important = Object.entries(this.stats).filter(x => x[1].time > 0);
        for (const [name, stat] of important) {
            console.log({ name, time: stat.time });
        }
    }

    start(name: string) {
        this.item = { name, startTime: new Date() };
    }

    stop() {
        if (!this.item) {
            return;
        }

        this.stats[this.item.name] = { time: new Date().getMilliseconds() - this.item.startTime.getMilliseconds() }; 
    }
}
