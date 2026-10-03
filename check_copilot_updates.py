#!/usr/bin/env python3
"""
Checks Microsoft's official blog RSS feed for new Copilot-related posts,
compares them against what's already tracked in data/updates.json and what
has already been flagged before (data/.seen-feed-items.json), and writes
any genuinely new items to a file that the workflow turns into a GitHub
Issue for a human to review before anything is published to the site.

This script never edits data/updates.json itself — publishing to the live
site is always a deliberate, human-reviewed step.
"""

import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

FEED_URL = "https://blogs.microsoft.com/feed/"
KEYWORDS = [
    "copilot", "autopilot", "copilot studio", "copilot credits",
    "finops for ai", "agent 365", "usage-based billing"
]

ROOT = Path(__file__).resolve().parent.parent
UPDATES_FILE = ROOT / "data" / "updates.json"
SEEN_FILE = ROOT / "data" / ".seen-feed-items.json"
OUTPUT_FILE = ROOT / "new-items-found.json"


def fetch_feed(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (CopilotOpsUpdateBot)"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read()


def parse_items(xml_bytes):
    root = ET.fromstring(xml_bytes)
    items = []
    for item in root.findall("./channel/item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub_date = (item.findtext("pubDate") or "").strip()
        description = (item.findtext("description") or "").strip()
        description = re.sub("<[^<]+?>", "", description)  # strip any HTML
        items.append({
            "title": title,
            "link": link,
            "pubDate": pub_date,
            "description": description[:300]
        })
    return items


def matches_keywords(item):
    haystack = (item["title"] + " " + item["description"]).lower()
    return any(kw in haystack for kw in KEYWORDS)


def load_json_list(path):
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return []
    return []


def main():
    try:
        raw = fetch_feed(FEED_URL)
    except Exception as exc:
        print(f"Could not fetch feed: {exc}", file=sys.stderr)
        # Fail soft: no new items rather than breaking the workflow run.
        OUTPUT_FILE.write_text("[]", encoding="utf-8")
        return

    items = parse_items(raw)
    relevant = [i for i in items if matches_keywords(i)]

    already_published_links = {u.get("source") for u in load_json_list(UPDATES_FILE)}
    already_seen_links = {s.get("link") for s in load_json_list(SEEN_FILE)}

    new_items = [
        i for i in relevant
        if i["link"] not in already_published_links
        and i["link"] not in already_seen_links
    ]

    OUTPUT_FILE.write_text(json.dumps(new_items, indent=2), encoding="utf-8")

    updated_seen = load_json_list(SEEN_FILE) + [
        {"link": i["link"], "title": i["title"]} for i in new_items
    ]
    SEEN_FILE.write_text(json.dumps(updated_seen, indent=2), encoding="utf-8")

    print(f"Found {len(new_items)} new Copilot-related item(s).")


if __name__ == "__main__":
    main()
