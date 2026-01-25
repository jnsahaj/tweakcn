import os
import asyncio
from dotenv import load_dotenv
import anthropic
import re

load_dotenv()

def extract_code_block(text, language="typescript"):
    """Extracts code block from markdown response."""
    pattern = f"```{language}(.*?)```"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()

    # Fallback to any code block
    match = re.search(r"```(.*?)```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text

async def run_fullstack_generation(description):
    print(f"Generating Fullstack Feature: {description}")

    api_key = os.getenv("ANTHROPIC_API_KEY")
    client = anthropic.AsyncAnthropic(api_key=api_key)

    # Define steps with file targets
    steps = [
        {"name": "Schema", "prompt": "Create Drizzle schema for: ", "file": "drizzle/schema.ts"},
        {"name": "Action", "prompt": "Create Server Action for: ", "file": "actions/generated_action.ts"},
        {"name": "UI", "prompt": "Create React component for: ", "file": "components/generated_ui.tsx"}
    ]

    print("Agent starting multi-step generation...")

    context = f"Context: {description}"

    for step in steps:
        print(f"Executing Step: {step['name']}...")

        full_prompt = f"{step['prompt']} {description}. {context}. Output valid code only."

        try:
            message = await client.messages.create(
                model="claude-3-5-sonnet-latest",
                max_tokens=2000,
                messages=[
                    {"role": "user", "content": full_prompt}
                ]
            )

            content = message.content[0].text
            code = extract_code_block(content)

            # Write to file
            os.makedirs(os.path.dirname(step['file']), exist_ok=True)
            with open(step['file'], "w") as f:
                f.write(code)

            print(f"Generated {step['file']}")

            # Append to context so next step knows about previous code
            context += f"\n\n-- Previous Step ({step['name']}) Code --\n{code}\n"

        except Exception as e:
            print(f"Error in step {step['name']}: {e}")
            break

if __name__ == "__main__":
    import sys
    desc = sys.argv[1] if len(sys.argv) > 1 else "Todo List"
    asyncio.run(run_fullstack_generation(desc))
