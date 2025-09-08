const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

// Bedrock model access is in us-east-1 for your account
const client = new BedrockRuntimeClient({ region: "us-east-1" });

exports.handler = async (event) => {
  try {
    const ingredients = event.arguments?.ingredients || [];
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error("ingredients must be a non-empty array of strings");
    }

    const userPrompt = `
You are a helpful chef. Create ONE delicious recipe that uses ONLY these ingredients if possible:
${ingredients.map((x) => `- ${x}`).join("\n")}

Return JSON with this exact shape:
{
  "title": "string",
  "servings": number,
  "ingredients": ["string", ...],
  "steps": ["string", ...]
}
No commentary. Strict JSON only.
`.trim();

    const modelId = "anthropic.claude-3-sonnet-20240229-v1:0";

    const body = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 800,
      temperature: 0.6,
      messages: [{ role: "user", content: [{ type: "text", text: userPrompt }] }],
    };

    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: Buffer.from(JSON.stringify(body)),
    });

    const response = await client.send(command);
    const json = JSON.parse(new TextDecoder("utf-8").decode(response.body));
    const text = json?.content?.[0]?.text || "";
    const recipe = JSON.parse(text); // strict JSON expected
    return recipe;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to generate recipe. Please try different ingredients.");
  }
};
