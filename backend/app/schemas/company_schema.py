from pydantic import BaseModel
from typing import List, Optional


class FundingRound(BaseModel):
    round: str
    amount: str
    date: str


class NewsItem(BaseModel):
    title: str
    summary: str
    url: str
    date: str


class InterviewInsight(BaseModel):
    stage: str
    description: str


class CompetitorItem(BaseModel):
    name: str
    how_different: str


class LeadershipMember(BaseModel):
    name: str
    role: str
    background: str


class InterviewTalkingPoint(BaseModel):
    category: str
    what_to_say: str
    why_it_impresses: str


class CompanyResearchResponse(BaseModel):
    company_name: str
    industry: str
    founded: str
    headquarters: str
    company_size: str
    website: str

    # overview
    what_they_do: str
    mission: str
    vision: str
    core_values: List[str]
    products: List[str]
    tech_stack: List[str]
    target_customers: str
    business_model: str

    # leadership
    leadership: List[LeadershipMember]
    ceo_quote: str

    # culture
    culture_summary: str
    work_life_balance: str
    pros: List[str]
    cons: List[str]
    glassdoor_rating: str
    employee_count: str
    notable_perks: List[str]

    # market position
    market_position: str
    competitors: List[CompetitorItem]
    competitive_advantage: str
    market_size: str
    recent_achievements: List[str]

    # financials
    funding_status: str
    funding_rounds: List[FundingRound]
    total_funding: str
    revenue: str
    growth_stage: str
    valuation: str
    investors: List[str]

    # interview
    interview_difficulty: str
    interview_process: List[InterviewInsight]
    commonly_asked_topics: List[str]
    interview_tips: List[str]

    # news
    recent_news: List[NewsItem]

    # interview talking points — the key new section
    interview_talking_points: List[InterviewTalkingPoint]
    why_work_here: List[str]
    questions_to_ask: List[str]
    company_challenges: List[str]
    how_you_can_contribute: str

    # verdict
    overall_verdict: str
    red_flags: List[str]
    green_flags: List[str]
    recommended_for: str
    salary_range: str