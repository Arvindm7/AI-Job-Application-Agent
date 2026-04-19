import requests
from app.core.config import settings


def get_company_jobs(company_name: str) -> list:
    url = settings.JSEARCH_API_URL

    params = {
        "query": f"{company_name} jobs",
        "page": "1",
        "num_pages": "1",
        "date_posted": "month"
    }

    headers = {
        "X-RapidAPI-Key": settings.JSEARCH_API_KEY,
        "X-RapidAPI-Host": settings.JSEARCH_API_HOST
    }

    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        data = response.json()

        jobs = []
        for job in data.get("data", [])[:6]:
            jobs.append({
                "title": job.get("job_title", ""),
                "location": f"{job.get('job_city', '')} {job.get('job_country', '')}".strip(),
                "type": job.get("job_employment_type", ""),
                "remote": job.get("job_is_remote", False),
                "posted": job.get("job_posted_at_datetime_utc", "")[:10] if job.get("job_posted_at_datetime_utc") else "",
                "apply_url": job.get("job_apply_link", "")
            })

        return jobs

    except Exception:
        return []