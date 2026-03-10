const url = "http://localhost:3000/api/news/submit";
fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://mobile.igihe.com/ikoranabuhanga/article/harimo-uwo-gukoresha-ai-mu-gusuzuma-indembe-imishinga-myiza-yahembwe-na-santech" })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
