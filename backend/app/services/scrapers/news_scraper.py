import requests
from bs4 import BeautifulSoup
from urllib.parse import quote


def scrape_google_news(company_name: str) -> list:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
    }

    query = quote(f"{company_name} company news 2024 2025")
    url = f"https://www.google.com/search?q={query}&tbm=nws&num=10"

    try:
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')

        news_items = []

        # extract news results
        for item in soup.select('div.SoaBEf')[:8]:
            try:
                title_el = item.select_one('div.MBeuO') or item.select_one('div.n0jPhd')
                link_el = item.select_one('a')
                date_el = item.select_one('div.OSrXXb') or item.select_one('span.r0bn4c')
                snippet_el = item.select_one('div.GI74Re') or item.select_one('div.Rai5ob')

                title = title_el.get_text(strip=True) if title_el else ''
                url = link_el.get('href', '') if link_el else ''
                date = date_el.get_text(strip=True) if date_el else 'Recent'
                snippet = snippet_el.get_text(strip=True) if snippet_el else ''

                if title:
                    news_items.append({
                        'title': title,
                        'url': url,
                        'date': date,
                        'snippet': snippet
                    })
            except Exception:
                continue

        return news_items

    except Exception as e:
        return []


def scrape_bing_news(company_name: str) -> list:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
    }

    query = quote(f"{company_name} company latest news")
    url = f"https://www.bing.com/news/search?q={query}&count=10"

    try:
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')

        news_items = []

        for card in soup.select('div.news-card')[:8]:
            try:
                title_el = card.select_one('a.title')
                date_el = card.select_one('span.source')
                snippet_el = card.select_one('div.snippet')

                title = title_el.get_text(strip=True) if title_el else ''
                url = title_el.get('href', '') if title_el else ''
                date = date_el.get_text(strip=True) if date_el else 'Recent'
                snippet = snippet_el.get_text(strip=True) if snippet_el else ''

                if title:
                    news_items.append({
                        'title': title,
                        'url': url,
                        'date': date,
                        'snippet': snippet
                    })
            except Exception:
                continue

        return news_items

    except Exception as e:
        return []


def get_company_news(company_name: str) -> list:
    # try google first, fall back to bing
    news = scrape_google_news(company_name)
    if not news:
        news = scrape_bing_news(company_name)
    return news