async function runAIFill() {
    if (!window.location.href.includes("docs.google.com/forms")) {
        alert("This extension only works on Google Forms.");
        return;
    }

    // Get all question labels
    const questions = [...document.querySelectorAll("div[role='listitem']")];

    if (questions.length === 0) {
        alert("No questions detected.");
        return;
    }

    // Create a summary prompt for the Chrome AI model
    const prompt = `
You are an assistant that generates short, reasonable answers to a Google Form.
For each question, create a simple and believable response.

Return answers in this format:
ANSWER 1: <text>
ANSWER 2: <text>
ANSWER 3: <text>
...
    
Questions:
${questions.map((q, i) => `${i+1}. ${q.innerText.trim()}`).join("\n")}
    `;

    // Load Chrome's built-in AI model
    const session = await chrome.ai.languageModel.create({
        modelId: "text-model-small"
    });

    const result = await session.prompt(prompt);

    // Parse AI answers
    const answerLines = result.split("\n").filter(l => l.startsWith("ANSWER"));

    questions.forEach((q, i) => {
        const input = q.querySelector("input, textarea");

        if (input && answerLines[i]) {
            const answer = answerLines[i].split(":")[1].trim();
            input.value = answer;
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }
    });

    alert("Form auto-filled using AI!");
}

runAIFill();
