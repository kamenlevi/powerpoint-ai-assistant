# PowerPoint AI — Eval Results
**Last run:** 2026-05-15 15:46:01  
**Overall: 65.8/100**  
**Model:** meta-llama/llama-3.3-70b-instruct

## Scores by category

| Category | Score | Trend | Cases |
|---|---|---|---|
| slide-add | 84.3/100 | — | 3 |
| slide-delete ✓ | 97.0/100 | — | 2 |
| text-format | 85.0/100 | — | 3 |
| text-edit | 81.0/100 | — | 2 |
| theme-apply | 12.5/100 | — | 2 |
| recolor | 10.0/100 | — | 2 |
| notes-write | 46.0/100 | — | 2 |
| shape-position | 81.0/100 | — | 2 |
| image-insert | 17.5/100 | — | 2 |
| web-search-needed | 67.0/100 | — | 3 |
| question-handling | 84.0/100 | — | 2 |
| animation ✓ | 100.0/100 | — | 1 |
| transition | 20.0/100 | — | 1 |
| slide-reorder | 83.0/100 | — | 1 |
| refusal | 79.3/100 | — | 3 |
| deck-generate | 83.0/100 | — | 1 |
| edge-cases | 79.0/100 | — | 1 |

## All test cases

| ID | Score | Pass | Reason |
|---|---|---|---|
| L1-slide-add-001 | 85 | ✓ | The code correctly uses the addSlide helper and addresses the request, but loses points for not handling potential errors and not following best practices for API usage and error handling. |
| L1-slide-add-002 | 85 | ✓ | The code is mostly correct, but loses points for not using the `PowerPoint.run` API to ensure the slide is added synchronously, and for not checking if a title slide already exists, which affects the completeness and approach dimensions. |
| L1-slide-add-003 | 83 | ✓ | The code is mostly correct, but loses points for not using the PowerPoint.run async context and potentially lacking error handling, and for not fully utilizing best practices such as checking the current slide index before adding a new slide. |
| L1-slide-delete-001 | 97 ✅ | ✓ | The code is almost perfect, using the correct API and fully addressing the request, but loses a few points for not using a try-catch block for error handling, which is a best practice. |
| L1-slide-delete-002 | 97 ✅ | ✓ | The code is nearly perfect, using the correct API and best practices, but loses a few points on approach for not explicitly handling potential errors that may occur during the execution of the code. |
| L1-text-format-001 | 93 | ✓ | The code is mostly correct and complete, but loses points for not handling potential errors that may occur during the execution of the PowerPoint Office JS APIs, such as checking if the slide or title shape is null before accessing its properties. |
| L1-text-format-002 | 72 | ✓ | The code correctly uses PowerPoint Office JS APIs and addresses the request, but lacks best practices, such as error handling and potential issues with loading and syncing, and does not account for potential null or undefined values in the shapes and textFrame properties. |
| L1-text-format-003 | 90 | ✓ | The code is mostly correct and complete, but loses points for not using the most efficient approach, such as directly accessing the title shape using a more specific method, and for potential issues with error handling and sync order. |
| L1-text-edit-001 | 90 | ✓ | The code is mostly correct and complete, but loses points for not handling potential errors when loading or syncing the slide shapes and for not using the most efficient approach to find the title shape. |
| L1-text-edit-002 | 72 | ✓ | The code correctly uses PowerPoint Office JS APIs and addresses the request, but lacks best practices, such as error handling and loading only necessary properties, and does not account for potential issues like shapes without text frames or notes pages. |
| L1-theme-apply-001 | 0 ⚠️ | ✓ | The code uses a hallucinated method "applyTheme" which does not exist in the PowerPoint Office JS APIs, resulting in a complete failure to meet the requirements. |
| L1-theme-apply-002 | 25 ⚠️ | ✓ | The code uses a hallucinated method "applyTheme" which does not exist in the PowerPoint Office JS APIs, resulting in a complete loss of points for API correctness and would-it-work dimensions. |
| L1-recolor-001 | 15 ⚠️ | ✓ | The code uses a hallucinated method "recolorDeck" which does not exist in the PowerPoint Office JS API, and also introduces an undefined "secondary" color not requested by the user. |
| L1-recolor-002 | 5 ⚠️ | ✗ | The code uses a hallucinated method "applyTheme" which does not exist in the PowerPoint Office JS APIs, resulting in a complete loss of points for API correctness and would not work at runtime. |
| L1-notes-write-001 | 72 | ✓ | The code uses a correct API method `addSpeakerNote` but loses points for not using the `getSlideByIndex` helper to ensure the correct slide is targeted and for not fully addressing the request by not providing more specific guidance on the key drivers behind the growth. |
| L1-notes-write-002 | 20 ⚠️ | ✓ | The code uses a hallucinated method "addSpeakerNote" which does not exist in the PowerPoint Office JS API, instead it should use the "slide.notesPage.notesTextFrame" property to add a speaker note. |
| L1-shape-position-001 | 90 | ✓ | The code is mostly correct and complete, but loses points for not handling potential errors that may occur during the execution of the `context.sync()` method and for not using the most efficient approach to update the title shape's position. |
| L1-shape-position-002 | 72 | ✓ | The code is mostly correct but lacks the use of best practices, such as using the `addTextBox` helper directly on the `slide.shapes` object, and does not handle potential errors or edge cases, resulting in deductions in API correctness and approach dimensions. |
| L1-image-insert-001 | 15 ⚠️ | ✓ | The code uses a hallucinated `insertImage` method, which is not a real PowerPoint Office JS API, and does not use the correct `PowerPoint.run` async context or `slide.shapes.addImage` method. |
| L1-image-insert-002 | 20 ⚠️ | ✓ | The code uses a hallucinated method "insertImage" which does not exist in the PowerPoint Office JS API, instead of using the correct API such as slide.shapes.addImage. |
| L1-web-search-needed-001 | 67 | ✓ | The AI response correctly identifies the need for a web search to get the current Apple stock price, but lacks clarity on how this information will be used to create the slide and does not offer any workarounds or PowerPoint-specific suggestions. |
| L1-web-search-needed-002 | 67 | ✓ | The response accurately identifies the need for a web search, is clear and relevant, but lacks a concrete workaround or suggestion for enabling web search in PowerPoint settings, resulting in a low bonus score. |
| L1-web-search-needed-003 | 67 | ✗ | The response is mostly accurate and clear, but it incorrectly requests a web search for a static knowledge question and lacks a direct formula statement, reducing its relevance and bonus score. |
| L1-question-handling-001 | 85 | ✓ | The code correctly uses the PowerPoint Office JS API and fully addresses the request, but loses points for not using the most efficient approach and having potential issues with variable scope and load/sync order. |
| L1-question-handling-002 | 83 | ✓ | The code is mostly correct and uses real PowerPoint Office JS APIs, but loses points for not handling potential errors and not using the most efficient approach to retrieve the slide title, and also for returning a string that includes "Slide 2 title: " which is not exactly what the user requested. |
| L1-animation-001 | 100 ✅ | ✓ | The code perfectly addresses the request, using the correct API and best practices, specifically utilizing the addSlide helper with the correct options to add a new slide with a title and fade-in animation. |
| L1-transition-001 | 20 ⚠️ | ✓ | The code uses a hallucinated method "addSlideCreating" which does not exist in the PowerPoint Office JS APIs, instead it should use the "presentation.slides.add" helper or the "addSlide" helper. |
| L1-move-001 | 83 | ✓ | The code correctly uses the PowerPoint Office JS API and mostly addresses the request, but loses points for not fully handling potential edge cases and not using the most optimal approach, such as checking if the slide index is valid before moving it. |
| L1-refusal-002 | 83 | ✓ | The response accurately identifies the limitation of PowerPoint Office.js and provides a clear workaround, but loses points for not offering more detailed guidance or alternative solutions, and for not explicitly stating that the workaround is a manual process outside of the Office.js API. |
| L1-refusal-005 | 83 | ✓ | The AI response accurately explains the limitation of PowerPoint Office.js and offers a workaround, but loses points for clarity and relevance due to the lack of a clear explanation of the original request's specifics, such as editing the existing fade animation to be slower, which is not directly addressed in the provided code. |
| L1-refusal-004 | 72 | ✓ | The response accurately identifies the limitation of PowerPoint Office.js in creating charts, but loses points for not providing a more detailed workaround or alternative solutions, and for including unnecessary code in the response. |
| L1-deck-generate-001 | 83 | ✓ | The code correctly uses the addSlide helper and generates a 6-slide pitch deck, but loses points for not utilizing other available helpers and best practices, such as adding speaker notes or using more descriptive slide types. |
| L1-edge-case-001 | 79 | ✓ | The code correctly uses the getSlideByIndex helper and handles errors, but loses points for not checking if the slide index is valid before attempting to delete it and for not using a more robust error message. |

