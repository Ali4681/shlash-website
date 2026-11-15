"use client";

import { Suspense, useEffect, useState } from "react";
import { Environment } from "@react-three/drei";
import { ASSETS } from "./timeline";

function HdrEnvironment() {
  return (
    <Environment
      files={ASSETS.env}
      background={false}
      environmentIntensity={0.65}
    />
  );
}

export function SafeEnvironment() {
  const [hasHdr, setHasHdr] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(ASSETS.env, { method: "HEAD" })
      .then((r) => {
        if (!cancelled) setHasHdr(r.ok);
      })
      .catch(() => {
        if (!cancelled) setHasHdr(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Environment preset="sunset" environmentIntensity={hasHdr ? 0.25 : 0.55} />
      {hasHdr && (
        <Suspense fallback={null}>
          <HdrEnvironment />
        </Suspense>
      )}
    </>
  );
}
