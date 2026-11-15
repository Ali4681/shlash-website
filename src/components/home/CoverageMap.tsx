"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import {
  coverageAreas,
  governorateNameAr,
  type CoverageArea,
} from "@/data/coverage";
import {
  createSyriaProjection,
  featurePath,
  prepareSyriaGeo,
} from "@/lib/syria-projection";
import "./coverage.css";

const MAP_W = 440;
const MAP_H = 480;

const statusLabel: Record<CoverageArea["status"], string> = {
  active: "تغطية يومية",
  limited: "تغطية محدودة",
  inquiry: "للاستفسار",
};

const statusTone: Record<CoverageArea["status"], string> = {
  active: "coverage-status--active",
  limited: "coverage-status--limited",
  inquiry: "coverage-status--inquiry",
};

const pinTone: Record<CoverageArea["status"], string> = {
  active: "coverage-pin--active",
  limited: "coverage-pin--limited",
  inquiry: "coverage-pin--inquiry",
};

type GovFeature = Feature<Geometry, { shapeName?: string; shapeNameAr?: string }>;

type FlightLink = {
  id: string;
  d: string;
};

export function CoverageMap() {
  const layoutRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [geo, setGeo] = useState<FeatureCollection | null>(null);
  const [size, setSize] = useState({ w: MAP_W, h: MAP_H });
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState<{ name: string; x: number; y: number } | null>(null);
  const [flights, setFlights] = useState<FlightLink[]>([]);
  const [layoutSize, setLayoutSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch("/data/syria-adm1.geo.json").then((r) => r.json()),
      fetch("/data/alexandretta.geo.json").then((r) => r.json()),
    ])
      .then(([syria, isk]: [FeatureCollection, FeatureCollection]) => {
        if (cancelled) return;
        setGeo(
          prepareSyriaGeo({
            type: "FeatureCollection",
            features: [...syria.features, ...isk.features],
          }),
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(240, Math.round(rect.width));
      const h = Math.round(w * (MAP_H / MAP_W));
      setSize({ w, h });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!geo) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setReady(true);
      return;
    }
    const t = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(t);
  }, [geo]);

  const proj = useMemo(() => {
    if (!geo) return null;
    const extras = coverageAreas
      .filter((a): a is CoverageArea & { lon: number; lat: number } =>
        typeof a.lon === "number" && typeof a.lat === "number",
      )
      .map((a) => ({ lon: a.lon, lat: a.lat }));
    return createSyriaProjection(geo, size.w, size.h, 16, extras);
  }, [geo, size.w, size.h]);

  const outlineD = useMemo(() => {
    if (!geo || !proj) return "";
    return featurePath(proj.path, geo);
  }, [geo, proj]);

  /** Map-space anchor for each coverage area (pin or polygon centroid) */
  const mapAnchors = useMemo(() => {
    if (!proj || !geo) return new Map<string, { x: number; y: number }>();
    const map = new Map<string, { x: number; y: number }>();

    for (const area of coverageAreas) {
      if (typeof area.lon === "number" && typeof area.lat === "number") {
        const pt = proj.project(area.lon, area.lat);
        if (pt) map.set(area.id, { x: pt[0], y: pt[1] });
        continue;
      }
      /* Polygon regions (e.g. لواء إسكندرون) */
      const feat = (geo.features as GovFeature[]).find(
        (f) =>
          f.properties?.shapeName === "Alexandretta" ||
          f.properties?.shapeNameAr === area.nameAr,
      );
      if (feat) {
        const c = proj.path.centroid(feat);
        if (Number.isFinite(c[0]) && Number.isFinite(c[1])) {
          map.set(area.id, { x: c[0], y: c[1] });
        }
      }
    }
    return map;
  }, [proj, geo]);

  /* Build orderly dashed curves: map pin → legend card */
  const rebuildFlights = useCallback(() => {
    const layout = layoutRef.current;
    const mapSvg = svgRef.current;
    if (!layout || !mapSvg || !proj) {
      setFlights([]);
      return;
    }

    const layoutRect = layout.getBoundingClientRect();
    setLayoutSize({ w: layoutRect.width, h: layoutRect.height });

    const svgRect = mapSvg.getBoundingClientRect();
    if (svgRect.width < 8 || layoutRect.width < 8) {
      setFlights([]);
      return;
    }

    const scaleX = svgRect.width / size.w;
    const scaleY = svgRect.height / size.h;

    const links: FlightLink[] = [];

    for (const area of coverageAreas) {
      /* No flight line for polygon-only regions (لواء إسكندرون) */
      if (typeof area.lon !== "number" || typeof area.lat !== "number") continue;

      const anchor = mapAnchors.get(area.id);
      const card = layout.querySelector<HTMLElement>(
        `[data-coverage-id="${area.id}"]`,
      );
      if (!anchor || !card) continue;

      const cardRect = card.getBoundingClientRect();

      /* Start: pin in layout coords */
      const x1 = svgRect.left - layoutRect.left + anchor.x * scaleX;
      const y1 = svgRect.top - layoutRect.top + anchor.y * scaleY;

      /* End: middle of the card's inner edge facing the map */
      const cardMidY = cardRect.top - layoutRect.top + cardRect.height / 2;
      const mapIsLeft = svgRect.left < cardRect.left;
      const x2 = mapIsLeft
        ? cardRect.left - layoutRect.left
        : cardRect.right - layoutRect.left;
      const y2 = cardMidY;

      const dx = x2 - x1;
      const midX = x1 + dx * 0.55;
      const bend = Math.min(48, Math.abs(dx) * 0.12);
      const yCtrl = (y1 + y2) / 2 - bend;

      links.push({
        id: area.id,
        d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${midX.toFixed(1)} ${yCtrl.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
      });
    }

    setFlights(links);
  }, [proj, mapAnchors, size.w, size.h]);

  useEffect(() => {
    const layout = layoutRef.current;
    if (!layout) return;

    const run = () => {
      requestAnimationFrame(() => rebuildFlights());
    };

    run();
    const ro = new ResizeObserver(run);
    ro.observe(layout);
    window.addEventListener("resize", run);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", run);
    };
  }, [rebuildFlights, ready]);

  const onGovEnter = useCallback(
    (e: React.MouseEvent<SVGPathElement>, name: string) => {
      const svg = e.currentTarget.ownerSVGElement;
      if (!svg) return;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const local = pt.matrixTransform(ctm.inverse());
      setHover({ name, x: local.x, y: local.y - 14 });
    },
    [],
  );

  const pinAreas = coverageAreas.filter(
    (a): a is CoverageArea & { lon: number; lat: number } =>
      typeof a.lon === "number" && typeof a.lat === "number",
  );

  return (
    <div className="coverage-layout" ref={layoutRef}>
      {/* Orderly dashed links: map → governorate cards */}
      {layoutSize.w > 0 && flights.length > 0 && (
        <svg
          className={`coverage-flights${ready ? " coverage-flights--ready" : ""}`}
          viewBox={`0 0 ${layoutSize.w} ${layoutSize.h}`}
          width={layoutSize.w}
          height={layoutSize.h}
          aria-hidden="true"
        >
          {flights.map((f, i) => (
            <path
              key={f.id}
              className="coverage-flights__path"
              d={f.d}
              style={{ ["--flight-i" as string]: i }}
            />
          ))}
        </svg>
      )}

      <div className="coverage-map" ref={wrapRef}>
        <svg
          ref={svgRef}
          className={`coverage-map__svg${ready ? " coverage-map__svg--ready" : ""}`}
          viewBox={`0 0 ${size.w} ${size.h}`}
          width="100%"
          height="auto"
          role="img"
          aria-label="خريطة تغطية شلاش في سوريا"
        >
          <defs>
            <linearGradient id="syriaFill" x1="15%" y1="5%" x2="85%" y2="95%">
              <stop offset="0%" stopColor="rgba(13, 117, 255, 0.28)" />
              <stop offset="55%" stopColor="rgba(88, 70, 180, 0.16)" />
              <stop offset="100%" stopColor="rgba(255, 102, 0, 0.14)" />
            </linearGradient>
            <filter id="syriaGlow" x="-12%" y="-12%" width="124%" height="124%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {outlineD && (
            <path
              className="coverage-map__glow"
              d={outlineD}
              filter="url(#syriaGlow)"
              aria-hidden="true"
            />
          )}

          <g className="coverage-map__govs">
            {geo &&
              proj &&
              (geo.features as GovFeature[]).map((f, i) => {
                const nameEn = f.properties?.shapeName ?? `gov-${i}`;
                const nameAr =
                  f.properties?.shapeNameAr ??
                  governorateNameAr[nameEn] ??
                  nameEn;
                const d = featurePath(proj.path, f);
                if (!d) return null;
                return (
                  <path
                    key={nameEn}
                    className="coverage-map__gov"
                    d={d}
                    fill="url(#syriaFill)"
                    style={{ ["--gov-i" as string]: i }}
                    onMouseEnter={(e) => onGovEnter(e, nameAr)}
                    onMouseMove={(e) => onGovEnter(e, nameAr)}
                    onMouseLeave={() => setHover(null)}
                  />
                );
              })}
          </g>

          {outlineD && (
            <path className="coverage-map__outline" d={outlineD} aria-hidden="true" />
          )}

          <g className="coverage-map__pins">
            {proj &&
              pinAreas.map((area, i) => {
                const pt = proj.project(area.lon, area.lat);
                if (!pt) return null;
                const [cx, cy] = pt;
                const ox = area.labelOffset?.x ?? 0;
                const oy = area.labelOffset?.y ?? -16;
                return (
                  <g key={area.id} transform={`translate(${cx} ${cy})`}>
                    <g
                      className={`coverage-pin ${pinTone[area.status]}`}
                      style={{ ["--pin-i" as string]: i }}
                    >
                      <circle className="coverage-pin__pulse" r="14" />
                      <circle className="coverage-pin__halo" r="10" />
                      <circle className="coverage-pin__dot" r="4.5" />
                      <text
                        className="coverage-pin__label"
                        x={ox}
                        y={oy}
                        textAnchor="middle"
                      >
                        {area.nameAr}
                      </text>
                    </g>
                  </g>
                );
              })}
          </g>

          {hover &&
            (() => {
              const tipW = Math.max(72, hover.name.length * 11 + 20);
              return (
                <g className="coverage-tip" pointerEvents="none">
                  <rect
                    className="coverage-tip__bg"
                    x={hover.x - tipW / 2}
                    y={hover.y - 22}
                    width={tipW}
                    height={26}
                    rx={6}
                  />
                  <text
                    className="coverage-tip__text"
                    x={hover.x}
                    y={hover.y - 4}
                    textAnchor="middle"
                  >
                    {hover.name}
                  </text>
                </g>
              );
            })()}
        </svg>
      </div>

      <ul className="coverage-legend m-0 list-none p-0">
        {coverageAreas.map((area) => (
          <li key={area.id} className="coverage-card" data-coverage-id={area.id}>
            <div className="coverage-card__top">
              <h3 className="coverage-card__city">{area.nameAr}</h3>
              <span className={`coverage-status ${statusTone[area.status]}`}>
                {statusLabel[area.status]}
              </span>
            </div>
            {area.note ? (
              <p className="coverage-card__note">{area.note}</p>
            ) : (
              <p className="coverage-card__note coverage-card__note--muted">{area.nameEn}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
