import {Vec2} from "./Vec2";


// /**
//  * Hermite Spline
//  * @param p0 control point 0
//  * @param p1 control point 1
//  * @param p2 control point 2
//  * @param p3 control point 3
//  * @param t time (0-1)
//  * @param tension tension (0-1)
//  */
// export function getHermiteSpline(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number, tension:number = 0.5): Vec2 {
//     let t2 = t * t;
//     let t3 = t2 * t;
//     let m0 = (p1.sub(p0)).scale(tension);
//     let m1 = (p2.sub(p1)).scale(tension);
//     // let m2 = (p3.sub(p2)).scale(tension);
//     let a0 = 2 * t3 - 3 * t2 + 1;
//     let a1 = t3 - 2 * t2 + t;
//     let a2 = t3 - t2;
//     let a3 = -2 * t3 + 3 * t2;
//     let x = a0 * p1.x + a1 * m0.x + a2 * m1.x + a3 * p2.x;
//     let y = a0 * p1.y + a1 * m0.y + a2 * m1.y + a3 * p2.y;
//     return new Vec2(x, y);
// }

export function getCatmullRomSpline(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
    let t2 = t * t;
    let t3 = t2 * t;
    let a0 = -0.5 * p0.x + 1.5 * p1.x - 1.5 * p2.x + 0.5 * p3.x;
    let a1 = p0.x - 2.5 * p1.x + 2 * p2.x - 0.5 * p3.x;
    let a2 = -0.5 * p0.x + 0.5 * p2.x;
    let a3 = p1.x;
    let x = a0 * t3 + a1 * t2 + a2 * t + a3;
    a0 = -0.5 * p0.y + 1.5 * p1.y - 1.5 * p2.y + 0.5 * p3.y;
    a1 = p0.y - 2.5 * p1.y + 2 * p2.y - 0.5 * p3.y;
    a2 = -0.5 * p0.y + 0.5 * p2.y;
    a3 = p1.y;
    let y = a0 * t3 + a1 * t2 + a2 * t + a3;
    return new Vec2(x, y);

}
