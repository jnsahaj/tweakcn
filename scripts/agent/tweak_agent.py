import os
import sys
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def print_help():
    print("Tweak Agent CLI")
    print("===============")
    print("Commands:")
    print("  audit <url>      - Run visual audit on a URL or component")
    print("  plan             - Run deep planning mode")
    print("  generate         - Run fullstack generation")
    print("  reversible       - Run reversible development mode")
    print("")

def main():
    if len(sys.argv) < 2:
        print_help()
        sys.exit(1)

    command = sys.argv[1]

    if command == "audit":
        if len(sys.argv) < 3:
            print("Error: URL required for audit")
            sys.exit(1)
        url = sys.argv[2]
        print(f"Auditing {url}...")
        from vision_audit import audit_visuals
        asyncio.run(audit_visuals(url))

    elif command == "plan":
        print("Starting Deep Plan Architect...")
        query = sys.argv[2] if len(sys.argv) > 2 else "Analyze project structure"
        from deep_plan import run_deep_plan
        asyncio.run(run_deep_plan(query))

    elif command == "generate":
        print("Starting Fullstack Generation...")
        description = sys.argv[2] if len(sys.argv) > 2 else "New Feature"
        from fullstack_gen import run_fullstack_generation
        asyncio.run(run_fullstack_generation(description))

    elif command == "reversible":
        print("Starting Reversible Development Mode...")
        task = sys.argv[2] if len(sys.argv) > 2 else "Refactor component"
        # Optional: Allow specifying file via a separator or parsing logic.
        # For CLI simplicity, we default to a test file or require args in reversible_coder
        from reversible_coder import run_reversible_coding
        # We pass a default file target for now or need CLI parsing update.
        # Let's assume the user might pass task and file.
        target_file = sys.argv[3] if len(sys.argv) > 3 else "components/generated.tsx"
        asyncio.run(run_reversible_coding(task, target_file))

    else:
        print(f"Unknown command: {command}")
        print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
