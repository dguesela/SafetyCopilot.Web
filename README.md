# SafetyCopilot Web

SafetyCopilot is a research interface for comparing human and AI classifications of software requirements as **Hazard** or **Not Hazard**. Users upload requirement PDFs, classify extracted requirements, review AI results, and inspect agreement and evaluation metrics.

This repository contains the **React + TypeScript + Vite frontend**. The backend API, database, PDF extraction service, and AI classification implementation are maintained separately. Starting this frontend alone does not provide a working end-to-end system.

## Prerequisites

- **Node.js 24.x** with npm. The local setup used to check these instructions has Node.js 24.20.0 and npm 11.19.0.
- Git, if cloning the repository rather than downloading it.
- The separate SafetyCopilot backend and its configured database.
- A PDF containing software requirements for a new demonstration, or an existing project with saved results.
- An API key configured through the application's Profile page if running new AI classifications. Viewing saved results does not initiate new AI requests.

The backend's required .NET SDK version, database setup, migrations, and model configuration must come from its own repository or the project author. They cannot be determined from this frontend repository.

## 1. Start the backend

Follow the backend repository's setup instructions and keep its API running while using the website.

The frontend currently expects:

```text
https://localhost:7014/api
```

Ensure that:

- The backend can connect to its database.
- Its HTTPS certificate is trusted on the machine running the browser.
- Its CORS configuration permits the frontend origin, `http://localhost:5173`.

Verify that the API is reachable using the backend's documented endpoint or Swagger UI, if provided. The frontend does not start the backend automatically.

## 2. Install frontend dependencies

Clone this repository using its clone URL, or extract the downloaded source. Open a terminal in the repository folder containing `package.json`.

```sh
node --version
npm --version
npm ci
```

`npm ci` installs the dependency versions recorded in `package-lock.json`.

## 3. Start the website

```sh
npm run dev -- --port 5173 --strictPort
```

Open **http://localhost:5173** in your browser. Keep the terminal open; press **Ctrl+C** to stop the frontend.

The explicit port makes the frontend origin predictable for the backend's CORS configuration. If port 5173 is occupied, stop the other process or choose another port and update the backend's allowed origin accordingly.

### Configuration notes

No frontend environment-variable setup is currently required. The source uses a hard-coded backend address rather than reading an API URL from `.env`.

If the backend runs at another address, update these locations:

| File | Setting |
| --- | --- |
| `src/api/apiClient.ts` | Axios `baseURL`, including `/api` |
| `src/api/documentApi.ts` | PDF URL in `getDocumentPdfUrl` |
| `src/pages/RequirementsPage.tsx` | Direct document PDF link |

Changing only `.env` will not change these addresses. Configure AI credentials through **Profile ? OpenAI Configuration**, rather than placing them in frontend source or browser-exposed environment variables.

## First demonstration

1. **Register or sign in.** Use the application's registration page to create an account in the running backend, or sign in with an existing account.
2. **Configure AI access if needed.** Open **Profile**, enter the API key under **OpenAI Configuration**, and save it. The frontend sends the key to the backend.
3. **Create a project.** Open **Projects** and create a project for the requirements being evaluated.
4. **Upload a PDF.** Use **Upload PDF**. If it has zero extracted requirements, use **Extract Requirements** on the requirements page. The page supports requirements from multiple PDFs and identifies each requirement's source document.
5. **Complete human classification.** Select **Hazard** or **Not Hazard** for each requirement. Choices are saved through the backend API.
6. **Run AI classification.** Once human classification is complete, select **Run AI Classification**. Processing can take several minutes depending on the requirement count and backend response times.
7. **Review AI results.** The results page shows the AI's labels, confidence values, and explanations. Filters let you inspect hazards, non-hazards, or low-confidence results.
8. **Review the comparison.** Use **Run Comparative Analysis** from the results page, or **View Analysis** from the project page, to open the human?AI comparison.

The frontend accepts PDFs but does not specify or validate a particular requirement-numbering or document-layout convention. Check the backend extraction rules before preparing a formal evaluation dataset.

### Reopen saved AI results

Use **View AI Results** at the top of the requirements page. This retrieves saved results without rerunning classification.

The corresponding route is:

