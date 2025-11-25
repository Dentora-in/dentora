import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          fontWeight: 700,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "black",
        }}
      >
        Dentora – Smart Dental Management
      </div>
    ),
    size
  );
}
