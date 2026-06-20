import { Prediction } from "../types";
import * as FileSystem from "expo-file-system/legacy";

export const analysisHTML = async ({
  prediction,
  image,
}: {
  prediction: Prediction | null;
  image: string | null;
}) => {
  const classColor: Record<string, string> = {
    antracnosis: "#e74c3c",
    pudricion: "#f39c12",
    saludable: "#2ecc71",
    error: "#95a5a6",
  };

  const diagnosticoColor =
    classColor[prediction?.predicted_category_display || "error"];

  const antracnosis = Math.round(
    (prediction?.raw_scores.antracnosis || 0) * 100,
  );
  const pudricion = Math.round((prediction?.raw_scores.sarna || 0) * 100);
  const saludable = Math.round((prediction?.raw_scores.saludable || 0) * 100);
  const confianza = Math.round((prediction?.confidence || 0) * 100);

  let imageSrc = "";
  if (image) {
    const esRemota =
      image.startsWith("http://") || image.startsWith("https://");

    try {
      if (esRemota) {
        const fileUri = FileSystem.cacheDirectory + "temp_report_image.jpg";
        await FileSystem.downloadAsync(image, fileUri);

        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: "base64",
        });
        imageSrc = `data:image/jpeg;base64,${base64}`;
      } else {
        const base64 = await FileSystem.readAsStringAsync(image, {
          encoding: "base64",
        });
        imageSrc = `data:image/jpeg;base64,${base64}`;
      }
    } catch (error) {
      console.error("Error al cargar la imagen para el PDF:", error);
      imageSrc = "";
    }
  }

  const progressBar = (label: string, color: string, value: number) => `
    <div class="bar-wrapper">
      <span class="bar-label">${label}</span>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${value}%; background-color: ${color};"></div>
        <span class="bar-text">${value}%</span>
      </div>
    </div>
  `;

  const imagenHTML = imageSrc
    ? `<img src="${imageSrc}" style="width:180px; height:180px; border-radius:10px; object-fit:cover; display:block; margin: 0 auto 20px;"/>`
    : "";

  return `
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 36px;
            color: #1a1a1a;
            background: #ffffff;
          }

          h1 {
            font-size: 26px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 6px;
          }

          .fecha {
            text-align: center;
            color: #666;
            font-size: 13px;
            margin-bottom: 24px;
          }

          .seccion {
            margin-bottom: 20px;
          }

          .seccion-titulo {
            font-size: 15px;
            font-weight: bold;
            color: #444;
            border-bottom: 1px solid #ddd;
            padding-bottom: 4px;
            margin-bottom: 12px;
          }

          .diagnostico-badge {
            border-radius: 20px;
            color: #333;
            font-weight: bold;
            font-size: 15px;
            background-color: ${diagnosticoColor};
          }

          .confianza {
            margin-top: 8px;
            font-size: 14px;
            color: #333;
          }

          .bar-wrapper {
            margin-bottom: 12px;
          }

          .bar-label {
            font-size: 13px;
            font-weight: bold;
            display: block;
            margin-bottom: 4px;
          }

          .bar-track {
            position: relative;
            width: 100%;
            height: 22px;
            background-color: #e0e0e0;
            border-radius: 6px;
            overflow: hidden;
          }

          .bar-fill {
            height: 100%;
            border-radius: 6px;
          }

          .bar-text {
            position: absolute;
            right: 8px;
            top: 3px;
            font-size: 12px;
            font-weight: bold;
            color: #1a1a1a;
          }
        </style>
      </head>
      <body>

        <h1>Análisis de enfermedad</h1>
        <p class="fecha">Fecha: ${new Date().toLocaleDateString("es-PE")}</p>

        ${imagenHTML}

        <div class="seccion">
          <p class="seccion-titulo">Diagnóstico</p>
          <p class="diagnostico-badge">
            ${prediction?.predicted_category_display || "Error en la predicción"}
          </p>
          <p class="confianza">Confianza: <b>${confianza}%</b></p>
        </div>

        <div class="seccion">
          <p class="seccion-titulo">Probabilidad por clase</p>
          ${progressBar("Antracnosis", "#e74c3c", antracnosis)}
          ${progressBar("Sarna", "#f39c12", pudricion)}
          ${progressBar("Saludable", "#2ecc71", saludable)}
        </div>

      </body>
    </html>
  `;
};
