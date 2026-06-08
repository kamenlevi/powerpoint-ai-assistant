# PowerPoint AI — Eval Results
**Last run:** 2026-06-08 03:15:41  
**Overall: 80.6/100**  
**Model:** meta-llama/llama-3.1-8b-instruct

## Scores by category

| Category | Score | Trend | Cases |
|---|---|---|---|
| slide-add | 89.7/100 | — | 3 |
| slide-delete | 71.0/100 | — | 2 |
| text-format | 92.0/100 | — | 13 |
| text-edit | 92.4/100 | — | 14 |
| theme-apply ✓ | 95.0/100 | — | 2 |
| recolor | 93.2/100 | — | 18 |
| notes-write | 91.3/100 | — | 4 |
| shape-position | 91.4/100 | — | 22 |
| image-insert | 77.1/100 | — | 22 |
| web-search-needed | 82.0/100 | — | 25 |
| question-handling | 82.3/100 | — | 8 |
| animation | 91.0/100 | — | 1 |
| transition ✓ | 95.0/100 | — | 1 |
| slide-reorder | 94.0/100 | — | 1 |
| refusal | 69.4/100 | — | 21 |
| deck-generate | 75.4/100 | — | 21 |
| edge-cases | 77.5/100 | — | 21 |
| hyperlink | 68.5/100 | — | 21 |
| footer | 80.7/100 | — | 17 |
| table-add | 49.4/100 | — | 7 |
| alignment | 87.9/100 | — | 9 |
| font-pairing | 91.7/100 | — | 3 |
| image-grid | 89.0/100 | — | 1 |
| gradient-fill | 91.2/100 | — | 9 |
| slide-number | 82.0/100 | — | 7 |
| chart-add | 49.0/100 | — | 5 |
| header-footer | 88.6/100 | — | 7 |
| SmartArt | 54.4/100 | — | 5 |
| shadow-effect | 91.0/100 | — | 1 |
| agenda-slide | 94.0/100 | — | 1 |

## All test cases

| ID | Score | Pass | Reason |
|---|---|---|---|
| L1-slide-add-001 | 89 | ✓ | A: 22
The code uses the injected helper function addSlide, which is valid in this environment, but does not use the corr |
| L1-slide-add-002 | 89 | ✓ | A: 24
The code uses the injected helper function addSlide correctly, but does not use any PowerPoint native APIs.

B: 25 |
| L1-slide-add-003 | 91 | ✓ | A: 22
The code uses the correct addSlide helper, but lacks any error handling or checking for the current slide index.

 |
| L1-slide-delete-001 | 47 ⚠️ | ✓ | A: 22
The code uses the injected helper getSlideByIndex, but incorrectly uses it to get the slide at index 2 instead of  |
| L1-slide-delete-002 | 95 ✅ | ✓ | The code uses the correct injected helpers and follows best practices, but could be improved by using more descriptive variable names and adding error handling for the context.sync() call. |
| L1-text-format-001 | 94 | ✓ | The code correctly uses the injected helpers and PowerPoint Office.js APIs, fully addresses the request, and would execute without runtime errors, but it doesn't use the best approach by manually implementing the load and sync operations instead of relying on the injected helpers. |
| L1-text-format-002 | 90 | ✓ | A: 23
The code uses real PowerPoint Office.js APIs and the injected helpers, but incorrectly assumes that `presentation. |
| L1-text-format-003 | 98 ✅ | ✓ | The code uses the correct PowerPoint Office.js API and helpers, fully addresses the request, and would execute without runtime errors, but it doesn't use the applyTheme or recolorDeck helper for theming, instead manually setting the font color. |
| L1-text-edit-001 | 91 | ✓ | The code is mostly correct, but it could be improved by using the PowerPoint namespace and applying the theme |
| L1-text-edit-002 | 85 | ✓ | A: 20
The code uses real PowerPoint Office.js APIs, but it doesn't handle the case where a shape doesn't have a textFram |
| L1-theme-apply-001 | 95 ✅ | ✓ | The code uses the correct injected helper for theming, but could be improved by using the applyTheme helper with the BUILT_IN_THEMES object to ensure the correct theme is applied. |
| L1-theme-apply-002 | 95 ✅ | ✓ | The code uses the correct helper function to apply the theme, but it does not address the request to use the midnight theme "everywhere", implying it should be applied to all slides, not just the current one. |
| L1-recolor-001 | 95 ✅ | ✓ | The code uses the correct injected helper function recolorDeck and does not attempt to re-implement PowerPoint's theme API, but it does not address the request's specific color palette, which is a minor flaw. |
| L1-recolor-002 | 90 | ✗ | The code uses the correct helper function to apply the theme, but it doesn't address the request for a "calm, trustworthy theme" beyond just applying a pre-defined theme, and it doesn't use best practices for theming, as it doesn't consider using recolorDeck to customize the theme. |
| L1-notes-write-001 | 95 ✅ | ✓ | The code uses the correct injected helpers and follows best practices, but could be improved by adding a check to ensure the speaker note is being added to the correct slide. |
| L1-notes-write-002 | 89 | ✓ | A: 22
The code uses the injected helper `addSpeakerNote` correctly, but it's a very simple task and doesn't demonstrate  |
| L1-shape-position-001 | 93 | ✓ | A: 22
The code uses real PowerPoint Office.js APIs and injected helpers, but it doesn't handle potential errors when fin |
| L1-shape-position-002 | 88 | ✓ | A: 22
The code uses the injected helpers correctly, but it doesn't handle the case where the presentation is empty, whic |
| L1-image-insert-001 | 89 | ✓ | A: 22
The code uses the correct `insertImage` helper, but incorrectly specifies the slide index as 1 instead of 2.

B: 2 |
| L1-image-insert-002 | 95 ✅ | ✓ | The code uses the correct helper function for image insertion and does not attempt to re-implement it manually, but could benefit from more robust error handling. |
| L1-web-search-needed-001 | 85 | ✗ | A: 22
The response correctly identifies the limitation of not being able to provide real-time stock prices and suggests  |
| L1-web-search-needed-002 | 30 ⚠️ | ✗ | A: 0
The response is factually incorrect and does not identify what PowerPoint Office.js cannot do.

B: 5
The response i |
| L1-web-search-needed-003 | 70 | ✗ | The response is a correct and complete answer to the question, but it does not address the context of the PowerPoint deck or offer any workarounds or suggestions related to the Office.js API. |
| L1-question-handling-001 | 89 | ✓ | The code doesn't utilize the available |
| L1-question-handling-002 | 94 | ✓ | The code uses the correct injected helpers and PowerPoint APIs, but could improve by using the getSlideByIndex helper correctly to retrieve the second slide and by checking for null before accessing the text property of the shape. |
| L1-animation-001 | 91 | ✓ | A: 22
The code uses the injected helper `addSlide` correctly, but does not address the animation request fully.

B: 25
T |
| L1-transition-001 | 95 ✅ | ✓ | The code uses the correct injected helpers and follows best practices, but could be improved by adding a check for the current slide index before adding a new section divider slide. |
| L1-move-001 | 94 | ✓ | The code uses the correct moveSlide helper, but could be improved by considering the slide indices more carefully, as the current implementation might not work as expected due to 0-based indexing. |
| L1-refusal-002 | 47 ⚠️ | ✗ | A: 18
The response is factually correct that PowerPoint Office.js doesn't expose an exportToPdf() API, but it's incomple |
| L1-refusal-005 | 85 | ✓ | A: 20
The response correctly identifies that animations can only be applied at slide creation time and offers a workarou |
| L1-refusal-004 | 47 ⚠️ | ✗ | A: 18
The response correctly identifies that PowerPoint Office.js cannot create a bar chart directly, but it fails to pr |
| L1-deck-generate-001 | 88 | ✓ | A: 22
The code uses the injected helpers correctly, but it does not use the PowerPoint API to create the deck, instead r |
| L1-edge-case-001 | 50 ⚠️ | ✗ | The code does not attempt to delete the slide, instead asking the user to choose which slide to delete, and does not provide a solution to delete slide 99. |
| gen-L1-hyperlink-001 | 94 | ✗ | The code correctly uses the injected helpers and native APIs, fully addresses the request, and would execute without runtime errors, but could be improved by using the `addSlide` helper for new slides and the `insertImage` helper for image insertion. |
| gen-L1-text-format-easy-001 | 90 | ✗ | A: 23
The code uses the injected helpers correctly, but it does not use the PowerPoint namespace correctly, using `conte |
| gen-L1-text-format-easy-002 | 90 | ✗ | A: 24
The code uses the injected helpers correctly, but it doesn't use the PowerPoint namespace correctly, using `presen |
| gen-L1-text-edit-easy-001 | 90 | ✗ | The code is mostly correct, but it could be improved by using the PowerPoint namespace and the available helpers |
| gen-L1-text-edit-easy-002 | 95 ✅ | ✗ | A: 24
The code uses the injected helpers correctly and real PowerPoint Office.js APIs.