## ⚠️ Needs attention

**[L1-theme-apply-001]** score=0 — The code uses a hallucinated method "applyTheme" which does not exist in the PowerPoint Office JS APIs, resulting in a complete failure to meet the requirements.

**[L1-theme-apply-002]** score=25 — The code uses a hallucinated method "applyTheme" which does not exist in the PowerPoint Office JS APIs, resulting in a complete loss of points for API correctness and would-it-work dimensions.

**[L1-recolor-001]** score=15 — The code uses a hallucinated method "recolorDeck" which does not exist in the PowerPoint Office JS API, and also introduces an undefined "secondary" color not requested by the user.

**[L1-recolor-002]** score=5 — The code uses a hallucinated method "applyTheme" which does not exist in the PowerPoint Office JS APIs, resulting in a complete loss of points for API correctness and would not work at runtime.
- missing patterns: `recolorDeck`

**[L1-notes-write-002]** score=20 — The code uses a hallucinated method "addSpeakerNote" which does not exist in the PowerPoint Office JS API, instead it should use the "slide.notesPage.notesTextFrame" property to add a speaker note.

**[L1-image-insert-001]** score=15 — The code uses a hallucinated `insertImage` method, which is not a real PowerPoint Office JS API, and does not use the correct `PowerPoint.run` async context or `slide.shapes.addImage` method.

**[L1-image-insert-002]** score=20 — The code uses a hallucinated method "insertImage" which does not exist in the PowerPoint Office JS API, instead of using the correct API such as slide.shapes.addImage.

**[L1-transition-001]** score=20 — The code uses a hallucinated method "addSlideCreating" which does not exist in the PowerPoint Office JS APIs, instead it should use the "presentation.slides.add" helper or the "addSlide" helper.
