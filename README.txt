PASINDAYAG S2 SMS PORTAL — VERCEL FINAL

UPLOAD THESE TO THE ROOT OF YOUR GITHUB REPOSITORY:
- index.html
- vercel.json
- api/send-sms.js

REMOVE THE OLD NETLIFY FILES:
- netlify.toml
- netlify/ folder

VERCEL SETUP
1. In Vercel, Add New > Project.
2. Import the GitHub repository: pasindayagsms.
3. Framework Preset: Other.
4. Root Directory: leave as repository root.
5. No Build Command is required.
6. Deploy.
7. Open the Vercel project > Settings > Environment Variables.
8. Add:
   SEMAPHORE_API_KEY = your private Semaphore API key
   SEMAPHORE_SENDER_NAME = your approved Sender Name (optional if Semaphore has a default registered sender)
9. Apply to Production (and Preview if you want to test preview deployments).
10. Save and Redeploy the latest deployment.
11. Test first using your own mobile number.

SECURITY
Never put your Semaphore API key inside index.html, api/send-sms.js, vercel.json, or GitHub.
The API key must only be stored as a Vercel Environment Variable.

NOTES
- The portal stores finalist monitoring data in the browser's localStorage. It is not a shared cloud database.
- Sending Part 1/2/3 makes separate Semaphore message requests.
- Long SMS may be split into multiple SMS segments by Semaphore/telco and consume corresponding credits.
