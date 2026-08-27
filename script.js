document.addEventListener("DOMContentLoaded", () => {
    // Form Elements
    const topicInput = document.querySelector('textarea[placeholder*="post idea"]');
    const pageIdInput = document.querySelector('input[placeholder*="FB Page ID"]');
    const tokenInput = document.querySelector('input[placeholder*="Page Access Token"]');
    const publishBtn = document.querySelector('button');
    const previewText = document.querySelector('.live-preview-text, p'); // Preview container

    // Live Preview Update Event
    if (topicInput && previewText) {
        topicInput.addEventListener("input", (e) => {
            const val = e.target.value.trim();
            previewText.textContent = val !== "" 
                ? val 
                : "Write a topic on the left to view a live preview of your content prompt...";
        });
    }

    // Webhook Publish Action
    if (publishBtn) {
        publishBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const topic = topicInput ? topicInput.value.trim() : "";
            const pageId = pageIdInput ? pageIdInput.value.trim() : "";
            const pageToken = tokenInput ? tokenInput.value.trim() : "";

            // Validation Check
            if (!topic || !pageId || !pageToken) {
                alert("Kripya saare fields (Topic, Page ID, Page Access Token) fill karein.");
                return;
            }

            // Replace with your actual n8n Webhook URL
            const WEBHOOK_URL = "http://localhost:5678/webhook-test/Image generate";

            const payload = {
                topic: topic,
                page_id: pageId,
                page_token: pageToken,
                timestamp: new Date().toISOString()
            };

            // Loading UI state
            const originalBtnText = publishBtn.innerText;
            publishBtn.innerText = "Publishing...";
            publishBtn.disabled = true;

            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert("Post successfuly send ho gaya n8n webhook par!");
                    topicInput.value = "";
                    if (previewText) previewText.textContent = "Write a topic on the left to view a live preview of your content prompt...";
                } else {
                    const errorText = await response.text();
                    alert(`Webhook Error: ${response.status} - ${errorText}`);
                }
            } catch (error) {
                console.error("Fetch Request Failed:", error);
                alert("Webhook request fail ho gayi. Console check karein.");
            } finally {
                publishBtn.innerText = originalBtnText;
                publishBtn.disabled = false;
            }
        });
    }
});