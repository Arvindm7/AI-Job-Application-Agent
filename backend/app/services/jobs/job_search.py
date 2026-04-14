import requests
from app.core.config import settings


def search_jobs(
    query: str,
    location: str = "India",
    page: int = 1,
    num_pages: int = 1,
    remote_only: bool = False,
    employment_type: str = None
) -> list:

    url = settings.JSEARCH_API_URL

    params = {
        "query": query,
        "page": str(page),
        "num_pages": str(num_pages),
        "country": "in",
        "date_posted": "all"
    }

    if remote_only:
        params["remote_jobs_only"] = "true"

    if employment_type:
        params["employment_types"] = employment_type  # FULLTIME, PARTTIME, INTERN, CONTRACTOR

    headers = {
        "X-RapidAPI-Key": settings.JSEARCH_API_KEY,
        "X-RapidAPI-Host": settings.JSEARCH_API_HOST
    }

    response = requests.get(url, headers=headers, params=params, timeout=15)

    if response.status_code != 200:
        raise Exception(f"Job search API failed with status {response.status_code}: {response.text}")

    data = response.json()

    jobs = []
    for job in data.get("data", []):
        # extract salary info
        salary = "Not specified"
        if job.get("job_min_salary") and job.get("job_max_salary"):
            currency = job.get("job_salary_currency", "")
            period = job.get("job_salary_period", "")
            salary = f"{currency} {job['job_min_salary']} - {job['job_max_salary']} {period}"

        jobs.append({
            "job_id": job.get("job_id", ""),
            "title": job.get("job_title", ""),
            "company": job.get("employer_name", ""),
            "company portal": job.get("employer_website", ""),
            "company linkedin": job.get("employer_linkedin", ""),
            "location": f"{job.get('job_city', '')} {job.get('job_state', '')} {job.get('job_country', '')}".strip(),
            "job_type": job.get("job_employment_type", ""),
            "remote": bool(job.get("job_is_remote")),
            "salary": salary,
            "posted_date": job.get("job_posted_at_datetime_utc", "")[:10] if job.get("job_posted_at_datetime_utc") else "Unknown",
            "apply_url": job.get("job_apply_link", ""),
            "description_snippet": job.get("job_description", "")[:300] + "..." if job.get("job_description") else ""
        })

    return jobs