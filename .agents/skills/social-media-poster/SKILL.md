---
name: social-media-poster
description: Create, schedule, and publish content across LinkedIn, X (Twitter), Instagram, and Facebook from a single content brief. Adapts tone, format, and hashtags per platform with engagement analytics tracking.
license: MIT
tags: [social-media, marketing, automation, content, linkedin]
---

# Social Media Poster

## Overview

Transform a single content brief into platform-optimized posts for LinkedIn, X, Instagram, and Facebook—automatically adapting format, tone, hashtags, and character limits, then scheduling and publishing on your behalf.

---

## When to Use

- Publishing a product launch announcement across all channels simultaneously
- Scheduling a week of content from a single content calendar
- Repurposing a blog post or press release into social posts
- Running a coordinated multi-platform campaign
- Tracking engagement metrics across platforms after publishing

---

## Instructions

1. Accept inputs: content brief (topic, key messages, target audience, tone, media assets), target platforms, schedule (now/specific time/optimal time).
2. Generate platform-specific variants:
   - LinkedIn: professional tone, up to 3000 chars, 3-5 hashtags, no link in post.
   - X/Twitter: concise, 280 chars, 2-3 hashtags, link at end.
   - Instagram: visual caption, 2200 chars, 20-30 hashtags, call-to-action.
   - Facebook: conversational, include link preview, 1-3 hashtags.
3. Attach media assets if provided (resize/format per platform specs).
4. If schedule=optimal, calculate best posting time per platform based on audience timezone and engagement data.
5. Publish or schedule via each platform's API.
6. After publishing, collect: impressions, likes, comments, shares, click-through rate.
7. Return post URLs, publishing timestamps, and 24-hour engagement summary.

---

## Environment

```
LINKEDIN_ACCESS_TOKEN=your_linkedin_token
TWITTER_BEARER_TOKEN=your_twitter_token
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
FACEBOOK_PAGE_ACCESS_TOKEN=your_fb_token
DEFAULT_TIMEZONE=America/New_York
```

---

## Examples

**Input:**
```
brief: "LithiumBuy just launched - B2B marketplace for lithium buyers and recyclers"
platforms: [linkedin, twitter, instagram]
tone: exciting, professional
schedule: optimal
```

**Output:**
```
LinkedIn post: scheduled 9:00 AM EST
X post: scheduled 9:05 AM EST
Instagram post: scheduled 12:00 PM EST
Media: banner image resized for each platform
24h engagement (LinkedIn): 312 impressions, 47 likes, 8 comments
```