B: 25
The code fully addresses t |
| gen-L1-recolor-easy-001 | 95 ✅ | ✗ | The code uses the correct injected helpers and follows best practices, but could be improved by using more descriptive variable names and handling potential errors in the findShapeByName method. |
| gen-L1-recolor-easy-002 | 91 | ✗ | A: 22
The code uses the correct PowerPoint Office.js APIs and injected helpers, but incorrectly assumes the existence of |
| gen-L1-image-insert-easy-001 | 95 ✅ | ✓ | The code uses the correct helper function for image insertion, but could be improved by considering the position of the logo within the slide's content. |
| gen-L1-image-insert-easy-002 | 65 | ✗ | A: 22
The code uses the correct injected helper, insertImage, to add an image to the current slide, but does not address |
| gen-L1-web-search-needed-easy-001 | 89 | ✓ | A: 22
The code uses the injected helper function addSlide correctly, but does not use any other PowerPoint Office.js API |
| gen-L1-web-search-needed-easy-002 | 89 | ✗ | A: 22
The code uses the correct injected helpers, but does not use the native PowerPoint API for animation/transition, w |
| gen-L1-refusal-easy-001 | 85 | ✓ | A: 22
The code uses the injected helper `addSlide` correctly, but does not address the request fully, as it only adds a  |
| gen-L1-refusal-easy-002 | 95 ✅ | ✗ | The code uses the correct PowerPoint Office.js APIs and helpers, fully addresses the request, and would execute without runtime errors, but could be improved by using the applyTheme helper for theming instead of manual color setting. |
| gen-L1-edge-cases-easy-001 | 96 ✅ | ✗ | The code uses the correct injected helpers and follows best practices, but could be improved by removing redundant await statements. |
| gen-L1-edge-cases-easy-002 | 95 ✅ | ✗ | The code uses the correct injected helpers and follows best practices, but could be slightly improved by removing the unnecessary `await context.sync()` call after `presentation.slides.getItemAt(0).delete()`. |
| gen-L1-shape-position-easy-001 | 89 | ✓ | A: 22
The code uses the injected helper `addTextBox` correctly, but does not use the `await` keyword correctly, which is |
| gen-L1-shape-position-easy-002 | 94 | ✗ | The code correctly addresses the request, executes without runtime errors, and uses the available helpers, but could be improved by adding error handling for the case where the title shape is not found. |
| gen-L1-text-format-easy-003 | 91 | ✗ | The code is mostly correct |
| gen-L1-text-format-easy-004 | 88 | ✗ | A: 22
The code uses real PowerPoint Office.js APIs, but it does not handle potential errors when loading the shapes or f |
| gen-L1-text-edit-easy-003 | 94 | ✗ | The code is mostly correct, complete, and would work as intended, but it could benefit from using the injected helpers more consistently and checking for potential errors when loading shapes. |
| gen-L1-text-edit-easy-004 | 98 ✅ | ✗ | The code is mostly correct and complete, but it could be improved by using the injected helpers for theme management, and it assumes the existence of a body shape on the slide, which might not always be the case. |
| gen-L1-recolor-easy-003 | 95 ✅ | ✗ | The code uses the correct injected helpers and follows best practices, but could benefit from more robust error handling and a more explicit check for the title shape before attempting to modify its color. |
| gen-L1-recolor-easy-004 | 90 | ✗ | A: 23
The code uses the correct PowerPoint Office.js API, presentation.slides and slide.background.fill, but does not us |
| gen-L1-web-search-needed-easy-003 | 89 | ✓ | A: 24
The code uses the injected helper function addSlide correctly, but does not use any other PowerPoint Office.js API |
| gen-L1-web-search-needed-easy-004 | 85 | ✗ | A: 22
The code uses the injected helper `addSlide` correctly, but does not address the request fully, as it only adds a  |
| gen-L1-refusal-easy-003 | 91 | ✗ | The code is mostly correct, but has a small mistake in the load/sync |
| gen-L1-refusal-easy-004 | 94 | ✗ | A: 24
The code uses the correct PowerPoint Office.js APIs and injected helpers, but it does not handle the case where th |
| gen-L1-deck-generate-easy-001 | 89 | ✗ | A: 22
The code uses the injected helpers correctly, but incorrectly uses the addSlide method with a "title-content" layo |
| gen-L1-deck-generate-easy-002 | 65 | ✗ | A: 22
The code uses the injected helper function addSlide correctly, but it does not address the request fully, as it do |
| gen-L1-edge-cases-easy-003 | 94 | ✗ | The code uses the correct injected helpers and PowerPoint API, but does not address the request fully as it only deletes the second slide, but the request is to delete the second slide, implying it should be removed from the deck, which is not explicitly handled by the code. |
| gen-L1-edge-cases-easy-004 | 94 | ✗ | The code correctly uses the injected helpers and native APIs, fully addresses the request, and would execute without runtime errors, but could be improved by using the moveSlide helper instead of pop() and delete() methods. |
| gen-L1-hyperlink-easy-001 | 94 | ✗ | The code correctly addresses the request, executes without runtime errors, and uses the available helpers, but could benefit from a more robust error handling mechanism. |
| gen-L1-hyperlink-easy-002 | 71 | ✗ | A: 18
The code uses the injected helper functions correctly, but it incorrectly assumes the existence of a `textFrame` p |
| gen-L1-notes-write-easy-001 | 94 | ✓ | The code uses the correct injected helper for adding a speaker note, but does not follow best practices by not using the addSlide helper for new slides, and does not use the insertImage helper for image insertion. |
| gen-L1-notes-write-easy-002 | 87 | ✗ | A: 22
The code uses the injected helper `addSpeakerNote` correctly, but does not address the request fully, as it does n |
| gen-L1-image-insert-easy-003 | 95 ✅ | ✓ | The code uses the correct helper function for image insertion, but could be improved by considering the default image placement and size in the context of the existing slide content. |
| gen-L1-image-insert-easy-004 | 95 ✅ | ✗ | The code uses the correct helper function for image insertion and follows best practices, but could be more explicit about the image category and keywords. |
| gen-L1-shape-position-easy-003 | 91 | ✓ | A: 22
The code uses the injected helper function addTextBox correctly, but does not address the request's requirement fo |
| gen-L1-shape-position-easy-004 | 91 | ✗ | A: 22
The code uses real PowerPoint Office.js APIs and the injected helpers, but it does not handle potential errors whe |
| gen-L1-footer-001 | 88 | ✗ | A: 22
The code uses the correct PowerPoint Office.js APIs, but it does not handle potential errors that may occur when l |
| gen-L1-web-search-needed-easy-005 | 95 ✅ | ✗ | The code uses the correct helper functions for adding a new slide and setting its properties, but could benefit from more robust error handling and a more explicit check for the current slide index. |
| gen-L1-web-search-needed-easy-006 | 89 | ✗ | A: 22
The code uses the injected helper function addSlide correctly, but does not use any other PowerPoint Office.js API |
| gen-L1-refusal-easy-005 | 95 ✅ | ✓ | The code uses the injected helper function addTextBox correctly and follows best practices, but does not take advantage of the optional parameters of the helper function to specify the text box's properties. |
| gen-L1-refusal-easy-006 | 88 | ✗ | A: 22
The code uses the injected helpers correctly, but it doesn't check if the title shape is a placeholder before tryi |
| gen-L1-deck-generate-easy-003 | 65 | ✗ | A: 22
The code uses the injected helper `addSlide` correctly, but it does not address the request of setting a default f |
| gen-L1-deck-generate-easy-004 | 95 ✅ | ✗ | The code uses the correct helpers for adding a new slide and setting its background color, but could benefit from using the applyTheme helper for theming instead of manual color setting. |
| gen-L1-edge-cases-easy-005 | 95 ✅ | ✗ | The code uses the correct injected helpers and PowerPoint APIs, but could be improved by using the moveSlide helper instead of manually accessing presentation.slides.items[0]. |
| gen-L1-edge-cases-easy-006 | 95 ✅ | ✗ | The code is mostly correct, complete, and would work as intended, but it could benefit from using the injected helpers more consistently, especially for deleting the slide. |
| gen-L1-hyperlink-easy-003 | 94 | ✗ | The code uses the correct injected helpers and native APIs, but could benefit from more robust error handling and a more efficient approach to adding the hyperlink. |
| gen-L1-hyperlink-easy-004 | 85 | ✗ | The code mostly addresses the request, but it unnecessarily loads the shapes collection and uses find() to locate the text shape, which could be avoided by using addSlide with the correct text and hyperlink options. |
| gen-L1-recolor-easy-005 | 95 ✅ | ✗ | The code uses the correct injected helpers and follows best practices, but could be improved by adding error handling for the case where the title shape is not found. |
| gen-L1-recolor-easy-006 | 95 ✅ | ✗ | The code uses the correct injected helper to get the first slide and sets its background color correctly, but could benefit from using the injected helper for context.sync() instead of calling it directly. |
| gen-L1-image-insert-easy-005 | 95 ✅ | ✓ | The code uses the correct helper function insertImage to add a default image to the current slide, but does not address any potential issues with the image insertion, such as checking if the image was added successfully. |
| gen-L1-image-insert-easy-006 | 85 | ✗ | A: 22
The code uses the correct `insertImage` helper, but does not address the request fully, as it assumes the image is |
| gen-L1-text-edit-easy-005 | 89 | ✗ | A: 24
The code uses the injected helpers correctly and the PowerPoint Office.js APIs, but it doesn't use the `addSlide`  |
| gen-L1-text-edit-easy-006 | 96 ✅ | ✗ | The code uses the injected helpers correctly and follows best practices, but it could be improved by adding error handling for the case where the title shape is not found. |
| gen-L1-shape-position-easy-005 | 89 | ✓ | A: 22
The code uses the injected helper addTextBox, which is valid, but does not use the native PowerPoint API for addin |
| gen-L1-shape-position-easy-006 | 94 | ✗ | The code uses the correct injected helpers and native APIs, fully addresses the request, executes correctly, and uses best practices, but could be slightly improved by adding error handling for the findShapeByName method. |
| gen-L1-table-add-001 | 67 | ✗ | The code |
| gen-L1-text-format-easy-005 | 94 | ✗ | The code uses the correct injected helpers and native APIs, but could be improved by adding error handling for the case where the title shape is not found. |
| gen-L1-text-format-easy-006 | 95 ✅ | ✗ | The code uses the correct PowerPoint Office.js APIs, fully addresses the request, and would execute without runtime errors, but it could benefit from using the applyTheme helper for theming instead of manual font changes. |
| gen-L1-web-search-needed-easy-007 | 85 | ✗ | A: 22
The code uses the injected helper `addSlide` correctly, but does not address the request fully, as it does not add |
| gen-L1-web-search-needed-easy-008 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-question-handling-easy-001 | 100 ✅ | ✗ | The AI response is a simple query that does not require any code execution, making it a perfect score across all dimensions. |
| gen-L1-question-handling-easy-002 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-refusal-easy-007 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-refusal-easy-008 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"Novita","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-deck-generate-easy-005 | 47 ⚠️ | ✗ | A: 22
The code uses the injected helper function addSlide, which is valid in this environment, but does not address the  |
| gen-L1-deck-generate-easy-006 | 89 | ✗ | A: 22
The code uses the injected helper `addSlide` correctly, but does not use any other PowerPoint Office.js APIs, whic |
| gen-L1-edge-cases-easy-007 | 89 | ✓ | A: 22
The code uses the injected helpers correctly, but it does not use the PowerPoint.run method, which is required to  |
| gen-L1-edge-cases-easy-008 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"Groq","previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-hyperlink-easy-005 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"Novita","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-hyperlink-easy-006 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"WandB","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-footer-easy-001 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-footer-easy-002 | 94 | ✗ | The code uses the correct injected helpers and native APIs, but could benefit from a more robust approach to handling potential errors and edge cases. |
| gen-L1-recolor-easy-007 | 95 ✅ | ✗ | The code uses the correct injected helpers and native APIs, but could benefit from more robust error handling and a more efficient approach to changing the title text color. |
| gen-L1-recolor-easy-008 | 89 | ✗ | A: 22
The code uses the correct PowerPoint Office.js API, `slide.background.fill.setSolidColor`, to set the background c |
| gen-L1-image-insert-easy-007 | 95 ✅ | ✓ | The code uses the correct injected helper for image insertion and follows best practices, but could be improved by adding error handling for the insertImage call. |
| gen-L1-image-insert-easy-008 | 89 | ✓ | A: 22
The code uses the correct injected helper function insertImage, but does not check if the image was successfully a |
| gen-L1-shape-position-easy-007 | 79 | ✓ | A: 22
The code uses the correct injected helpers, but does not address the request fully (see B).

