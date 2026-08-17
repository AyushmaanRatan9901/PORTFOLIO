import api from "../services/api";

export async function downloadResume(customUrl) {
  try {
    const baseURL = api.defaults.baseURL || "http://localhost:5000/api";
    const downloadEndpoint = `${baseURL}/resumes/download`;

    let response = null;
    let filename = "Ayushmaan_Ratan_Resume.pdf";

    // 1. Try fetching from backend download endpoint first
    try {
      const res = await fetch(downloadEndpoint);
      const contentType = res?.headers?.get("content-type") || "";
      if (res && res.ok && !contentType.includes("application/json")) {
        response = res;
        const disposition = res.headers.get("content-disposition");
        if (disposition && disposition.includes("filename=")) {
          const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (match && match[1]) {
            filename = decodeURIComponent(match[1].replace(/['"]/g, ""));
          }
        }
      }
    } catch (apiErr) {
      console.warn("Backend API download endpoint unreachable:", apiErr);
    }

    // 2. If backend endpoint returned null or non-binary, try customUrl / static file directly
    if (!response) {
      const fileTarget = customUrl || "/Ayushmaan_Ratan_Resume.pdf";
      const res = await fetch(fileTarget);
      const contentType = res?.headers?.get("content-type") || "";
      if (res.ok && !contentType.includes("application/json")) {
        response = res;
        const urlParts = fileTarget.split("/");
        const lastPart = urlParts[urlParts.length - 1].split("?")[0];
        if (lastPart && lastPart.includes(".")) {
          filename = decodeURIComponent(lastPart);
        }
      } else {
        throw new Error(`Failed to fetch binary file from target URL: ${res.statusText}`);
      }
    }

    // 3. Convert to Blob and trigger native browser file download
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = blobUrl;
    link.download = filename || "Ayushmaan_Ratan_Resume.pdf";
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      window.URL.revokeObjectURL(blobUrl);
    }, 300);
  } catch (error) {
    console.warn("Blob download failed, opening direct window fallback:", error);
    const target = customUrl || "/Ayushmaan_Ratan_Resume.pdf";
    window.open(target, "_blank");
  }
}
