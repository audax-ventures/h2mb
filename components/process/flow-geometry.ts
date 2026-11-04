export type FlowPoint = { x: number; y: number };
export type FlowMoment = { y: number; distance: number };

/** Round each bend without moving either equipment connection. */
export function roundedPipe(points: FlowPoint[], radius = 22) {
  const clean = points.filter((point, i) => !i || point.x !== points[i - 1].x || point.y !== points[i - 1].y);
  let d = `M ${clean[0].x} ${clean[0].y}`;
  for (let i = 1; i < clean.length - 1; i++) {
    const before = clean[i - 1], corner = clean[i], after = clean[i + 1];
    const incoming = Math.hypot(corner.x - before.x, corner.y - before.y);
    const outgoing = Math.hypot(after.x - corner.x, after.y - corner.y);
    const r = Math.min(radius, incoming / 2, outgoing / 2);
    const a = { x: corner.x + (before.x - corner.x) * r / incoming, y: corner.y + (before.y - corner.y) * r / incoming };
    const b = { x: corner.x + (after.x - corner.x) * r / outgoing, y: corner.y + (after.y - corner.y) * r / outgoing };
    d += ` L ${a.x} ${a.y} Q ${corner.x} ${corner.y} ${b.x} ${b.y}`;
  }
  const last = clean[clean.length - 1];
  return `${d} L ${last.x} ${last.y}`;
}

/** Horizontal equipment runs get scroll time too; distance never jumps at a join. */
export function distanceAt(moments: FlowMoment[], y: number) {
  if (!moments.length || y <= moments[0].y) return 0;
  for (let i = 1; i < moments.length; i++) {
    if (y <= moments[i].y) {
      const before = moments[i - 1], after = moments[i];
      const ratio = Math.min(1, Math.max(0, (y - before.y) / Math.max(1, after.y - before.y)));
      return before.distance + (after.distance - before.distance) * ratio;
    }
  }
  return moments[moments.length - 1].distance;
}
