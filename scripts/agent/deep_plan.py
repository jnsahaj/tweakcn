import os
import asyncio
from dotenv import load_dotenv
import anthropic

load_dotenv()

async def run_deep_plan(query_text="Analyze the codebase and propose an architecture."):
    print("Initializing Deep Plan Architect (Claude Thinking Mode)...")

    # Check for API key
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY not found in .env")
        return

    client = anthropic.AsyncAnthropic(api_key=api_key)

    # We will give the agent tools to read files.
    # Note: To give real tools, we need to implement the tool use loop.
    # For this iteration, we will ask Claude to generate a plan based on its internal knowledge or
    # we would need to feed it a summary of the codebase.

    # Since we want "Deep Plan", we will use a strong system prompt and extended thinking if available.

    system_prompt = """
    You are the "Deep Plan Architect".
    Your goal is to analyze the user request and produce a detailed implementation plan.

    You should:
    1. Think deeply about the architectural implications.
    2. Consider edge cases and dependencies.
    3. Produce a markdown file content named 'DEEP_PLAN.md'.
    """

    print("Agent is thinking...")

    try:
        message = await client.messages.create(
            model="claude-3-5-sonnet-latest",
            max_tokens=4096,
            system=system_prompt,
            messages=[
                {"role": "user", "content": f"Please create a plan for: {query_text}. Assuming a Next.js + Drizzle + Tailwind project structure."}
            ]
        )

        print("\n=== Plan Generated ===\n")
        print(message.content[0].text)

        # Save to file
        with open("DEEP_PLAN.md", "w") as f:
            f.write(message.content[0].text)
        print("\n\nPlan saved to DEEP_PLAN.md")

    except Exception as e:
        print(f"Error during planning: {e}")

if __name__ == "__main__":
    import sys
    query = sys.argv[1] if len(sys.argv) > 1 else "Analyze the project structure."
    asyncio.run(run_deep_plan(query))
