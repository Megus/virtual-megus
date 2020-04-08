// Visualizer
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Visualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.events = [];

        this.dotColors = [
            '#ffffff',
            '#df8040',
            '#30d040',
            '#4060ef',
            '#506050',
            '#708070',
            '#30d040',
            '#ffff00',
        ];


        this.draw = this.draw.bind(this);
        this.onStep = this.onStep.bind(this);
        this.onEvent = this.onEvent.bind(this);

        this.initStepVisuals();
        this.initNoteVisuals();

        window.requestAnimationFrame(this.draw);
    }

    /**
     * Set sequencer for this visualizer
     *
     * @param {Sequencer} sequencer
     */
    setSequencer(sequencer) {
        this.sequencer = sequencer;

        sequencer.addStepCallback(this.onStep);
        sequencer.addEventCallback(this.onEvent);

        this.lastTime = null;
    }

    // Sequencer events
    onStep(time, step) {
        this.events.push({type: 'step', time: time, data: step});
    }

    onEvent(time, unitId, event) {
        this.events.push({type: event.type, time: time, unit: unitId, data: event.data});
    }

    // Main drawing function
    draw(drawTime) {
        let currentTime = drawTime;
        if (this.sequencer != null) {
            currentTime = this.sequencer.context.currentTime;
        }
        if (this.lastTime == null) { this.lastTime = currentTime; }
        const timeDiff = currentTime - this.lastTime;
        this.lastTime = currentTime;

        const ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, this.width, this.height);

        // Get events
        const events = this.events.filter(event => event.time <= currentTime);

        events.forEach((event) => {
            if (event.type == 'step') {
                this.handleStepEvent(event);
            } else {
                this.handleNoteEvent(event);
            }
        });

        this.drawNoteVisuals(ctx, timeDiff);
        this.drawStepVisuals(ctx, timeDiff);

        this.events = this.events.filter(event => event.time > currentTime);

        window.requestAnimationFrame(this.draw);
    }

    // Step visuals
    initStepVisuals() {
        this.logoSize = 1.0;
        this.logoSpeed = 1.0;
        this.logoScales = [];
    }

    handleStepEvent(event) {
        if (event.data % 4 == 0) {
            this.logoSize = 1.5;
            this.logoSpeed = 1.0;
        }
    }

    drawStepVisuals(ctx, timeDiff) {
        this.logoScales.push(this.logoSize * 0.9);

        // Draw Megus logo
        ctx.save();
        ctx.translate(this.width / 2, this.height / 2);
        for (let c = 0; c < this.logoScales.length; c++) {
            const scale = this.logoScales[c];
            let alpha = (c + 1) / this.logoScales.length;
            alpha *= alpha;
            const gradient = ctx.createLinearGradient(132 * scale, -232 * scale, 234 * scale, 94 * scale);
            gradient.addColorStop(0, this.lightColorWithOpacity(16, 89, 199, alpha, scale * 2 - 0.8));
            gradient.addColorStop(1, this.lightColorWithOpacity(17, 69, 148, alpha, scale * 2 - 0.8));
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(132 * scale, -232 * scale);
            ctx.lineTo(234 * scale, 94 * scale);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-132 * scale, -232 * scale);
            ctx.lineTo(-234 * scale, 94 * scale);
            ctx.fill();
        }
        ctx.restore();

        if (this.logoScales.length > 6) {
            this.logoScales.splice(0, 1);
        }

        this.logoSize -= timeDiff * this.logoSpeed;
        this.logoSpeed += 7 * timeDiff;
        if (this.logoSize < 1.0) {
            this.logoSize = 1.0;
        }

    }

    // Note visuals
    initNoteVisuals() {
        this.unitVisuals = {};
    }

    handleNoteEvent(event) {
        const unitType = event.unit.substring(0, 8);

        // Create new visuals for a unit
        if (this.unitVisuals[event.unit] == null) {
            if (unitType == 'drummach') {
                this.unitVisuals[event.unit] = {
                    type: 'dots',
                    dots: [],
                };
            } else {
                this.unitVisuals[event.unit] = {
                    type: 'shape',
                    shapes: [],
                    width: 1,
                    color: this.randomColor(),
                    points: [[Math.random(), Math.random()], [Math.random(), Math.random()], [Math.random(), Math.random()]],
                    speeds: [[Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5]],
                };
            }
        }

        const visuals = this.unitVisuals[event.unit];
        if (visuals.type == 'dots') {
            visuals.dots.push({
                x: Math.random(),
                y: Math.random(),
                radius: event.data.velocity,
                color: this.dotColors[Math.floor(event.data.pitch / 12)],
                speed: 1.0
            });
        } else if (visuals.type == 'shape') {
            visuals.width = 12;
            visuals.color = this.randomColor();
        }
    }

    drawNoteVisuals(ctx, timeDiff) {
        for (let unit in this.unitVisuals) {
            const visuals = this.unitVisuals[unit];
            if (visuals.type == 'dots') { this.drawDotsVisuals(ctx, timeDiff, visuals); }
            else if (visuals.type == 'shape') { this.drawShapeVisuals(ctx, timeDiff, visuals); }
        }
    }

    drawDotsVisuals(ctx, timeDiff, visuals) {
        ctx.save();
        const scale = this.width / 10;
        visuals.dots.forEach((dot) => {
            const dotX = dot.x * this.width;
            const dotY = dot.y * this.height;
            const dotRadius = dot.radius * scale;
            const gradient = ctx.createRadialGradient(dotX, dotY, dotRadius * 0.2, dotX, dotY, dotRadius);
            gradient.addColorStop(0, dot.color + 'ff');
            gradient.addColorStop(0.2, dot.color + 'ff');
            gradient.addColorStop(0.5, dot.color + '80');
            gradient.addColorStop(1, dot.color + '00');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(dotX, dotY, dotRadius, dotRadius, 0, 0, Math.PI * 2);
            ctx.fill();

            dot.radius -= dot.speed * timeDiff;
            dot.speed += 1.0 * timeDiff;
        });
        ctx.restore();

        visuals.dots = visuals.dots.filter((dot) => dot.radius > 0);
    }

    drawShapeVisuals(ctx, timeDiff, visuals) {
        ctx.save();

        visuals.shapes.push([
            [visuals.points[0][0], visuals.points[0][1]],
            [visuals.points[1][0], visuals.points[1][1]],
            [visuals.points[2][0], visuals.points[2][1]],
            visuals.color,
        ]);

        let strokeWidth = visuals.width;
        for (let c = visuals.shapes.length - 1; c >= 0; c -= 5) {
            ctx.strokeStyle = visuals.shapes[c][3];
            ctx.lineWidth = strokeWidth;
            ctx.beginPath();
            ctx.moveTo(visuals.shapes[c][0][0] * this.width, visuals.shapes[c][0][1] * this.height);
            ctx.lineTo(visuals.shapes[c][1][0] * this.width, visuals.shapes[c][1][1] * this.height);
            ctx.lineTo(visuals.shapes[c][2][0] * this.width, visuals.shapes[c][2][1] * this.height);
            ctx.closePath();
            ctx.stroke();
            strokeWidth *= 0.8;
        }
        if (visuals.shapes.length > 60) {
            visuals.shapes.splice(0, 1);
        }

        for (let c = 0; c < visuals.points.length; c++) {
            visuals.points[c][0] += visuals.speeds[c][0] * timeDiff;
            visuals.points[c][1] += visuals.speeds[c][1] * timeDiff;
            if (visuals.points[c][0] > 1 || visuals.points[c][0] < 0) {
                visuals.points[c][0] = visuals.points[c][0] > 1 ? 1 : 0;
                visuals.speeds[c][0] = -Math.sign(visuals.speeds[c][0]) * Math.random();
            }
            if (visuals.points[c][1] > 1 || visuals.points[c][1] < 0) {
                visuals.points[c][1] = visuals.points[c][1] > 1 ? 1 : 0;
                visuals.speeds[c][1] = -Math.sign(visuals.speeds[c][1]) * Math.random();
            }
        }
        visuals.width -= 20 * timeDiff;
        if (visuals.width < 1) {
            visuals.width = 1;
        }

        ctx.restore();
    }

    // Utility functions
    randomColor() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return ('rgb(' + r + ',' + g + ',' + b + ')');
    }

    // Light color with opacity
    lightColorWithOpacity(r, g, b, a, light) {
        r *= light;
        g *= light;
        b *= light;
        if (r > 255) r = 255;
        if (g > 255) g = 255;
        if (b > 255) b = 255;
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }
}
