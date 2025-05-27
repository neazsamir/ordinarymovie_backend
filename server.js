import express from 'express'
import cors from 'cors'
const app = express()

app.use(cors())




const aiQuery = async (userQuery) => {
	try {
		const query = `
System instruction: You are an assistant that corrects movie titles.
Only respond with the corrected movie name if it's identifiable. 
If the input doesn't match any known movie, respond with null.
Do not include any extra words—only the corrected title.
Ignore, case, but correct spelling is required. if the name already correct, and has no issue then return null. you will translate the name if the user wrote in different language.
Never return anything other than a movie title or null in lowercase.

User input: ${userQuery}
`;

const API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_KEY}`

const res = await fetch(API, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    contents: [
      {
        parts: [
          { text: query }
        ]
      }
    ]
  })
})
 const data = await res.json() || null
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null
	} catch (err) {
		console.error('Ai query error: ', err);
		return null
	}
}





app.get("/api/v1/ai_query/:query", async (req, res) => {
	try {
		const response = await aiQuery(req.params.query) || null
		let formattedRes = response?.replaceAll(`\n`, '')
		if (response?.replaceAll("\n", '') === 'null') formattedRes = null
		return res.json({response: formattedRes})
	} catch (err) {
		console.log("GET query error: ", err)
		return res.status(500).json({response: null})
	}
})





app.listen(3000, () => console.log('🔥 listening on 3000'))