```text
http://localhost:5173/projects/PROJECT_ID/ai-results
```

Replace `PROJECT_ID` with the project's actual ID and remain signed in.

### AI progress indicator

During classification, the frontend checks the saved-results endpoint about every three seconds. It compares classification timestamps with a snapshot taken before the run, then displays the number and percentage of newly saved or updated results.

This is inferred progress, not a dedicated backend job-status feed. Live updates require the backend to expose partial results and update classification timestamps while processing. If progress checks fail, the page reports that updates are unavailable; this does not by itself mean classification failed. Leaving the page stops frontend polling and does not send a backend cancellation request.

## Understanding the evaluation metrics

The Interpretation section treats **human classifications as the reference**, with **Hazard as the positive class**. These metrics measure the AI relative to those human judgments, not independently verified hazard-detection accuracy.

| Metric | Meaning |
| --- | --- |
| Agreement rate | Human and AI give the same label |
| Disagreement rate | Human and AI give different labels |
| True positives (TP) | Both label the requirement Hazard |
| False positives (FP) | AI labels Hazard; human labels Not Hazard |
| False negatives (FN) | AI labels Not Hazard; human labels Hazard |
| Precision | `TP / (TP + FP)` |
| Recall | `TP / (TP + FN)` |
| F1-score | `2TP / (2TP + FP + FN)` |

Precision, recall, and F1 are displayed as percentages. Undefined ratios display **N/A**, with an explanation. Metrics use existing comparison data and do not require additional AI calls.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install locked dependencies |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run TypeScript checks and create a production bundle |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve an already-created production bundle locally |

### Current build limitations

As checked on October 17, 2026, **`npm run build` fails on existing TypeScript errors**. Examples include outdated analysis type imports, component props that no longer match the current types, an authentication loading-property mismatch, and an unused random-classification handler.

These must be resolved before the standard production build can pass. Development startup uses Vite without the separate TypeScript build step, so a failed `npm run build` does not automatically prevent running `npm run dev`.

For a frontend bundling check without the TypeScript build step:

```sh
npx vite build
```

This is not a substitute for fixing TypeScript errors or verifying the application against a running backend. `npm run preview` also still needs the backend and an appropriate CORS configuration for the preview origin.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `npm` is not recognized | Install Node.js and reopen the terminal. |
| Dependency installation reports an unsupported engine | Check `node --version`; use Node.js 24.x. |
| Port 5173 is already in use | Stop the other server or select another port and update backend CORS. |
| Login, registration, or project loading fails | Confirm the backend and database are running, and inspect the failed request in the browser's Network tab. |
| Browser reports a certificate error | Trust the backend's local HTTPS certificate using its setup instructions. |
| Browser reports a CORS error | Allow the exact frontend origin in the backend; changing frontend styling or routes will not resolve it. |
| An uploaded PDF has no visible requirements | Check its extracted requirement count and use **Extract Requirements** if available. Check backend logs if extraction fails. |
| AI classification fails | Check the Profile API-key status and backend logs. AI processing is performed by the backend. |
| AI progress remains at zero or becomes unavailable | The results endpoint may not expose intermediate saves. Inspect backend activity before starting another run. |
| AI results cannot be loaded | Confirm you are signed in, open **View AI Results**, and inspect the results GET request and backend response. Do not assume a display failure requires rerunning AI classification. |
| Production build fails | See the current TypeScript limitations above; installation and backend connectivity are separate issues. |

## Source map

| Location | Responsibility |
| --- | --- |
| `src/App.tsx` | Application routes |
| `src/contexts/AuthContext.tsx` | Signed-in user state |
| `src/api/` | Backend request functions |
| `src/types/` | TypeScript API data contracts |
| `src/pages/UploadDocumentPage.tsx` | PDF upload interface |
| `src/pages/RequirementsPage.tsx` | Extraction controls, human classification, AI run and progress |
| `src/pages/AiClassificationResultsPage.tsx` | Saved AI classifications and filters |
| `src/pages/AnalysisPage.tsx` | Comparison and interpretation metrics |
| `src/index.css` | Shared application styling |

For a complete handoff, provide this repository together with the backend repository and its database/configuration instructions. Those backend prerequisites are required to reproduce the full workflow.
