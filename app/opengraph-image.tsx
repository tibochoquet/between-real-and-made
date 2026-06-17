import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #3D2317 0%, #1C0F0A 60%, #0D0705 100%)",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: "#D4916F",
            marginBottom: 28,
            fontFamily: "Georgia, serif",
          }}
        >
          CMD Afstudeerproject · 2026
        </div>
        <div
          style={{
            fontSize: 88,
            lineHeight: 1.15,
            color: "#FFF8F0",
            fontFamily: "Georgia, serif",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontStyle: "italic", fontWeight: 400 }}>
            Between Real
          </div>
          <div style={{ fontWeight: 700 }}>and Made.</div>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,248,240,0.55)",
            marginTop: 36,
            maxWidth: 760,
            lineHeight: 1.4,
            fontFamily: "Georgia, serif",
          }}
        >
          Een onderzoek naar hoe kunstmatige intelligentie verandert hoe
          mensen muziek ervaren, waarderen en bespreken.
        </div>
      </div>
    ),
    { ...size }
  );
}