B: 18
The code adds a |
| gen-L1-shape-position-easy-008 | 89 | ✗ | A: 24
The code uses the injected helpers correctly, but it doesn't handle the case where the title shape is not found on |
| gen-L1-web-search-needed-easy-009 | 89 | ✗ | A: 22
The code uses the injected helper function addSlide correctly, but does not use any other PowerPoint Office.js API |
| gen-L1-web-search-needed-easy-010 | 89 | ✗ | A: 24
The code uses the injected helper `addSlide` correctly, but does not use any other PowerPoint Office.js APIs or na |
| gen-L1-refusal-easy-009 | 94 | ✓ | The code uses the correct injected helpers and follows best practices, but does not address potential runtime errors due to missing error handling. |
| gen-L1-refusal-easy-010 | 96 ✅ | ✗ | The code uses the correct PowerPoint Office.js APIs and helpers, fully addresses the request, and would execute without runtime errors, but could be improved by using the applyTheme helper for theming instead of manual font size adjustment. |
| gen-L1-deck-generate-easy-007 | 95 ✅ | ✗ | The code uses the correct helpers and follows best practices, but could be improved by adding a check for the current slide index before calling addSlide. |
| gen-L1-deck-generate-easy-008 | 83 | ✗ | A: 22
The code uses the injected helpers correctly, but it doesn't address the request fully, as it doesn't set the back |
| gen-L1-edge-cases-easy-009 | 71 | ✓ | A: 24
The code uses the correct PowerPoint Office.js APIs, but does not use the injected helpers for deleting a slide, w |
| gen-L1-edge-cases-easy-010 | 97 ✅ | ✗ | The code uses the correct injected helpers and PowerPoint APIs, and addresses the request fully, but could benefit from a more explicit check for the presentation having at least one slide before attempting to delete the first slide. |
| gen-L1-hyperlink-easy-007 | 85 | ✗ | The code correctly addresses the request, but its approach is somewhat manual and lacks best practices, as it directly manipulates the text frame and hyperlinks without using the available helpers. |
| gen-L1-hyperlink-easy-008 | 70 | ✗ | A: 18
The code uses the injected helpers correctly, but it incorrectly uses the `addSlide` helper to create a new slide  |
| gen-L1-footer-easy-003 | 95 ✅ | ✗ | The code uses the correct helper function to add a new slide with a footer, but could be improved by adding a check to ensure the slide is created successfully before proceeding. |
| gen-L1-footer-easy-004 | 94 | ✗ | The code uses the correct injected helpers and native APIs, but could benefit from a more robust approach to handling potential errors and edge cases. |
| gen-L1-alignment-001 | 94 | ✗ | The code uses the correct injected helpers and native APIs, fully addresses the request, and would execute without runtime errors, but could be improved by using the applyTheme helper for theming instead of manual alignment. |
| gen-L1-text-edit-easy-007 | 94 | ✗ | The code correctly uses the injected helpers and native APIs, fully addresses the request, and would execute without runtime errors, but could be improved by using the applyTheme helper for theming instead of manual text color changes. |
| gen-L1-text-edit-easy-008 | 89 | ✗ | A: 24
The code uses the injected helpers correctly, but incorrectly assumes the existence of a `load` method on the `sli |
| gen-L1-image-insert-easy-009 | 85 | ✓ | A: 22
The code uses the correct `insertImage` helper, but does not address the "default image" aspect, which is not clea |
| gen-L1-image-insert-easy-010 | 83 | ✗ | A: 22
The code uses the correct `insertImage` helper, but does not address the request fully, as it does not specify the |
| gen-L1-shape-position-easy-009 | 95 ✅ | ✓ | The code uses the injected helpers correctly, but could be improved by adding error handling for the await operation. |
| gen-L1-shape-position-easy-010 | 89 | ✗ | A: 22
The code uses real PowerPoint Office.js APIs and injected helpers, but lacks proper error handling for potential i |
| gen-L1-recolor-easy-009 | 89 | ✗ | The code is mostly correct, but it could be improved by using the PowerPoint namespace and applying the theme using a helper function. |
| gen-L1-recolor-easy-010 | 96 ✅ | ✗ | The code uses the correct injected helpers and native APIs, fully addresses the request, and would execute without runtime errors, but could be improved by using the applyTheme helper for theming instead of manual per-shape recoloring. |
| gen-L1-web-search-needed-easy-011 | 95 ✅ | ✗ | The code uses the correct injected helper for adding a new slide, but could benefit from more explicit error handling and checking for potential runtime errors. |
| gen-L1-web-search-needed-easy-012 | 85 | ✗ | A: 22
The code uses the injected helper `addSlide` correctly, but it does not address the request fully, as it does not  |
| gen-L1-refusal-easy-011 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"Novita","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-refusal-easy-012 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-deck-generate-easy-009 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"Novita","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-deck-generate-easy-010 | 65 | ✗ | A: 22
The code uses the injected helper `addSlide` correctly, but does not address the request for a default shape.

B:  |
| gen-L1-edge-cases-easy-011 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-edge-cases-easy-012 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-hyperlink-easy-009 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-hyperlink-easy-010 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-footer-easy-005 | 89 | ✗ | A: 22
The code uses the injected helper functions correctly, but incorrectly loads the shapes before adding the text box |
| gen-L1-footer-easy-006 | 0 ⚠️ | ✗ | Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"Novita","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-image-insert-easy-011 | 89 | ✓ | A: 22
The code uses the correct `insertImage` helper function, but does not check if the image is added successfully.

B |
| gen-L1-image-insert-easy-012 | 0 ⚠️ | ✗ | Runtime error: {"message":"The operation was aborted","code":504,"metadata":{"provider_name":"Cloudflare","previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}} |
| gen-L1-font-pairing-001 | 89 | ✗ | A: 22
The code uses real PowerPoint Office.js APIs and the injected helpers correctly, but it does not handle the case w |
| gen-L1-shape-position-easy-011 | 94 | ✓ | The code uses the correct injected helpers and PowerPoint Office.js APIs, but it does not address the request fully as it does not position the text box at the bottom of the slide. |
| gen-L1-shape-position-easy-012 | 89 | ✗ | The code is mostly correct, but it could be improved by using the |
| gen-L1-image-grid-001 | 89 | ✓ | A: 22
The code uses the correct injected helpers and PowerPoint Office.js APIs, but incorrectly uses the `insertImage` h |
| gen-L1-web-search-needed-easy-013 | 89 | ✓ | A: 24
The code uses the injected helper function addSlide correctly, but does not use any other PowerPoint Office.js API |
| gen-L1-web-search-needed-easy-014 | 89 | ✗ | A: 22
The code uses the injected helper function addSlide, but does not use the injected helper for theming, instead of  |
| gen-L1-deck-generate-easy-011 | 94 | ✗ | A: 24
The code uses the injected helper function addSlide, which is valid in this environment, but it does not use the P |
| gen-L1-deck-generate-easy-012 | 89 | ✗ | A: 24
The code uses the correct PowerPoint Office.js APIs and injected helpers, but incorrectly assumes the existence of |
| gen-L1-edge-cases-easy-013 | 95 ✅ | ✓ | The code uses the correct injected helpers and follows best practices, but could be slightly improved by removing the unnecessary `await context.sync()` call after `slide.delete()`. |
| gen-L1-edge-cases-easy-014 | 95 ✅ | ✗ | The code uses the correct injected helpers and follows best practices, but could be slightly improved by removing the unnecessary `await context.sync()` call after `firstSlide.delete()`. |
| gen-L1-hyperlink-easy-011 | 89 | ✗ | A: 24
The code uses the injected helpers correctly, but it doesn't use the PowerPoint namespace correctly, instead using |
| gen-L1-hyperlink-easy-012 | 71 | ✗ | A: 22
The code uses the injected helper function addSlide correctly, but it does not fully address the request of creati |
| gen-L1-footer-easy-007 | 94 | ✓ | The code correctly uses the injected helpers and native APIs, but does not address the request fully as it only adds a text box to the slide, but does not explicitly set it as a footer. |
| gen-L1-footer-easy-008 | 89 | ✓ | A: 22
The code uses the injected helper `addTextBox` correctly, but it does not use the `addSlide` helper to add a new s |
| gen-L1-table-add-easy-001 | 95 ✅ | ✗ | The code uses the correct PowerPoint Office.js APIs and helpers, fully addresses the request, and would execute without runtime errors, but could be improved by using the addSlide helper to add the table to a new slide instead of modifying the current slide. |
| gen-L1-table-add-easy-002 | 65 | ✓ | A: 22
The code uses real PowerPoint Office.js APIs and the injected helpers, but it does not address the request of addi |
| gen-L1-gradient-fill-001 | 87 | ✗ | A: 22
The code uses real PowerPoint Office.js APIs and the injected helpers correctly, but it does not handle the case w |
| gen-L1-image-insert-easy-013 | 95 ✅ | ✓ | The code uses the correct helper function for image insertion and follows best practices, but could be improved by adding a more descriptive comment or logging statement to indicate what's happening. |
| gen-L1-image-insert-easy-014 | 0 ⚠️ | ✗ | The AI response does not generate any code, instead asking for additional information and providing a list of categories, but does not address the request to put an image on the current slide. |
| gen-L1-refusal-easy-013 | 95 ✅ | ✓ | A: 24
The code uses the injected helper `addSlide` correctly, but does not use the `await` keyword correctly, which is n |
| gen-L1-refusal-easy-014 | 94 | ✗ | The code correctly changes the title of the first slide, but could benefit from using the injected helpers for theme management and slide navigation. |
| gen-L1-alignment-easy-001 | 89 | ✗ | A: 22
The code uses the injected helper `addTextBox` correctly, but does not use any PowerPoint native APIs, and does no |
| gen-L1-alignment-easy-002 | 89 | ✗ | A: 24
The code uses the correct PowerPoint Office.js APIs and injected helpers, but incorrectly assumes the existence of |
| gen-L1-slide-number-001 | 85 | ✓ | A: 22
The code uses the injected helpers correctly, but incorrectly uses presentation.slides.load() and context.sync() w |
| gen-L1-recolor-easy-011 | 94 | ✗ | The code is mostly correct and complete, but it could benefit from using the injected helpers for theme management and animation, and it lacks error handling for the findShapeByName method. |
| gen-L1-recolor-easy-012 | 95 ✅ | ✗ | The code uses the correct injected helpers and follows best practices, but could be improved by adding a check for the slide's existence before attempting to modify its background color. |
| gen-L1-shape-position-easy-013 | 91 | ✓ | A: 22
The code uses the injected helper `addTextBox` correctly, but does not use any native PowerPoint APIs.

B: 25
The  |
| gen-L1-shape-position-easy-014 | 92 | ✗ | A: 24
The code uses the injected helpers correctly, but it doesn't handle the case where the title shape is not found on |
| gen-L1-chart-add-001 | 43 ⚠️ | ✗ | The code partially addresses the request by adding an image, but it does not create a bar chart, and it uses the incorrect helper method addImage instead of insertImage. |
| gen-L1-web-search-needed-easy-015 | 85 | ✗ | A: 22
The code uses the injected helper `addSlide` correctly, but does not address the request fully, as it only adds a  |
| gen-L1-web-search-needed-easy-016 | 95 ✅ | ✗ | The code uses the correct helpers and follows best practices, but does not address the request for information about the city of London in the slide's body, notes, or title. |
| gen-L1-deck-generate-easy-013 | 64 | ✓ | A: 22
The code uses real PowerPoint Office.js APIs and the injected helpers correctly, but it does not address the reque |
| gen-L1-deck-generate-easy-014 | 91 | ✓ | The code mostly uses the injected helpers correctly, but could benefit |
| gen-L1-edge-cases-easy-015 | 89 | ✗ | A: 22
The code uses the correct PowerPoint Office.js APIs, but it's a very basic implementation that doesn't take advant |
| gen-L1-edge-cases-easy-016 | 98 ✅ | ✗ | The code uses the correct injected helpers and follows best practices, but it could be slightly improved by removing the unnecessary `await context.sync()` call after `s.delete()`. |
| gen-L1-hyperlink-easy-013 | 84 | ✗ | The code uses the injected helpers correctly, but it doesn't use the addSlide helper to add a new text frame with the hyperlink, and it doesn't check if the text range is found before trying to add a hyperlink to it. |
| gen-L1-hyperlink-easy-014 | 84 | ✓ | A: 20
The code uses the injected helpers correctly, but incorrectly sets the text of the text frame after setting the hy |
| gen-L1-footer-easy-009 | 94 | ✓ | The code uses the correct injected helpers and PowerPoint APIs, but could benefit from more robust error handling and a more efficient approach to adding the footer. |
| gen-L1-footer-easy-010 | 94 | ✗ | The code correctly uses the injected helpers and native APIs, but lacks a theme application or recoloring, which is a minor flaw. |
| gen-L1-gradient-fill-easy-001 | 95 ✅ | ✗ | The code uses the correct PowerPoint Office.js APIs and helpers, but could improve by using the addSlide helper to add the new slide with a gradient fill, instead of manually loading the first slide and adding the shape. |
| gen-L1-gradient-fill-easy-002 | 94 | ✗ | The code correctly applies a gradient fill to the first shape on the first slide, but could benefit from using the injected helpers for theme management and slide navigation. |
| gen-L1-header-footer-001 | 89 | ✗ | A: 22
The code uses the injected helpers correctly, but incorrectly uses `addTextBox` with the slide index as the first  |
| gen-L1-question-handling-easy-003 | 91 | ✓ | A: 24
The code uses the injected helpers as intended, but does not use the PowerPoint namespace correctly, instead using |
| gen-L1-question-handling-easy-004 | 89 | ✗ | A: 22
The code uses the correct PowerPoint Office.js API, specifically presentation.slides.load and context.sync, but do |
| gen-L1-slide-number-easy-001 | 89 | ✗ | A: 22
The code uses the injected helper function addTextBox, which is valid in this environment, but does not use any na |
| gen-L1-slide-number-easy-002 | 95 ✅ | ✗ | The code uses the correct addSlide helper and meets the request, but does not address the slide number addition, which is a crucial part of the request. |
| gen-L1-text-edit-easy-009 | 94 | ✗ | A: 22
The code uses the injected helpers correctly and real PowerPoint Office.js APIs, but it does not handle potential  |
| gen-L1-text-edit-easy-010 | 95 ✅ | ✗ | The code uses the correct PowerPoint Office.js APIs and helpers, fully addresses the request, and would execute without runtime errors, but it could be improved by using the applyTheme helper for theming instead of manual per-shape recoloring. |
| gen-L1-shape-position-easy-015 | 89 | ✓ | A: 22
The code uses the injected helper addTextBox, which is valid, but does not use any native PowerPoint Office.js API |
| gen-L1-shape-position-easy-016 | 98 ✅ | ✗ | The code is complete, correct, and would work as expected, but it doesn't use the available helpers for moving the title shape, instead manually setting its position. |
| gen-L1-image-insert-easy-015 | 89 | ✓ | A: 24
The code uses the correct injected helper function insertImage, but does not check if the image is added successfu |
| gen-L1-image-insert-easy-016 | 96 ✅ | ✓ | The code uses the correct helper function for image insertion, but does not check if the image is already present on the slide before inserting it, which could lead to duplicate images. |
| gen-L1-refusal-easy-015 | 92 | ✗ | The code uses the injected helpers correctly, but could be improved by using native |
| gen-L1-refusal-easy-016 | 95 ✅ | ✓ | The code uses the correct injected helpers and follows best practices, but does not provide any feedback or error handling in case the helper calls fail. |
| gen-L1-chart-add-easy-001 | 7 ⚠️ | ✗ | A: 0
The code uses a hallucinated method "insertImage" which is not a native PowerPoint Office.js API, but rather an inj |
| gen-L1-chart-add-easy-002 | 63 | ✗ | A: 20
The code uses the correct injected helper `insertImage` to insert an image of a chart, but it doesn't address the  |
| gen-L1-recolor-easy-013 | 94 | ✗ | The code is mostly correct, but it could be improved by using |
| gen-L1-recolor-easy-014 | 89 | ✗ | A: 24
The code uses the injected helper getSlideByIndex, which is valid, and the PowerPoint API correctly to set the bac |
| gen-L1-web-search-needed-easy-017 | 89 | ✗ | A: 22
The code uses the injected helper function addSlide correctly, but does not use any other PowerPoint Office.js API |
| gen-L1-web-search-needed-easy-018 | 94 | ✗ | The code uses the correct helpers for adding a new slide and does not attempt to re-implement PowerPoint functionality manually, but could benefit from more robust error handling and theming. |
| gen-L1-deck-generate-easy-015 | 47 ⚠️ | ✗ | A: 22
The code uses the injected helper function addSlide correctly, but does not address the request fully.

B: 0
The c |
| gen-L1-deck-generate-easy-016 | 47 ⚠️ | ✓ | A: 18
The code uses the injected helper `addSlide` correctly, but it does not fully address the request as it does not u |
| gen-L1-edge-cases-easy-017 | 94 | ✗ | The code uses the injected helpers correctly, but could be improved by using more precise error handling and checking for the existence of slides before attempting to delete the first one. |
| gen-L1-edge-cases-easy-018 | 95 ✅ | ✗ | The code uses the correct injected helpers and follows best practices, but could be improved by removing unnecessary `await context.sync()` calls. |
| gen-L1-hyperlink-easy-015 | 91 | ✗ | The code is mostly correct, but it's missing an await keyword and doesn't use the addTextBox helper. |
| gen-L1-hyperlink-easy-016 | 75 | ✓ | A: 18
The code uses the injected helpers correctly, but it incorrectly uses the addTextBox method to add a hyperlink, wh |
| gen-L1-footer-easy-011 | 96 ✅ | ✓ | The code uses the correct injected helpers and PowerPoint APIs, but it could benefit from using the addSlide helper to add the footer as a new shape on the slide, rather than manually loading the placeholder format and text range. |
| gen-L1-footer-easy-012 | 88 | ✓ | A: 22
The code uses the correct PowerPoint Office.js APIs, but it doesn't handle potential errors that might occur when  |
| gen-L1-gradient-fill-easy-003 | 90 | ✗ | A: 23
The code uses the injected helpers correctly, but it does not use the PowerPoint namespace correctly, instead usin |
| gen-L1-gradient-fill-easy-004 | 90 | ✗ | The code is |
| gen-L1-header-footer-easy-001 | 95 ✅ | ✗ | The code uses the correct injected helpers and follows best practices, but could be improved by adding a check for the existence of the first slide before adding a text box to it. |
| gen-L1-header-footer-easy-002 | 63 | ✗ | A: 22
The code uses real PowerPoint Office.js APIs, but it doesn't fully address the request (footer with "Page 1" on th |
| gen-L1-alignment-easy-003 | 95 ✅ | ✗ | The code uses the injected helper function addTextBox correctly and aligns the text box to the center as requested, but does not use the best practice of using the PowerPoint namespace for the shape properties. |
| gen-L1-alignment-easy-004 | 89 | ✗ | A: 22
The code uses real PowerPoint Office.js APIs, but it does not check if the title shape has a text frame or a text  |
| gen-L1-smartart-001 | 25 ⚠️ | ✗ | The AI response fails to address the original request and does not use the available helpers to provide a solution. |
| gen-L1-shape-position-easy-017 | 95 ✅ | ✓ | The code uses the correct injected helper for adding a text box, but could benefit from more robust error handling and checking for potential issues like shape overlap or invalid coordinates. |
| gen-L1-shape-position-easy-018 | 92 | ✗ | A: 23
The code uses the injected helpers correctly, but does not use the PowerPoint native API for loading shapes, inste |
| gen-L1-image-insert-easy-017 | 89 | ✓ | A: 22
The code uses the correct injected helper, insertImage, to add a default image to the first slide, but it does not |
| gen-L1-image-insert-easy-018 | 89 | ✓ | A: 22
The code uses the correct `insertImage` helper, but does not check if the image is actually added to the slide, wh |
| gen-L1-table-add-easy-003 | 25 ⚠️ | ✗ | A: 0
The code uses the injected helpers as intended, but it incorrectly adds three new slides instead of just one table. |
| gen-L1-table-add-easy-004 | 25 ⚠️ | ✗ | The code fails to address the request and does not use the available helpers, making it a partial and inefficient solution. |
| gen-L1-shadow-effect-001 | 91 | ✗ | The code correctly addresses the request, but its approach is somewhat manual and could be improved by using the available helpers, and there's a minor issue with the load/sync order. |
| gen-L1-text-format-easy-007 | 91 | ✗ | A: 22
The code uses real PowerPoint Office.js APIs and the injected helpers, but it does not handle the case where the t |
| gen-L1-text-format-easy-008 | 94 | ✗ | The code uses the correct injected helpers and native APIs, but could be improved by using the applyTheme helper for theming instead of manual font changes. |
| gen-L1-web-search-needed-easy-019 | 65 | ✗ | A: 22
The code uses the injected helper function addSlide correctly, but does not address the request fully, as it does  |
| gen-L1-web-search-needed-easy-020 | 95 ✅ | ✗ | The code uses the correct helpers for adding a new slide and does not attempt to re-implement PowerPoint's functionality, but it does not address the request's context, which is to create a new slide with information about the company PowerPoint, and the new slide does not include any notes. |
| gen-L1-deck-generate-easy-017 | 96 ✅ | ✗ | The code uses the correct injected helpers and follows best practices, but it does not address the request fully as it does not create a single-slide presentation with a title 'Hello World' in the context of the provided deck. |
| gen-L1-deck-generate-easy-018 | 96 ✅ | ✗ | A: 24
The code uses the injected helper function addSlide, which is valid in this environment, but it does not use the P |
| gen-L1-edge-cases-easy-019 | 95 ✅ | ✗ | The code uses the correct PowerPoint Office.js APIs and helpers, fully addresses the request, and would execute without runtime errors, but it doesn't use the available helpers for theming, instead of using the injected helpers like applyTheme or recolorDeck. |
| gen-L1-edge-cases-easy-020 | 90 | ✗ | A: 22
The code uses real PowerPoint Office.js APIs and the injected helpers, but it could be more concise.

B: 25
The co |
| gen-L1-hyperlink-easy-017 | 95 ✅ | ✗ | The code uses the correct injected helpers and PowerPoint APIs, fully addresses the request, and would execute without runtime errors, but it could be improved by using the applyTheme helper for theming instead of manual recoloring. |
| gen-L1-hyperlink-easy-018 | 85 | ✓ | The code uses the injected helpers correctly, but it manually sets font properties for both the text and the hyperlink, which is unnecessary and could be improved by using the addTextBox helper with the correct options. |
| gen-L1-footer-easy-013 | 88 | ✗ | A: 22
The code uses the injected helper functions correctly, but it does not handle potential errors that may occur when |
| gen-L1-footer-easy-014 | 89 | ✓ | A: 22
The code uses the injected helper `addTextBox` correctly, but it doesn't use the `addSlide` helper to add the foot |
| gen-L1-gradient-fill-easy-005 | 94 | ✗ | The code uses the correct injected helpers and PowerPoint APIs, but lacks a proper error handling mechanism and does not address potential issues with the gradient fill, such as checking for existing shapes or handling potential errors when setting the gradient fill. |
| gen-L1-gradient-fill-easy-006 | 94 | ✗ | The code correctly applies a gradient fill to the title shape, but does not address the request of applying a gradient fill to the only shape on a blank slide with a title, as the slide already has a title shape. |
| gen-L1-header-footer-easy-003 | 89 | ✗ | A: 22
The code uses the injected helper function addSlide, which is correct, but it does not specify any options for the |
| gen-L1-header-footer-easy-004 | 94 | ✗ | The code correctly uses the injected helpers and native APIs, fully addresses the request, executes without runtime errors, and uses best practices, but could be improved by adding error handling for the context.sync() calls. |
| gen-L1-alignment-easy-005 | 92 | ✗ | The code uses the injected helpers correctly, but it could be improved by adding error handling for the await context.sync() call, which may not be necessary in this specific case, but it's a good practice to include it. |
| gen-L1-alignment-easy-006 | 89 | ✗ | A: 22
The code uses the injected helper addTextBox, which is valid, but it does not use the PowerPoint native API to set |
| gen-L1-slide-number-easy-003 | 65 | ✗ | A: 22
The code uses the injected helper `addSlide` correctly, but it does not add a slide number to the new slide.

B: 0 |
| gen-L1-slide-number-easy-004 | 96 ✅ | ✗ | The code uses the correct injected helpers and follows best practices, but does not address the request fully as it only inserts a slide number, whereas the request is to insert a slide number on the first slide of a presentation with one slide, implying additional setup or configuration might be needed. |
| gen-L1-SmartArt-easy-001 | 0 ⚠️ | ✗ | The AI response fails to provide a code solution, instead suggesting a non-existent workaround. |
| gen-L1-SmartArt-easy-002 | 90 | ✗ | The code uses the correct addSlide helper to insert a new slide with a title, but it does not address the original request of inserting a SmartArt graphic, and it does not use the insertImage helper for image insertion. |
| gen-L1-shape-position-easy-019 | 95 ✅ | ✗ | The code uses the injected helper function addTextBox correctly and follows best practices, but does not take advantage of the optional parameters of the helper function to specify the position of the text box more precisely. |
| gen-L1-shape-position-easy-020 | 94 | ✗ | The code correctly addresses the request, executes without runtime errors, and uses the available helpers, but could benefit from more robust error handling and a more efficient approach to centering the title shape. |
| gen-L1-refusal-easy-017 | 70 | ✓ | A: 22
The code uses the injected helper function addSlide correctly, but it does not fully address the request as it doe |
| gen-L1-refusal-easy-018 | 94 | ✗ | The code uses the correct injected helpers and native APIs, fully addresses the request, and would execute without runtime errors, but could be improved by using more descriptive variable names and handling potential errors in the findShapeByName method. |
| gen-L1-table-add-easy-005 | 69 | ✗ | A: 18
The code uses the injected helpers correctly, but incorrectly uses addTextBox to create a table, which is not a va |
| gen-L1-table-add-easy-006 | 0 ⚠️ | ✗ | A: 0
The code uses no real PowerPoint Office.js APIs or the injected helpers, instead relying on a loop that generates a |
| gen-L1-chart-add-easy-003 | 85 | ✗ | The code uses the correct helper function for inserting an image, but it doesn't address the request fully as it only inserts a chart image without creating an actual chart. |
| gen-L1-chart-add-easy-004 | 47 ⚠️ | ✗ | A: 18
The code uses the injected helper `addSlide` correctly, but it's missing the `addChart` functionality, which is no |
| gen-L1-agenda-slide-001 | 94 | ✗ | The code uses the correct injected helpers and follows best practices, but does not address the request fully as it does not create separate points for the agenda, and the approach is mostly correct but could be improved with more explicit theming. |
| gen-L1-text-format-easy-009 | 89 | ✗ | A: 24
The code uses the injected helpers correctly and the PowerPoint Office.js APIs, but it incorrectly assumes the exi |
| gen-L1-text-format-easy-010 | 92 | ✗ | A: 24
The code uses the injected helpers correctly, but it does not use the PowerPoint namespace correctly, instead usin |
| gen-L1-text-edit-easy-011 | 89 | ✗ | A: 24
The code uses the injected helpers correctly and the PowerPoint Office.js APIs, but it incorrectly uses `getSlideB |
| gen-L1-text-edit-easy-012 | 94 | ✗ | The code uses the correct PowerPoint Office.js APIs and helpers, but could benefit from more robust error handling and a more efficient approach to updating the slide's text. |
| gen-L1-web-search-needed-easy-021 | 95 ✅ | ✓ | A: 24
The code uses the injected helper function addSlide correctly, but does not use any other PowerPoint Office.js API |
| gen-L1-web-search-needed-easy-022 | 89 | ✗ | A: 22
The code uses the injected helper function addSlide correctly, but does not use any other PowerPoint Office.js API |
| gen-L1-deck-generate-easy-019 | 89 | ✓ | A: 22
The code uses the correct injected helper function addSlide, but lacks any error handling or validation for the in |
| gen-L1-deck-generate-easy-020 | 89 | ✗ | A: 22
The code uses the correct injected helper `addSlide` and provides the required parameters, but it does not use the |
| gen-L1-hyperlink-easy-019 | 89 | ✗ | A: 22
The code uses the injected helpers correctly, but incorrectly assumes the text to be modified is a single text fra |
| gen-L1-hyperlink-easy-020 | 83 | ✓ | The code mostly uses the injected helpers correctly, but it incorrectly uses addTextBox to add a hyperlink, and it doesn't properly address the request by not adding the hyperlink to the slide. |
| gen-L1-footer-easy-015 | 91 | ✓ | A: 22
The code uses the injected helpers correctly, but it does not use the PowerPoint namespace, which is a minor overs |
| gen-L1-footer-easy-016 | 89 | ✓ | A: 22
The code uses the correct PowerPoint Office.js API, `slide.shapes.addTextBox`, but does not use the injected helpe |
| gen-L1-gradient-fill-easy-007 | 88 | ✗ | A: 23
The code uses the injected helpers correctly, but incorrectly assumes the existence of `addShape` which is not a v |
| gen-L1-gradient-fill-easy-008 | 89 | ✗ | A: 22
The code uses the injected helpers correctly, but it incorrectly uses the `addTextBox` method to add a shape, when |
| gen-L1-header-footer-easy-005 | 95 ✅ | ✗ | The code uses the correct helper function to add a new slide with the specified title, but does not address the request to add a header with the text 'Sample' to the first slide. |
| gen-L1-header-footer-easy-006 | 95 ✅ | ✗ | The code uses the correct helper function to add a new slide with a footer, but does not address the original request of adding the footer to an existing slide. |
| gen-L1-recolor-easy-015 | 95 ✅ | ✗ | The code uses the correct injected helpers and native APIs, fully addresses the request, and would execute without runtime errors, but could be improved by using the applyTheme helper for theming instead of manual per-shape recoloring. |
| gen-L1-recolor-easy-016 | 96 ✅ | ✗ | The code uses the correct injected helpers and PowerPoint APIs, fully addresses the request, and would execute without runtime errors, but could be improved by using the applyTheme helper for theming instead of manual per-shape recoloring. |
| gen-L1-image-insert-easy-019 | 83 | ✓ | A: 22
The code uses the correct injected helper function insertImage, but does not address the request fully as it does  |
| gen-L1-image-insert-easy-020 | 0 ⚠️ | ✗ | The code does not use any PowerPoint Office.js APIs or the injected helpers, and instead asks the user for input, which is not a valid solution. |
| gen-L1-question-handling-easy-005 | 100 ✅ | ✓ | The code is a perfect implementation that uses the injected helpers correctly and does not attempt to use any non-existent PowerPoint Office.js APIs. |
| gen-L1-question-handling-easy-006 | 95 ✅ | ✗ | The code uses the injected helpers correctly and follows best practices, but could be improved by adding a check for an empty slide collection before trying to access its length. |
| gen-L1-alignment-easy-007 | 65 | ✗ | A: 22
The code uses the injected helper `addSlide` correctly, but does not address the request to align the title text t |
| gen-L1-alignment-easy-008 | 89 | ✗ | A: 22
The code uses the injected helper addTextBox, which is valid, but it does not use the PowerPoint native API to acc |
| gen-L1-font-pairing-easy-001 | 94 | ✗ | The code uses the correct injected helpers and native APIs, fully addresses the request, and would execute without runtime errors, but could be improved by using the applyTheme helper for theming instead of manual font changes. |
| gen-L1-font-pairing-easy-002 | 92 | ✗ | A: 23
The code uses the injected helpers correctly, but incorrectly assumes the existence of a `body` shape on the slide |
| gen-L1-slide-number-easy-005 | 47 ⚠️ | ✗ | A: 22
The code uses the injected helper function addSlide, which is valid in this environment, but it does not fully add |
| gen-L1-slide-number-easy-006 | 97 ✅ | ✗ | The code uses the correct injected helpers, follows best practices, and is free of runtime errors. |
| gen-L1-SmartArt-easy-003 | 67 | ✗ | A: 22
The code uses the injected helpers correctly, but incorrectly assumes the existence of an `addShape` method, which |
| gen-L1-SmartArt-easy-004 | 90 | ✗ | The code uses the correct injected helpers and best practices, but lacks a clear explanation of the workaround and its limitations, and does not fully address the original request for a basic SmartArt shape. |

