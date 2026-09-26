PASINDAYAG S2 SMS PORTAL - FINAL GITHUB + NETLIFY PACKAGE

UPLOAD ALL OF THESE TO THE ROOT OF YOUR GITHUB REPOSITORY:
- index.html
- netlify.toml
- netlify/functions/send-sms.js

NETLIFY SETUP
1. Import the GitHub repository into Netlify.
2. Deploy the site. No build command is required.
3. In Netlify, open Project/Site configuration > Environment variables.
4. Add:
   SEMAPHORE_API_KEY = your private Semaphore API key
   SEMAPHORE_SENDER_NAME = your approved Semaphore Sender Name (optional if your account has a default approved sender name)
5. Redeploy the site after saving the environment variables.
6. Open the Netlify site URL, add a finalist, and test with your own mobile number first.

SECURITY
- Never place SEMAPHORE_API_KEY inside index.html, GitHub, screenshots, or public chat.
- The API key stays on Netlify's server-side function.

HOW SENDING WORKS
Browser -> /api/send-sms -> Netlify Function -> Semaphore API -> recipient phone

The portal sends each message part as a bulk request to the selected recipient numbers. Semaphore may split long SMS messages into multiple SMS segments and charge credits accordingly.
