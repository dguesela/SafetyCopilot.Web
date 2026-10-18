# SafetyCopilot Web

React frontend for comparing human and AI hazard classifications of software requirements.

## Prerequisites

- **Node.js 24.x** with npm.
- The separate **SafetyCopilot.API** backend and its database running. Follow that repository's README first or the setup guide on the Beta Release report
- The backend available at **https://localhost:7014**, with a trusted HTTPS certificate and CORS allowing **http://localhost:5173**.
- Visual Studio Code

## Run the frontend

1. Open the repository's folder inside Visual Studio Code.
2. Next, navigate to **Terminal -> New Terminal**.
3. Ensuring that the terminal is open in the repository's folder, run `npm run dev`

## Try the workflow

1. **Register or sign in.**
2. Open **Profile -> OpenAI Configuration** and save an API key if you plan to run new AI classifications (Ask Dan for an OpenAI API if you do not have one)
3. Create a project, give it a project name and description, then click **Open**
4. Click **Upload PDF** and choose one of the provided PDF files under the **sample_PDFs** (We recommend trying **SafetyCopilot_Simulated_Self_Driving_Car_Requirements.pdf**)
5. Next, click **Extract Requirements**. After requirements are extracted, the Human Hazard Classification page will appear. Classify each requirement as **Hazard** or **Not Hazard**.
6. Select **Run AI Classification** and wait for processing to finish.
7. Review the AI results, then select **Run Comparative Analysis** to see the comparison and metrics.

To revisit saved results without running the AI again, select **View AI Results** on the requirements page.

Evaluation metrics use the human classifications as the reference, not verified ground truth.

## Quick troubleshooting

- **Cannot log in or load data:** confirm the backend and database are running. Check the browser's Network tab for certificate or CORS errors.
- **Port 5173 is in use:** stop the other server before restarting.
- **AI classification fails:** check the saved API key and backend logs.
- **Production build fails:** the repository currently has TypeScript errors affecting `npm run build`. Use the development command above for the demo; it does not run that separate type-checking step.
