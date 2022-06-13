export function findRightIndexBack(point, line = []) {
    let minIdx = -1;
    let minDist = Infinity
    for (let index = 0; index < line.length; index++) {
        const point1 = line[index];
        let dist = distance(point, point1)
        if (dist < minDist) {
            minIdx = index
            minDist = dist
        }
    }
    if (minIdx === 0) {
        return 0
    }
    if (minIdx === line.length - 1) {
        return minIdx - 1
    }
    let leftDistBwtTarget = distance(point, line[minIdx - 1])
    let leftDistBwtMinIdx = distance(line[minIdx], line[minIdx - 1])
    if (leftDistBwtTarget < leftDistBwtMinIdx) {
        return minIdx - 1
    }

    return minIdx
}

export function distance(point0, point1) {
    return Math.sqrt(Math.pow(point1.x - point0.x, 2) + Math.pow(point1.y - point0.y, 2))
}

export function findRightIndex(point, line = []) {
    let minIdx = -1;
    let minDist = Infinity
    for (let index = 0; index < line.length - 1; index++) {
        if (pointInBound(point, line[index], line[index + 1])) {
            let dist = distanceToLine(point, line[index], line[index + 1])
            if (dist < minDist) {
                minIdx = index
                minDist = dist
            }
        }

    }
    if (minIdx === -1) {
        return findRightIndexBack(point, line)
    }
    return minIdx
}

export function pointInBound(p0, p1, p2) {
    let { x: x1, y: y1 } = p1
    let { x: x2, y: y2 } = p2
    let { x: x0, y: y0 } = p0
    if (x1 < x0 && x0 < x2 && y1 < y0 && y0 < y2) {
        return true
    }
    if (x2 < x0 && x0 < x1 && y2 < y0 && y0 < y1) {
        return true
    }
    if (x1 < x0 && x0 < x2 && y1 > y0 && y0 > y2) {
        return true
    }
    if (x2 < x0 && x0 < x1 && y2 > y0 && y0 > y1) {
        return true
    }

    return false
}

export function distanceToLine(p0, p1, p2) {
    let top = (p2.y - p1.y) * p0.x
        - (p2.x - p1.x) * p0.y
        + p2.x * p1.y
        - p2.y * p1.x
    let bot = Math.pow((p2.y - p1.y), 2) + Math.pow((p2.x - p1.x), 2)
    return Math.abs(top) / Math.sqrt(bot)
}

export function alignEndsHorizontally(points, curvature) {
    const p1 = points[0];
    const p2 = points[1];
    const p3 = points[points.length - 2];
    const p4 = points[points.length - 1];
    const hx1 = p1[0] + Math.abs(p2[0] - p1[0]) * curvature;
    const hx2 = p4[0] - Math.abs(p4[0] - p3[0]) * curvature;

    points = [...points];
    points.splice(1, 0, [hx1, p1[1]]);
    points.splice(points.length - 1, 0, [hx2, p4[1]]);

    return points;
}