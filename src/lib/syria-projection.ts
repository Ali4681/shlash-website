import { geoMercator, geoPath, type GeoPermissibleObjects, type GeoProjection } from "d3-geo";
import type { Feature, FeatureCollection, Geometry, Position } from "geojson";

export type SyriaProjection = {
  projection: GeoProjection;
  path: ReturnType<typeof geoPath>;
  /** Project lon/lat → SVG [x, y] */
  project: (lon: number, lat: number) => [number, number] | null;
};

/** Planar shoelace — positive ⇒ counter-clockwise. */
function ringArea(ring: Position[]): number {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x0, y0] = ring[j]!;
    const [x1, y1] = ring[i]!;
    a += x0! * y1! - x1! * y0!;
  }
  return a / 2;
}

/**
 * d3-geo expects clockwise exteriors (opposite of GeoJSON RFC 7946).
 * Without this, geoBounds becomes the whole sphere and fitExtent collapses.
 */
function fixRing(ring: Position[], wantCW: boolean): Position[] {
  const isCW = ringArea(ring) < 0;
  return wantCW === isCW ? ring : ring.slice().reverse();
}

function fixGeometry(geom: Geometry): Geometry {
  if (geom.type === "Polygon") {
    return {
      ...geom,
      coordinates: geom.coordinates.map((ring, i) => fixRing(ring, i === 0)),
    };
  }
  if (geom.type === "MultiPolygon") {
    return {
      ...geom,
      coordinates: geom.coordinates.map((poly) =>
        poly.map((ring, i) => fixRing(ring, i === 0)),
      ),
    };
  }
  return geom;
}

/** Normalize FeatureCollection windings for d3-geo. */
export function prepareSyriaGeo(geo: FeatureCollection): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: geo.features.map((f) => ({
      ...f,
      geometry: fixGeometry(f.geometry as Geometry),
    })) as Feature[],
  };
}

type LonLat = { lon: number; lat: number };

/**
 * Fit Mercator to Syria, optionally expanding the frame so out-of-border
 * pins (e.g. لواء إسكندرون) stay visible inside the panel.
 */
export function createSyriaProjection(
  geo: FeatureCollection,
  width: number,
  height: number,
  padding = 12,
  extraPoints: LonLat[] = [],
): SyriaProjection {
  const fitTarget =
    extraPoints.length === 0
      ? geo
      : {
          type: "FeatureCollection" as const,
          features: [
            ...geo.features,
            {
              type: "Feature" as const,
              properties: {},
              geometry: {
                type: "MultiPoint" as const,
                // d3-geo MultiPoint: clockwise-safe; points don't need winding
                coordinates: extraPoints.map((p) => [p.lon, p.lat]),
              },
            },
          ],
        };

  const projection = geoMercator().fitExtent(
    [
      [padding, padding],
      [width - padding, height - padding],
    ],
    fitTarget,
  );

  const path = geoPath(projection);

  return {
    projection,
    path,
    project(lon, lat) {
      const pt = projection([lon, lat]);
      return pt ? [pt[0], pt[1]] : null;
    },
  };
}

/** Path `d` for a feature, or empty string if unprojectable. */
export function featurePath(
  path: ReturnType<typeof geoPath>,
  feature: GeoPermissibleObjects,
): string {
  return path(feature) ?? "";
}
