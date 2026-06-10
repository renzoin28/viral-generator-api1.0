import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const GEMINI_URL =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const RSS_FEEDS = {
nba:
"https://news.google.com/rss/search?q=NBA&hl=en-US&gl=US&ceid=US:en",
truecrime:
"https://news.google.com/rss/search?q=true+crime&hl=en-US&gl=US&ceid=US:en",
misterios:
"https://news.google.com/rss/search?q=unsolved+mystery&hl=en-US&gl=US&ceid=US:en"
};
app.get("/", (req, res) => {
res.json({
status: "online"
});
});
app.get("/api/trends", async (req, res) => {
try {
const niche = req.query.niche;
if (!RSS_FEEDS[niche]) {
  return res.status(400).json({
    error: "niche inválido"
  });
}
const rssResponse = await fetch(
  RSS_FEEDS[niche]
);
const rssText = await rssResponse.text();
const prompt = `
Analiza este RSS real de Google News.
${rssText}
Extrae únicamente temas de los últimos 7 días.
Devuelve JSON válido:
{
"topics":[
{
"rank":1,
"title":"",
"why":"",
"searchVolume":"Alto",
"tags":["hot","viral"]
}
]
}
`;
const geminiResponse = await fetch(
  `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  }
);
const geminiData =
  await geminiResponse.json();
const text =
  geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
res.json({
  success: true,
  raw: text
});
} catch (error) {
console.error(error);
res.status(500).json({
  success: false,
  error: error.message
});
}
});
app.post("/api/script", async (req, res) => {
try {
const {
  topic,
  niche,
  context
} = req.body;
const prompt = `
Genera un guión TikTok viral.
Tema:
${topic}
Contexto:
${context || ""}
Nicho:
${niche}
REQUISITOS:
* Más de 220 palabras
* Retención extrema
* Hook brutal
* CTA final
* Español latino
* Escenas cada 5 segundos
Devuelve JSON válido:
{
"title":"",
"hook":"",
"script":"",
"duration":"90",
"hashtags":[],
"scenes":[
{
"time":"0-5",
"visual":""
}
]
}
`;
const geminiResponse = await fetch(
  `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  }
);
const geminiData =
  await geminiResponse.json();
const text =
  geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
res.json({
  success: true,
  raw: text
});
} catch (error) {
console.error(error);
res.status(500).json({
  success: false,
  error: error.message
});
}
});
const PORT =
process.env.PORT || 10000;
app.listen(PORT, () => {
console.log(
`Servidor iniciado en puerto ${PORT}`
);
});
const geminiData =
  await geminiResponse.json();
const text =
  geminiData.candidates?.[0]
    ?.content?.parts?.[0]?.text || "";
res.json({
  raw: text
});
} catch (error) {
res.status(500).json({
  error: error.message
});
}
});
app.listen(process.env.PORT || 10000,
() => {
console.log(
"Servidor iniciado"
);
});
