// lambda/basicWebappHandler/index.js
exports.handler = async (event) => {
  console.log("Request event:", JSON.stringify(event));
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, message: "Hello from Lambda!" }),
  };
};
