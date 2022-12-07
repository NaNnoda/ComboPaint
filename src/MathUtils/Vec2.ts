export class Vec2 {
    x: number;
    y: number;

    constructor(val1: number, val2: number | undefined = undefined) {
        this.x = val1;
        if (val2 === undefined) {
            this.y = val1;
        } else {
            this.y = val2;
        }
    }

    add(other: Vec2) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }

    sub(other: Vec2) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }

    mul(other: Vec2) {
        return new Vec2(this.x * other.x, this.y * other.y);
    }

    div(other: Vec2) {
        return new Vec2(this.x / other.x, this.y / other.y);
    }

    scale(scalar: number) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }

    dot(other: Vec2) {
        return this.x * other.x + this.y * other.y;
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    normalize() {
        return this.scale(1 / this.length());
    }

    rotate(angle: number) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return new Vec2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    angleTo(other: Vec2) {
        return other.angle() - this.angle();
    }
}