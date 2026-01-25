# Implementation Plan: Cutting Edge Agent Features

This plan outlines the steps to implement advanced agentic features using the latest Gemini and Claude SDK capabilities.

## 1. Setup Agent Environment

We will set up a Python-based agent environment in `scripts/agent/` to utilize the `anthropic` (Python) SDK and `google-generativeai`.

*   [ ] **Create Directory Structure**: Ensure `scripts/agent/` exists.
*   [ ] **Create Virtual Environment**: Setup a `.venv` to isolate dependencies.
*   [ ] **Install Dependencies**:
    *   `anthropic` (for Deep Plan & Reversible Dev)
    *   `google-generativeai` (for Gemini Vision)
    *   `playwright` (for capturing screenshots)
    *   `python-dotenv` (for env vars)
*   [ ] **Create Base Script**: Create `scripts/agent/tweak_agent.py` as a CLI entry point.

## 2. Feature 1: Visual Theme Auditor (Gemini 3)

Implement a "Visual Detective" to verify UI consistency.

*   [ ] **Implement Screenshot Tool**: Create a helper to capture screenshots of specific components or pages using Playwright (Python).
*   [ ] **Implement Gemini Vision Logic**:
    *   Use `google.generativeai` to send the screenshot + design rules to Gemini 3.
    *   Prompt it to find layout shifts or visual bugs.
*   [ ] **Integrate into Agent**: Add a command `audit <url_or_component>` to `tweak_agent.py`.

## 3. Feature 2: "Deep Plan" Architect (Claude Thinking Mode)

Implement a planning mode that leverages Claude's reasoning.

*   [ ] **Implement Planner**: Create `scripts/agent/deep_plan.py`.
*   [ ] **Configure "Thinking"**: Use `claude-agent-sdk` (or direct API if SDK lacks specific support yet) to enable "Thinking Mode".
*   [ ] **Add Context Tools**: Give the agent read-only access to the codebase (file reading tool) to understand the architecture.
*   [ ] **Output**: The agent should generate a `DEEP_PLAN.md` file with architectural decisions.

## 4. Feature 3: Reversible "Time Travel" Development

Enable safe experimentation with checkpointing.

*   [ ] **Implement Reversible Coder**: Create `scripts/agent/reversible_coder.py`.
*   [ ] **Use SDK Checkpoints**: Utilize `claude-agent-sdk`'s `rewind_files` or implementing a manual git-based checkpoint system if SDK features are experimental.
*   [ ] **Workflow**:
    1.  Checkpoint.
    2.  Agent makes changes.
    3.  Run validation (tests/build).
    4.  If fail -> Rewind & Retry.
    5.  If pass -> Commit.

## 5. Feature 4: Multi-Step Fullstack Generation

Enhance generation to handle DB + Backend + Frontend.

*   [ ] **Enhance Tweak Agent**: Add a `generate-fullstack` command.
*   [ ] **Multi-step Logic**:
    *   Step 1: Generate Drizzle Schema.
    *   Step 2: Generate Server Actions / API.
    *   Step 3: Generate UI Components.
*   [ ] **Verification**: Run `pnpm build` in between steps.

## 6. Pre-commit & Submit

*   [ ] Run `pre_commit_instructions`.
*   [ ] Submit the changes.
