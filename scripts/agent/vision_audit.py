import os
import asyncio
from playwright.async_api import async_playwright
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
# Note: Ensure GOOGLE_API_KEY is set in .env
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

async def capture_screenshot(url, output_path="audit_screenshot.png"):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(url)
        # Wait for network idle to ensure styles load
        await page.wait_for_load_state("networkidle")
        await page.screenshot(path=output_path, full_page=True)
        await browser.close()
    return output_path

async def audit_visuals(url):
    print(f"Capturing screenshot of {url}...")
    screenshot_path = await capture_screenshot(url)

    print("Analyzing with Gemini 3...")

    # Upload the file to Gemini
    sample_file = genai.upload_file(path=screenshot_path, display_name="UI Screenshot")

    # Select the model - explicitly using gemini-1.5-pro or similar high-reasoning model if 2.0/3.0 not yet available in this SDK version alias
    # Using 'gemini-1.5-pro-latest' or equivalent for best vision currently available in SDK
    model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest")

    prompt = """
    You are a Visual QA Expert Agent.
    Analyze this screenshot of a web application UI.
    Identify any visual issues, such as:
    1. Misaligned elements.
    2. Broken layout or overlapping text.
    3. Inconsistent spacing or padding.
    4. Color contrast issues.

    If the UI looks good, say "PASS".
    If there are issues, list them clearly with "FAIL" and the reason.
    """

    response = model.generate_content([sample_file, prompt])

    print("\n=== Audit Results ===")
    print(response.text)

    # Cleanup
    # genai.delete_file(sample_file.name) # Optional cleanup

    return response.text

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python vision_audit.py <url>")
    else:
        asyncio.run(audit_visuals(sys.argv[1]))
