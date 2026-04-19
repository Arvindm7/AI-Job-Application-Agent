import zipfile
import io
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER


def create_pdf_from_text(title: str, content: str) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=0.75*inch, leftMargin=0.75*inch,
        topMargin=0.75*inch, bottomMargin=0.75*inch
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=20,
        textColor=HexColor('#6c47ff'),
        spaceAfter=6,
        fontName='Helvetica-Bold'
    )

    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=13,
        textColor=HexColor('#1a1a2e'),
        spaceBefore=14,
        spaceAfter=6,
        fontName='Helvetica-Bold'
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=10,
        textColor=HexColor('#333333'),
        spaceAfter=6,
        leading=16,
        fontName='Helvetica'
    )

    bullet_style = ParagraphStyle(
        'CustomBullet',
        parent=styles['Normal'],
        fontSize=10,
        textColor=HexColor('#444444'),
        spaceAfter=4,
        leftIndent=16,
        leading=15,
        fontName='Helvetica'
    )

    story = []

    # title
    story.append(Paragraph(title, title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=HexColor('#6c47ff'), spaceAfter=12))

    # process content line by line
    for line in content.split('\n'):
        line = line.strip()
        if not line:
            story.append(Spacer(1, 6))
            continue

        # detect headings
        if line.isupper() and len(line) < 60:
            story.append(Paragraph(line, heading_style))
            story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#cccccc'), spaceAfter=6))
        elif line.startswith('•') or line.startswith('-'):
            clean = line.lstrip('•- ').strip()
            story.append(Paragraph(f"• {clean}", bullet_style))
        elif line.startswith('**') and line.endswith('**'):
            clean = line.strip('*')
            story.append(Paragraph(f"<b>{clean}</b>", body_style))
        else:
            # escape special XML chars for reportlab
            line = line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            story.append(Paragraph(line, body_style))

    doc.build(story)
    return buffer.getvalue()


def create_ats_report_pdf(ats_data: dict) -> bytes:
    lines = []
    lines.append(f"ATS SCORE: {ats_data.get('ats_score', 'N/A')} / 100")
    lines.append("")
    lines.append(f"VERDICT")
    lines.append(ats_data.get('verdict', ''))
    lines.append("")
    lines.append(f"KEYWORD DENSITY: {ats_data.get('keyword_density', 'N/A')}")
    lines.append("")
    lines.append("ISSUES FOUND")
    for issue in ats_data.get('issues_found', []):
        lines.append(f"• {issue}")
    lines.append("")
    lines.append("HOW TO IMPROVE")
    for imp in ats_data.get('improvements', []):
        lines.append(f"• {imp}")
    lines.append("")
    lines.append("MISSING SECTIONS")
    missing = ats_data.get('missing_sections', [])
    if missing:
        for s in missing:
            lines.append(f"• {s}")
    else:
        lines.append("• All key sections are present")
    lines.append("")
    lines.append("FORMATTING ISSUES")
    formatting = ats_data.get('formatting_issues', [])
    if formatting:
        for f in formatting:
            lines.append(f"• {f}")
    else:
        lines.append("• No formatting issues found")
    lines.append("")
    lines.append("OVERALL TIPS")
    for tip in ats_data.get('overall_tips', []):
        lines.append(f"• {tip}")

    return create_pdf_from_text("ATS Health Check Report", "\n".join(lines))


def create_match_report_pdf(match_data: dict) -> bytes:
    lines = []
    lines.append(f"MATCH SCORE: {match_data.get('match_score', 'N/A')}%")
    lines.append("")
    lines.append("VERDICT")
    lines.append(match_data.get('verdict', ''))
    lines.append("")
    lines.append("MATCHED SKILLS")
    for s in match_data.get('matched_skills', []):
        lines.append(f"• {s}")
    lines.append("")
    lines.append("MISSING SKILLS")
    for s in match_data.get('missing_skills', []):
        lines.append(f"• {s}")
    lines.append("")
    lines.append("YOUR STRENGTHS")
    for s in match_data.get('strengths', []):
        lines.append(f"• {s}")
    lines.append("")
    lines.append("GAPS TO ADDRESS")
    for g in match_data.get('gaps', []):
        lines.append(f"• {g}")
    lines.append("")
    lines.append("QUICK WINS")
    for w in match_data.get('quick_wins', []):
        lines.append(f"• {w}")

    return create_pdf_from_text("Resume Match Analysis Report", "\n".join(lines))


def create_interview_pdf(interview_data: dict) -> bytes:
    lines = []
    lines.append(f"ROLE: {interview_data.get('role_title', 'N/A')}")
    lines.append(f"COMPANY: {interview_data.get('company_name', 'N/A')}")
    lines.append(f"PREPARATION TIME: {interview_data.get('total_prep_days', 'N/A')} days")
    lines.append("")
    lines.append("BEHAVIORAL QUESTIONS")
    for i, q in enumerate(interview_data.get('behavioral_questions', []), 1):
        lines.append(f"Q{i}. {q}")
        lines.append("")
    lines.append("TECHNICAL QUESTIONS")
    for i, q in enumerate(interview_data.get('technical_questions', []), 1):
        lines.append(f"Q{i}. {q}")
        lines.append("")
    lines.append("SITUATIONAL QUESTIONS")
    for i, q in enumerate(interview_data.get('situational_questions', []), 1):
        lines.append(f"Q{i}. {q}")
        lines.append("")
    lines.append("QUESTIONS TO ASK THE INTERVIEWER")
    for q in interview_data.get('questions_to_ask_interviewer', []):
        lines.append(f"• {q}")
    lines.append("")
    lines.append("KEY TALKING POINTS")
    for t in interview_data.get('key_talking_points', []):
        lines.append(f"• {t}")
    lines.append("")
    lines.append("RED FLAGS TO ADDRESS")
    for r in interview_data.get('red_flags_to_address', []):
        lines.append(f"• {r}")
    lines.append("")
    lines.append("DAY BY DAY STUDY PLAN")
    for day in interview_data.get('daily_plan', []):
        lines.append(f"Day {day['day']}: {day['focus']}")
        lines.append(f"  Topics: {', '.join(day['topics'])}")
        lines.append(f"  Goal: {day['goal']}")
        lines.append("")

    return create_pdf_from_text("Interview Preparation Kit", "\n".join(lines))


