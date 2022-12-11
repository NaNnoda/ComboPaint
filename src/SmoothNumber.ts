export class SmoothNumber {
    _value: number;
    _target: number;
    _speed: number;

    constructor(value: number, target: number, speed: number) {
        this._value = value;
        this._target = target;
        this._speed = speed;
    }

    get value() {
        this.update();
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }

    get target() {
        return this._target;
    }

    set target(value: number) {
        this._target = value;
        // this.speed = 1;
    }

    get speed() {
        return this._speed;
    }

    set speed(value: number) {
        this._speed = value;
    }

    update() {
        this._value += (this._target - this._value) * this.speed;
        if (Math.abs(this._target - this._value) < 0.01) {
            this._value = this._target;
            // this.speed = 0;
        }
    }
}