## ⚠️ Needs attention

**[L1-slide-delete-001]** score=47 — A: 22
The code uses the injected helper getSlideByIndex, but incorrectly uses it to get the slide at index 2 instead of 

**[L1-web-search-needed-002]** score=30 — A: 0
The response is factually incorrect and does not identify what PowerPoint Office.js cannot do.

B: 5
The response i
- missing patterns: `NEEDS_WEB_SEARCH`

**[L1-refusal-002]** score=47 — A: 18
The response is factually correct that PowerPoint Office.js doesn't expose an exportToPdf() API, but it's incomple
- forbidden patterns found: `exportToPdf`

**[L1-refusal-004]** score=47 — A: 18
The response correctly identifies that PowerPoint Office.js cannot create a bar chart directly, but it fails to pr
- missing patterns: `doesn't expose`

**[L1-edge-case-001]** score=50 — The code does not attempt to delete the slide, instead asking the user to choose which slide to delete, and does not provide a solution to delete slide 99.
- missing patterns: `getSlideByIndex`

**[gen-L1-web-search-needed-easy-008]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `insertImage`, `shape.textFrame.textRange`

**[gen-L1-question-handling-easy-002]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `listSlides`

**[gen-L1-refusal-easy-007]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `addSlide`

**[gen-L1-refusal-easy-008]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"Novita","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `getSlideByIndex`, `shape.textFrame.textRange.text`