def create_readme_pdf(cover_data: dict, ats_score: int, match_score: int) -> bytes:
    lines = []
    lines.append("JOB APPLICATION PACKAGE — CONTENTS")
    lines.append("")
    lines.append("This package was generated by Job Agent AI.")
    lines.append("It contains everything you need to apply for this job.")
    lines.append("")
    lines.append("FILES IN THIS PACKAGE")
    lines.append("")
    lines.append("1. resume.tex")
    lines.append("   ATS-optimized LaTeX resume tailored for this job.")
    lines.append("   How to use: Paste into Overleaf → Recompile → Download PDF")
    lines.append("   URL: https://www.overleaf.com")
    lines.append("")
    lines.append("2. cover_letter.txt")
    lines.append("   Personalized cover letter ready to send.")
    lines.append(f"   Addressed to: {cover_data.get('hiring_manager', 'Hiring Manager')}")
    lines.append(f"   Company: {cover_data.get('company_name', 'N/A')}")
    lines.append(f"   Role: {cover_data.get('role_title', 'N/A')}")
    lines.append("")
    lines.append("3. ats_report.pdf")
    lines.append(f"   ATS Health Check Score: {ats_score}/100")
    lines.append("   Full breakdown of ATS issues and how to fix them.")
    lines.append("")
    lines.append("4. match_report.pdf")
    lines.append(f"   Job Match Score: {match_score}%")
    lines.append("   Skills matched, missing skills and quick wins.")
    lines.append("")
    lines.append("5. interview_prep.pdf")
    lines.append("   Behavioral, technical and situational questions.")
    lines.append("   Day-by-day study plan and learning resources.")
    lines.append("")
    lines.append("6. interview_questions.txt")
    lines.append("   All interview questions in plain text for quick review.")
    lines.append("")
    lines.append("NEXT STEPS")
    lines.append("• Open resume.tex in Overleaf and download your PDF resume")
    lines.append("• Customize the cover letter with any personal touches")
    lines.append("• Review the ATS report and fix any issues before applying")
    lines.append("• Go through interview questions and practice your answers")
    lines.append("• Follow the study plan to prepare for technical questions")
    lines.append("")
    lines.append("Good luck with your application!")

    return create_pdf_from_text("Job Application Package — README", "\n".join(lines))


def build_zip_package(pipeline_result: dict) -> bytes:
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zf:

        # 1. resume.tex — latex code
        if pipeline_result.get('latex_resume') and not isinstance(pipeline_result['latex_resume'], dict):
            zf.writestr(
                'job_application_package/resume.tex',
                pipeline_result['latex_resume']
            )

        # 2. cover_letter.txt
        cover = pipeline_result.get('cover_letter', {})
        if cover and not cover.get('failed'):
            zf.writestr(
                'job_application_package/cover_letter.txt',
                cover.get('cover_letter', '')
            )

        # 3. ats_report.pdf
        ats = pipeline_result.get('ats_check', {})
        if ats and not ats.get('failed'):
            ats_pdf = create_ats_report_pdf(ats)
            zf.writestr('job_application_package/ats_report.pdf', ats_pdf)

        # 4. match_report.pdf
        match = pipeline_result.get('match_analysis', {})
        if match and not match.get('failed'):
            match_pdf = create_match_report_pdf(match)
            zf.writestr('job_application_package/match_report.pdf', match_pdf)

        # 5. interview_prep.pdf
        interview = pipeline_result.get('interview_prep', {})
        if interview and not interview.get('failed'):
            interview_pdf = create_interview_pdf(interview)
            zf.writestr('job_application_package/interview_prep.pdf', interview_pdf)

        # 6. interview_questions.txt — plain text for quick review
        if interview and not interview.get('failed'):
            questions = []
            questions.append("BEHAVIORAL QUESTIONS\n")
            for i, q in enumerate(interview.get('behavioral_questions', []), 1):
                questions.append(f"Q{i}. {q}\n")
            questions.append("\nTECHNICAL QUESTIONS\n")
            for i, q in enumerate(interview.get('technical_questions', []), 1):
                questions.append(f"Q{i}. {q}\n")
            questions.append("\nSITUATIONAL QUESTIONS\n")
            for i, q in enumerate(interview.get('situational_questions', []), 1):
                questions.append(f"Q{i}. {q}\n")
            questions.append("\nQUESTIONS TO ASK INTERVIEWER\n")
            for q in interview.get('questions_to_ask_interviewer', []):
                questions.append(f"• {q}\n")
            zf.writestr(
                'job_application_package/interview_questions.txt',
                ''.join(questions)
            )

        # 7. readme.pdf
        ats_score = ats.get('ats_score', 0) if ats and not ats.get('failed') else 0
        match_score = match.get('match_score', 0) if match and not match.get('failed') else 0
        readme_pdf = create_readme_pdf(cover, ats_score, match_score)
        zf.writestr('job_application_package/README.pdf', readme_pdf)

        # 8. raw_data.json — all results as JSON for reference
        zf.writestr(
            'job_application_package/raw_data.json',
            json.dumps(pipeline_result, indent=2, default=str)
        )

    zip_buffer.seek(0)
    return zip_buffer.read()