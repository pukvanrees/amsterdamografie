const EARTH_RADIUS_M = 6371000;
const REF_LAT = 52.3702; // Amsterdam reference latitude, used for local flat projection

function toRad(deg) {
  return (deg * Math.PI) / 180;
}
function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

// Haversine distance in meters between two [lat, lng] points.
export function distanceMeters([lat1, lng1], [lat2, lng2]) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_M * c;
}

// Local flat-earth projection (meters), accurate enough over Amsterdam's ~5km extent.
function project([lat, lng]) {
  return {
    x: toRad(lng) * Math.cos(toRad(REF_LAT)) * EARTH_RADIUS_M,
    y: toRad(lat) * EARTH_RADIUS_M,
  };
}

function unproject({ x, y }) {
  return [toDeg(y / EARTH_RADIUS_M), toDeg(x / (EARTH_RADIUS_M * Math.cos(toRad(REF_LAT))))];
}

function nearestOnSegment(p, a, b) {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const lenSq = abx * abx + aby * aby;
  let t = lenSq === 0 ? 0 : ((p.x - a.x) * abx + (p.y - a.y) * aby) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return { x: a.x + t * abx, y: a.y + t * aby };
}

// A location's `coords` is a list of lines; each line is a list of >=1 [lat,lng] points.
// A square is a single line with one point; a street is one or more line segments
// following its real path, so the "correct" answer can be anywhere along it.
export function nearestPointOnPath(point, coords) {
  const p = project(point);
  let best = null;
  let bestDistSq = Infinity;

  for (const line of coords) {
    if (line.length === 1) {
      const a = project(line[0]);
      const d2 = (p.x - a.x) ** 2 + (p.y - a.y) ** 2;
      if (d2 < bestDistSq) {
        bestDistSq = d2;
        best = a;
      }
      continue;
    }
    for (let i = 0; i < line.length - 1; i++) {
      const a = project(line[i]);
      const b = project(line[i + 1]);
      const c = nearestOnSegment(p, a, b);
      const d2 = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
      if (d2 < bestDistSq) {
        bestDistSq = d2;
        best = c;
      }
    }
  }

  return unproject(best);
}

export function distanceToPath(point, coords) {
  const nearest = nearestPointOnPath(point, coords);
  return { distance: distanceMeters(point, nearest), nearest };
}

export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

function percentile(sorted, p) {
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

// Bounding box that excludes the most extreme `trim` fraction of points on
// each side, so a couple of outlier locations (e.g. one long street that
// reaches further than the rest of a district) don't dictate an overly wide
// overview zoom. The specific question view (once answered) still fits the
// exact guess/target regardless of this.
export function trimmedBounds(points, trim = 0.03) {
  if (points.length < 4) return points;
  const lats = points.map((p) => p[0]).sort((a, b) => a - b);
  const lngs = points.map((p) => p[1]).sort((a, b) => a - b);
  return [
    [percentile(lats, trim), percentile(lngs, trim)],
    [percentile(lats, 1 - trim), percentile(lngs, 1 - trim)],
  ];
}
