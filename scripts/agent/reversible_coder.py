import os
import asyncio
import subprocess
import argparse
from dotenv import load_dotenv
import anthropic

load_dotenv()

def is_repo_clean():
    """Check if the git repo is clean."""
    result = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
    return len(result.stdout.strip()) == 0

async def run_reversible_coding(task, target_file):
    print(f"Starting Reversible Coding Task: {task}")
    print(f"Target File: {target_file}")

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY not found in .env")
        return

    # Check repo state
    if not is_repo_clean():
        print("WARNING: Repository has uncommitted changes.")
        print("Reversible mode requires a clean state to safely rollback.")
        choice = input("Do you want to continue? This script might stash your changes. (y/n): ")
        if choice.lower() != 'y':
            print("Aborting.")
            return

        print("Stashing changes...")
        subprocess.run(["git", "stash", "push", "-m", "Stash before reversible agent task"])

    client = anthropic.AsyncAnthropic(api_key=api_key)

    try:
        print("Agent attempting task...")

        system_prompt = "You are an expert coding agent. Output ONLY the code for the requested file. Do not include markdown blocks."

        message = await client.messages.create(
            model="claude-3-5-sonnet-latest",
            max_tokens=4096,
            system=system_prompt,
            messages=[
                {"role": "user", "content": f"Implement this task in '{target_file}': {task}"}
            ]
        )

        code_content = message.content[0].text

        # Ensure directory exists
        os.makedirs(os.path.dirname(target_file), exist_ok=True)

        # Write file
        with open(target_file, "w") as f:
            f.write(code_content)
        print(f"Written code to {target_file}")

        # Step 2: Verify (Run Build or Test)
        # For demonstration, we just check file existence.
        # In production, run: subprocess.run(["pnpm", "build"])
        print("Verifying changes...")
        if os.path.exists(target_file):
             # Mock verification
             print("SUCCESS: File created.")
        else:
             raise Exception("File creation failed")

    except Exception as e:
        print(f"Error or Failure: {e}")
        print("Rewinding changes...")
        # Revert the specific file or all changes since start
        subprocess.run(["git", "checkout", target_file])
        print("Reverted to clean state.")

    finally:
        # If we stashed, pop it back?
        # Safest is to tell user.
        print("\nNote: If changes were stashed, use 'git stash pop' to restore them.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("task", help="Task description")
    parser.add_argument("--file", default="components/generated_component.tsx", help="Target file path")
    args = parser.parse_args()

    asyncio.run(run_reversible_coding(args.task, args.file))