**[gen-L1-deck-generate-easy-005]** score=47 — A: 22
The code uses the injected helper function addSlide, which is valid in this environment, but does not address the 
- missing patterns: `shape.textFrame.textRange.font.size`

**[gen-L1-edge-cases-easy-008]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"Groq","previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `slide.delete()`

**[gen-L1-hyperlink-easy-005]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"Novita","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `addTextBox`, `shape.textFrame.textRange`

**[gen-L1-hyperlink-easy-006]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"WandB","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `addSlide`, `addTextBox`, `shape.textFrame.textRange`

**[gen-L1-footer-easy-001]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `addTextBox`, `shape.textFrame.textRange`

**[gen-L1-refusal-easy-011]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"Novita","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `shape.textFrame.textRange.font.size`

**[gen-L1-refusal-easy-012]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `shape.textFrame.textRange.font.bold`

**[gen-L1-deck-generate-easy-009]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"Novita","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `addSlide`, `addTextBox`, `shape.textFrame.textRange.font.name`

**[gen-L1-edge-cases-easy-011]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `slide.delete()`

**[gen-L1-edge-cases-easy-012]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `getSlideByIndex`, `slide.delete()`

**[gen-L1-hyperlink-easy-009]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `addTextBox`, `shape.textFrame.textRange`

