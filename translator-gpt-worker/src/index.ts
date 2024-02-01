import OpenAI from "openai";


export interface Env {
	API_TOKEN: string;
	
}

const corsHeaders = {
	"Access-Control-Allow-Origin": "https://malaga.erikisaksson.se",
	"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

function handleOptions(request: Request) {
	if(request.headers.get("Origin") !== null && request.headers.get("Access-Control-Request-Method") !== null && request.headers.get("Access-Control-Request-Headers") !== null) {
		// Handle CORS pre-flight request.
		return new Response(null, {
			headers: corsHeaders
		})
	}
	else {
		// Handle standard OPTIONS request.
		return new Response(null, {
			headers: {
				"Allow": "GET, HEAD, POST, OPTIONS",
			}
		})
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if(request.method === "OPTIONS") {
			return handleOptions(request)
		}
		const openai = new OpenAI({ apiKey: env.API_TOKEN });

		const requestData: any = await request.json();
		const word = requestData.word;


		const chatCompletion = await openai.chat.completions.create({
			messages: [
				{role: "system", content: "You are a dictionary, short easy answers in english, don't include word in response, no translations" },
				{role: "user", content: `Define the word but don't mention the word: ${word}`}],
				model: 'gpt-3.5-turbo',
				max_tokens: 40,
				temperature: 0.7,
			});

			return new Response(JSON.stringify({response: chatCompletion.choices[0].message.content?.trim()}), {
				status: 200,
				headers: {
					"content-type": "application/json;charset=UTF-8",
					...corsHeaders
				},
			});
		




	},
};
