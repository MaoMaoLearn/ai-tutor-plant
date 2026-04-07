export const AI_TUTOR_WEBHOOK_URL = "https://MaoMaoAILLM-n8n-free.hf.space/webhook/ai-tutor";

/**
 * Send a generic POST request to the n8n webhook
 */
const sendToWebhook = async (payload) => {
  try {
    const response = await fetch(AI_TUTOR_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    if (!text) return {};

    try {
      let data = JSON.parse(text);

      // Sometimes n8n double-stringifies the output. Try parsing it again if it's still a string.
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (innerError) {
          // It was just a normal string, not stringified JSON. Leave it as is.
        }
      }
      
      // Handle the case where n8n returns an Array with 1 item
      if (Array.isArray(data) && data.length > 0) {
        data = data[0];
      }
      
      // Handle the case where the data is nested inside an 'output' property
      if (data && typeof data === 'object' && data.output && typeof data.output === 'object') {
        data = { ...data, ...data.output };
      }

      // Handle the case where the user renamed 'metacognitive' to 'metacognition'
      if (data && data.metacognition && !data.metacognitive) {
        data.metacognitive = data.metacognition;
      }
      
      // Handle nested cheatSheet object if Autoparser returns it as an object inside the JSON body
      if (data && data.cheatSheet && typeof data.cheatSheet === 'object') {
        if (data.cheatSheet.message) {
          data.message = data.cheatSheet.message;
        }
        if (data.cheatSheet.cheatSheet) {
          data.cheatSheet = data.cheatSheet.cheatSheet;
        } else {
          // Fallback if the object exists but doesn't have a cheatSheet property
          data.cheatSheet = JSON.stringify(data.cheatSheet);
        }
      }

      return data;
    } catch (e) {
      // If it's pure text (not JSON), return the text wrapped in an object
      return { text };
    }
  } catch (error) {
    console.error("Webhook interaction failed:", error);
    throw error;
  }
};

/**
 * Send a student dialogue turn to the AI Tutor webhook.
 */
export const sendDialogueTurn = async (sessionId, studentMessage, conceptTopic) => {
  const payload = {
    sessionId,
    studentMessage,
    conceptTopic,
    isEndSession: false,
  };
  return await sendToWebhook(payload);
};

/**
 * End the session and fetch the completed cheat sheet.
 */
export const sendEndSession = async (sessionId, studentMessage, conceptTopic) => {
  const payload = {
    sessionId,
    studentMessage: studentMessage || "", // Optional ending message
    conceptTopic,
    isEndSession: true,
    cheatSheet: true,
  };
  return await sendToWebhook(payload);
};
