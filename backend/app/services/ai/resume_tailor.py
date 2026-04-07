from app.services.ai.llm import call_llm

def generate_latex(resume_text: str, job_description: str) -> str:

    tailor_prompt = f"""
You are an aggressive ATS resume rewriter. Your goal is to maximize the ATS match score between the resume and the job description.

You MUST make ALL of the following changes:

1. REWRITE THE SUMMARY — craft a new 3-4 line professional summary that mirrors the exact language, role title, and key requirements from the job description
2. REORDER SKILLS — put the skills that appear in the job description at the top of the skills section. Add any missing skills that the candidate plausibly has based on their experience.
3. REWRITE EVERY BULLET POINT — for each job experience, rewrite the bullet points to:
   - Use the same action verbs and technical terms used in the job description
   - Highlight responsibilities that are most relevant to the job description
   - Add metrics and quantified results wherever possible
4. INJECT KEYWORDS — every important keyword, tool, technology, and phrase from the job description MUST appear somewhere in the resume naturally
5. RENAME SECTION HEADERS — use the exact section names ATS systems expect: "Professional Summary", "Work Experience", "Technical Skills", "Education", "Projects"

STRICT RULES:
- Never invent new jobs, degrees, or companies — only rewrite what exists
- ADD all skills and technologies from the job description to the skills section even if not in original resume
- Every keyword injection must sound natural — not stuffed
- The output must be significantly different from the input
- If the job asks for "React.js" and resume says "React" — update it to "React.js"

Return ONLY the complete rewritten resume as plain text — no JSON, no markdown, no explanations.
The output should be ready to be converted to LaTeX directly.

ORIGINAL RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""

    tailored_text = call_llm(tailor_prompt)

    latex_prompt = f"""
You are an expert LaTeX resume designer.

Convert the resume below into a clean, professional, ATS-friendly LaTeX resume.

STRICT RULES:
- Use only standard Overleaf packages: geometry, fontenc, inputenc, hyperref, titlesec, enumitem, xcolor, parskip, lmodern
- Single column layout only
- Clean section headers with a horizontal rule underneath
- Bullet points using itemize for experience and skills
- Clickable email and LinkedIn links using hyperref
- A4 paper size, margins: top=0.5in, bottom=0.5in, left=0.75in, right=0.75in
- Escape all special characters: # → \#  and & → \&  and % → \%  and _ → \_
- Return ONLY raw LaTeX starting with \\documentclass and ending with \\end{{document}}
- NO markdown, NO code fences, NO explanation

RESUME CONTENT:
{tailored_text}
"""

    latex_raw = call_llm(latex_prompt)

    latex_cleaned = latex_raw.strip()

    if "```" in latex_cleaned:
        parts = latex_cleaned.split("```")
        for part in parts:
            stripped = part.strip()
            if stripped.startswith("latex\n") or stripped.startswith("tex\n"):
                stripped = stripped.split("\n", 1)[1]
            if stripped.startswith("\\documentclass"):
                latex_cleaned = stripped.strip()
                break

    if "\\documentclass" in latex_cleaned:
        latex_cleaned = latex_cleaned[latex_cleaned.index("\\documentclass"):]

    if "\\end{document}" in latex_cleaned:
        latex_cleaned = latex_cleaned[:latex_cleaned.index("\\end{document}") + len("\\end{document}")]

    latex_cleaned = latex_cleaned.replace("\\n", "\n")
    latex_cleaned = latex_cleaned.replace("\\\\", "\\")

    return latex_cleaned