**[gen-L1-hyperlink-easy-010]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"DeepInfra","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `addSlide`, `shape.textFrame.textRange`

**[gen-L1-footer-easy-006]** score=0 — Runtime error: {"message":"Provider returned error","code":429,"metadata":{"raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations","provider_name":"Novita","is_byok":false,"previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Cloudflare","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `addTextBox`, `getCurrentSlide`, `shape.textFrame.textRange`

**[gen-L1-image-insert-easy-012]** score=0 — Runtime error: {"message":"The operation was aborted","code":504,"metadata":{"provider_name":"Cloudflare","previous_errors":[{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"DeepInfra","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Novita","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"Groq","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"},{"code":429,"message":"Provider returned error","provider_name":"WandB","raw":"meta-llama/llama-3.1-8b-instruct is temporarily rate-limited upstream. Please retry shortly, or add your own key to accumulate your rate limits: https://openrouter.ai/settings/integrations"}]}}
- missing patterns: `insertImage`, `getCurrentSlide`

**[gen-L1-image-insert-easy-014]** score=0 — The AI response does not generate any code, instead asking for additional information and providing a list of categories, but does not address the request to put an image on the current slide.
- missing patterns: `getCurrentSlide`

**[gen-L1-chart-add-001]** score=43 — The code partially addresses the request by adding an image, but it does not create a bar chart, and it uses the incorrect helper method addImage instead of insertImage.
- missing patterns: `addSlide`, `findShapeByName`, `shape.textFrame.textRange`

**[gen-L1-chart-add-easy-001]** score=7 — A: 0
The code uses a hallucinated method "insertImage" which is not a native PowerPoint Office.js API, but rather an inj
- missing patterns: `addSlide`, `slide.shapes`

**[gen-L1-deck-generate-easy-015]** score=47 — A: 22
The code uses the injected helper function addSlide correctly, but does not address the request fully.

B: 0
The c
- missing patterns: `addTextBox`

**[gen-L1-deck-generate-easy-016]** score=47 — A: 18
The code uses the injected helper `addSlide` correctly, but it does not fully address the request as it does not u

**[gen-L1-smartart-001]** score=25 — The AI response fails to address the original request and does not use the available helpers to provide a solution.
- missing patterns: `addSlide`, `slide.shapes`

**[gen-L1-table-add-easy-003]** score=25 — A: 0
The code uses the injected helpers as intended, but it incorrectly adds three new slides instead of just one table.
- missing patterns: `getSlideByIndex`, `slide.shapes`

**[gen-L1-table-add-easy-004]** score=25 — The code fails to address the request and does not use the available helpers, making it a partial and inefficient solution.
- missing patterns: `getCurrentSlide`, `slide.shapes`

**[gen-L1-SmartArt-easy-001]** score=0 — The AI response fails to provide a code solution, instead suggesting a non-existent workaround.
- missing patterns: `addSlide`, `slide.shapes`

**[gen-L1-table-add-easy-006]** score=0 — A: 0
The code uses no real PowerPoint Office.js APIs or the injected helpers, instead relying on a loop that generates a
- missing patterns: `getSlideByIndex`, `slide.shapes`, `PowerPoint.run`

**[gen-L1-chart-add-easy-004]** score=47 — A: 18
The code uses the injected helper `addSlide` correctly, but it's missing the `addChart` functionality, which is no
- missing patterns: `getSlideByIndex`, `slide.shapes`

**[gen-L1-image-insert-easy-020]** score=0 — The code does not use any PowerPoint Office.js APIs or the injected helpers, and instead asks the user for input, which is not a valid solution.
- missing patterns: `insertImage`

**[gen-L1-slide-number-easy-005]** score=47 — A: 22
The code uses the injected helper function addSlide, which is valid in this environment, but it does not fully add
- missing patterns: `getSlideByIndex`, `shape.textFrame.textRange`
