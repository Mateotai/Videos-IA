# YouTube Shorts recommendation algorithm (2025–2026) and packaging/creative levers for "Mochi & Pip"

Method note: research done 2026-11-23 via web search only. WebFetch could not reach external hosts in this session (outlierkit.com and vanguardngr.com failed to resolve), so full pages were NOT read. Every claim below comes from search-result snippets/summaries of the cited page, and the primary YouTube video or post was not checked directly. Treat exact wording and numbers as "as reported by" the cited source. Labels used: **[OFFICIAL]** = YouTube Help Center / YouTube blog / YouTube staff on record; **[PRESS]** = trade-press reporting of official statements; **[ANALYST]** = analytics firm or study with a sample; **[FOLKLORE]** = creator/vendor-blog claim with no YouTube confirmation; **[PRE-2025]** = older claim.

## 1. What signals does the Shorts feed use (2025–2026), official vs inferred?

### Takeaway
YouTube's official line is still "the audience is the algorithm": the system tests a Short on a small "seed" audience, then expands it if viewers choose to watch it rather than swipe, and if they keep watching and engage. The only feed-specific metric YouTube exposes is "Shown in feed" / "How many chose to view" (viewed vs swiped away). YouTube has never published a weighting or a threshold. Benchmarks such as "70% viewed" are community folklore. The one confirmed ranking change in 2026 is an **originality** update announced on 1 Oct 2026. It is not a threat to Mochi & Pip, which is 100% original.

### Cited Findings
- **[OFFICIAL]** YouTube Help defines "Shown in feed" as the number of times a Short appeared in the Shorts feed, and "How many chose to view" as the percentage of times viewers viewed the Short versus swiping away. The metric was introduced and explained by Todd Sherman (then Shorts product lead) on Creator Insider. One source notes that YouTube has not said this exact number is the ranking signal. — [vidIQ, "How Does the YouTube Shorts Algorithm Work in 2026?"](https://vidiq.com/blog/post/youtube-shorts-algorithm/); [Search Engine Journal](https://www.searchenginejournal.com/youtube-explains-how-shorts-algorithm-works/494953/)
- **[OFFICIAL, PRE-2025, 2023]** Todd Sherman on the seed audience: "There are parts of the algorithm that try and find people, find creators an audience… sometimes those algorithms will go and effectively find like a seed audience, find a set of people that may enjoy your video." He described early views of a few hundred or a few thousand, followed by a drop-off, as **exploratory**. He also said "The audience is the algorithm." — [Search Engine Journal](https://www.searchenginejournal.com/youtube-explains-how-shorts-algorithm-works/494953/); [TechCrunch, Aug 2023](https://techcrunch.com/2023/08/25/youtube-demystifies-the-shorts-algorithm-views-and-answers-other-creator-questions/); [Creator Handbook](https://www.creatorhandbook.net/youtube-explains-how-the-youtube-shorts-algorithm-works/)
- **[OFFICIAL, PRE-2025]** Todd Beaupré (YouTube director of discovery) explained at VidCon that YouTube separated Shorts watch history from long-form, so watching Shorts does not distort long-form recommendations. — [vidIQ, Shorts vs long-form viewers](https://vidiq.com/blog/post/youtube-shorts-long-form-viewers-algorithm)
- **[OFFICIAL / PRESS, 2026]** On 1 Oct 2026 YouTube said Shorts recommendations will favor original content and reduce reach for channels that re-upload barely changed clips. The change affects recommendations only, and monetization stays under the reused-content policy. Per coverage of Rene Ritchie's Creator Insider video of the same date, voice-over narration, minor technical edits and template-based bulk changes do **not** make a reused clip original. Search Engine Journal (via Relevant Audience) noted the video does not say when the change starts or whether it is already live. Sources disagree on whether the announcement came from Creator Insider or from a TeamYouTube/Help community post. — [Relevant Audience](https://www.relevantaudience.com/youtube/youtube-shorts-original-content-reach-update/); [Mark Studios](https://www.markstudios.com/blog/youtube-shorts-original-content-update-2026); [OutlierKit](https://outlierkit.com/resources/youtube-shorts-original-content-update/)
- **[PRESS / blog, 2026]** A secondhand report says Ritchie stated the system re-evaluates a channel as it becomes more original, and that deleting old uploads is not a confirmed fix. — [Zoupyu blog](https://zoupyu.com/blog/is-clipping-dead-youtube-shorts-originality)
- **[ANALYST / FOLKLORE]** The working community benchmark is roughly 70% or more "chose to view" (30% or less swiped) as "workable", and 80% or more as "strong". Some guides want under 25% swipe-away for Shorts under 30 s, and others under 20%. One guide calls 50/50 "average" and below 30% viewed "dead". All sources concede YouTube publishes **no official benchmark**. — [1of10](https://1of10.com/blog/youtube-shorts-analytics/); [gofaceless.ai](https://www.gofaceless.ai/en/blog/youtube-shorts-retention-rate-benchmarks); [unityfilms](https://unityfilms.net/youtube-shorts-analytics/); [Metricool](https://metricool.com/youtube-shorts-algorithm/)
- **[ANALYST, single channel]** vidIQ reported a **73.6% average percentage viewed** across its own Shorts over 12 months in 2026. This is one channel's average percentage viewed (APV), not a viewed-vs-swiped figure and not a platform norm. — reported via [1of10](https://1of10.com/blog/youtube-shorts-analytics/) / [vidseeds](https://vidseeds.ai/blog/youtube-shorts-strategy-2026/)
- **[FOLKLORE]** One 2026 vendor blog claims "watch time replaced swipe rate" as the main signal. Another source flags this as unverified. — [socialync](https://www.socialync.io/blog/youtube-shorts-algorithm-2026); flagged by search summary of [OutlierKit updates list](https://outlierkit.com/resources/youtube-algorithm-updates/)
- **[FOLKLORE]** A vendor blog (Fliki) attributes a "September 2026 Creator Insider conversation" on viewed-vs-swiped design to Todd Beaupré, but elsewhere attributes the same metric to Sherman. This could not be verified. — [Fliki](https://fliki.ai/blog/youtube-shorts-algorithm)

### Inferences
- In practical ranking-signal order for Mochi & Pip, as inferred from what YouTube exposes and discusses: (1) chose-to-view vs swiped, (2) APV and rewatch, i.e. finishing and looping, (3) engagement such as likes, shares and subscribes from the Short. Likes and shares are plausible secondary signals, but no 2025–2026 official weighting was found. For Made for Kids content, comments cannot be a signal at all, because they are disabled (see section 7).
- The originality update should favor a fully original, code-animated series over clip/reupload channels competing for the same kid audience.

### Gaps
- No primary YouTube statement found in 2025–2026 giving relative weights for likes, shares, subscribes or loops. No official threshold for chose-to-view.
- The original Creator Insider video of 1 Oct 2026 could not be opened, so its exact wording is unverified.

## 2. March 2025 view-count change: effect and which metric to optimize

### Takeaway
Since 31 Mar 2025, a Shorts "view" counts every start or replay with no minimum watch time. The old metric survives as **"engaged views"**, shown in Advanced Mode, and it still drives YPP eligibility and revenue. Headline views became an inflated, loop-inclusive vanity number. Optimize the chose-to-view percentage, APV and engaged views.

### Cited Findings
- **[OFFICIAL via PRESS]** From 31 Mar 2025, Shorts views count every time a Short starts to play or replay, with no minimum watch time. Before this, a view required a certain number of seconds watched. The previous metric was renamed "engaged views" and lives in YouTube Analytics **Advanced Mode** only. YPP eligibility and payouts still use engaged views. For comparisons with content published before 31 Mar, YouTube advised using engaged views. YouTube's stated rationale was that creators want to know how often their Shorts are actually seen, and the change aligns YouTube with TikTok and Instagram. — [TechCrunch, 26 Mar 2025](https://techcrunch.com/2025/03/26/youtube-is-changing-how-youtube-shorts-views-are-counted); [Tubefilter](https://www.tubefilter.com/2025/03/26/youtube-shorts-views-counting-stats/); [Search Engine Journal](https://www.searchenginejournal.com/youtube-changes-shorts-view-counts-no-change-to-monetization/543005/); [Engadget](https://www.engadget.com/social-media/youtube-is-changing-how-it-calculates-views-for-shorts-233058880.html)
- **[OFFICIAL, Aug 2026]** A YouTube blog post of 12 Aug 2026 defines an engaged view as a viewer who stayed to watch past the initial seconds, **not including loops**. Qualified Shorts views must come from public Shorts. — [YouTube blog, monetization / qualified watch hours / Shorts views](https://blog.youtube/news-and-events/youtube-monetization-qualified-watch-hours-shorts-views/)
- **[OFFICIAL / PRESS, 2026–2027]** Current Shorts route to YPP: 1,000 subscribers plus 10M Shorts views in 90 days, or 4,000 public watch hours. Changes take effect **1 Feb 2027**, and existing members are grandfathered. Reports conflict on the new numbers: Cined and NoFilmSchool say they double to 8,000 hours or 20M Shorts views, while Search Engine Journal describes an "active" standard instead (1,000 qualified hours, or 1M qualified Shorts views in 90 days, or 2 long-form uploads or 5 Shorts). The Shorts ad-revenue floor is reported as 10M qualified views in 90 days. Shorts watched as ads do not count toward the 20M bar. — [Tubefilter, 10 Aug 2026](https://www.tubefilter.com/2026/08/10/youtube-partner-program-ad-eligibility-requirements-shorts/); [NoFilmSchool](https://nofilmschool.com/youtube-partner-program-changes); [SEJ](https://searchenginejournal.com/youtube-updates-partner-program-terms-shorts-payout-rules/585331); [PPC Land](https://ppc.land/shorts-watched-as-ads-do-not-count-toward-youtubes-20-million-view-bar/); [YouTube YPP 2027 post](https://blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/)
- **[FOLKLORE / unverified]** One guide lists "Views count from the first frame (August 24) — Confirmed" for 2026. No primary source was found, and it may be a garbled restatement of the March 2025 change. — reported in search summary of [OutlierKit updates list](https://outlierkit.com/resources/youtube-algorithm-updates/)

### Inferences
- Because loops inflate "views" but not "engaged views", a seamless loop now pumps the public counter, which helps social proof. Loops are excluded from the engaged views that count for monetization. Whether loops still help *ranking* is not officially stated.
- For the dashboard, use three columns per Short: chose-to-view %, APV (can exceed 100% with loops), and engaged views / views ratio. Ignore raw views for decisions.

### Gaps
- Exact new YPP thresholds from 1 Feb 2027 are conflicting across reports. Check [support.google.com/youtube/answer/72851](https://support.google.com/youtube/answer/72851) directly.
- Whether Made for Kids Shorts earn from the Shorts revenue pool on equal terms was not researched or confirmed.

## 3. Optimal length (Shorts up to 3 min since Oct 2024) and loops

### Takeaway
The largest measured dataset (Quso, n = 108,138 Shorts) finds **11–20 s** has the highest median views, with performance falling at both ends (over 90 s is about 10x worse than under 10 s). Survey and blog evidence also favors under 30 s for views. Mochi & Pip's 23–45 s is at the long end of the sweet spot. The 3-act escalation structure argues for trimming toward about 25–35 s.

### Cited Findings
- **[OFFICIAL via secondary]** The Shorts length cap rose from 60 s to 3 min on 15 Oct 2024. — summary of [OutlierKit updates](https://outlierkit.com/resources/youtube-algorithm-updates/); [AIR Media-Tech](https://air.io/en/trending/youtube-algorithm-in-2026-month-by-month-changes-that-affect-your-views)
- **[ANALYST, n = 108,138 matured Shorts]** 11–20 s had the highest median views, with fall-off on both sides. Under 10 s had a median of about 514 views and over 90 s about 51. This measures views, not retention. — [Quso.ai research](https://quso.ai/research/youtube-shorts-length)
- **[ANALYST – survey, n = 507 creators]** Adobe Express: creators most often cited under 30 s as ideal for views and click-throughs, with 30–60 s tied for subscriber growth. This is self-reported opinion, not measured data. — [Adobe Express study](https://www.adobe.com/express/learn/blog/youtube-shorts-length-study); [ContentGrip](https://www.contentgrip.com/youtube-shorts-length-study/)
- **[ANALYST, PRE-2025, 2023, n = 5,400]** Inflow Network found 50–60 s Shorts drew the most views. This predates both the 3-min cap and the 2025 view-count change. — cited via [Piktochart](https://piktochart.com/blog/how-long-youtube-shorts/)
- **[FOLKLORE]** "15–30 s Shorts often exceed 80% retention" (Opus, no source). "Under 30 s: 100%+ retention is common due to replay loops; longer Shorts usually need 80–90% retention" (Toptal, rule of thumb). — [Opus.pro](https://opus.pro/blog/ideal-youtube-shorts-length-format-retention); [Toptal](https://www.toptal.com/creator/post/youtube-shorts-length)

### Inferences
- APV over 100% is only realistic when the last frame flows into the first. For Mochi & Pip, the "PART N" end card breaks the loop. One option is to make the end card at most 1 s and have its final frame match the hook's first frame (same pose and background), so an auto-replay looks continuous.
- Run a length experiment: 6 episodes cut to about 25 s versus 6 at about 40 s, comparing chose-to-view % and APV. Or use YouTube's upcoming video-cut A/B test if it becomes available to the channel (section 6).

### Gaps
- No 2025–2026 study isolates length effects for animation or kids content. No official YouTube statement exists on length preference in ranking.

## 4. Hooks for non-verbal animation (first 1–3 s)

### Takeaway
No 2025–2026 primary study on hooks for non-verbal kids animation was found. The evidence is indirect. The 0–2 s decision is the "chose to view vs swiped away" metric, which is the first gate in section 1. Body language must carry everything without dialogue.

### Cited Findings
- **[OFFICIAL]** The viewed-vs-swiped decision is measured per impression in the Shorts feed, so it captures the first seconds' performance. — [vidIQ](https://vidiq.com/blog/post/youtube-shorts-algorithm/)
- **[ANALYST / blog]** Guides report that about 85% of Shorts impressions arrive within the first 48 h, implying the early hook-driven response decides reach. This is an unsourced statistic. — [Zebracat stats](https://www.zebracat.ai/post/youtube-shorts-statistics)
- **[Context, not Shorts-specific]** Pixar animators on the non-verbal short *Loop* (2020) said their accumulated body-language knowledge was "close to useless" for a non-speaking lead, and that expression had to be rebuilt through gesture and sound. — [IndieWire](https://www.indiewire.com/features/general/loop-pixar-short-first-non-verbal-character-1234582420/)
- **[Context]** Pencilmation, a dialogue-light 2D gag channel with a recurring cast, was reported as the most-subscribed 2D-animation-focused original creator channel on YouTube as of Dec 2021. — [Wikipedia: Pencilmation](https://en.wikipedia.org/wiki/Pencilmation)
- **[OFFICIAL / PRESS, 2026]** YouTube's new video A/B testing is described with the line "Upload different video cuts for Shorts to test hooks". It tests up to 2–3 cuts, gives a retention curve per version and a predicted winner, and leaves 7 days to choose. — [PPC Land](https://ppc.land/youtubes-video-tests-will-give-creators-seven-days-to-pick-a-winning-cut/); [PPC Land](https://ppc.land/youtube-to-test-up-to-3-versions-of-one-video-on-real-viewers-shorts-too/)

### Inferences
- With no words, the hook must be a visual question resolved later. Examples: Pip already holding the prize while Mochi stares, an object mid-fall, an extreme close-up on Mochi's eyes locking on. Avoid establishing shots. Frame 1 should already show the conflict, because the swipe decision comes before any setup.
- The same visual grammar every episode (Mochi orange plus Pip in frame within 0.5 s) builds instant recognition for returning viewers. This is a plausible but unmeasured benefit.

### Gaps
- No data found on frame-1 motion versus static, on text overlays for kids content, or on what age group actually swipes Made for Kids Shorts. YouTube Kids has no Shorts tab ([Android Authority](https://www.androidauthority.com/youtube-parental-controls-shorts-timer-3632428)), so kids' Shorts audiences are on main YouTube, often on parents' or supervised accounts.

## 5. Series, recurring characters, "Part N", playlists, related video links

### Takeaway
YouTube is actively pushing episodic Shorts. A **Shorts series** feature (seasons, episodes, sequential playback, custom thumbnails) was announced on 23 Sep 2026, but it is **YPP-only**. The long-standing "related video" link lets one Short point to another video on the channel. Made for Kids status may block some of these features, and that was not confirmed for series or the manual link.

### Cited Findings
- **[OFFICIAL / PRESS, Sep 2026]** At Made on YouTube, 23 Sep 2026, YouTube launched Shorts series: creators group Shorts into seasons and episodes with sequential playback and custom thumbnails. It is rolling out to **YPP creators** on web, mobile and TV. It is tied to the microdrama trend, cited at 6.5B views in H1 2026. A follow-up launched "Shorts series subscriptions". — [TechCrunch](https://techcrunch.com/2026/09/23/youtubes-new-short-series-feature-brings-episodic-viewing-to-shorts/); [YouTube blog](https://blog.youtube/news-and-events/made-on-youtube-creators-shorts-series-tv-features/); [Tubefilter](https://www.tubefilter.com/2026/09/24/made-on-youtube-shorts-series-microdramas/amp/); [MediaPost](https://www.mediapost.com/publications/article/419074/youtube-rolls-out-shorts-series-subscriptions.html); [Digital Trends](https://www.digitaltrends.com/home-theater/youtube-is-giving-shorts-a-tv-sized-makeover-complete-with-seasons-episodes-and-sequential-playback/)
- **[OFFICIAL, Aug 2025]** Creators could turn existing playlists into TV-style "shows" with seasons (Creator Shows). — reported via [TechCrunch](https://techcrunch.com/2026/09/23/youtubes-new-short-series-feature-brings-episodic-viewing-to-shorts/)
- **[OFFICIAL]** "Add a related video to your YouTube Shorts": one link per Short to any video on the same channel, set in Studio > Details. YouTube suggests linking to long-form videos, a **series of Shorts**, or livestreams. It works on old and new Shorts and may require channel verification. It launched Aug 2023 **[PRE-2025]**. — [YouTube Help 14075157](https://support.google.com/youtube/answer/14075157); [vidIQ](https://vidiq.com/blog/post/youtube-related-links-connect-shorts-long-videos)
- **[OFFICIAL via PRESS, Nov 2026]** Shorts created with the clips tool auto-link to the source video **unless private, unlisted, or Made for Kids**. — [SEJ](https://www.searchenginejournal.com/youtube-studio-clips-podcast-episodes-shorts/597408/)
- **[OFFICIAL]** YouTube's "made for kids" help page lists features restricted for MFK content, including autoplay on home and cards/end screens. — [YouTube Help 9632097](https://support.google.com/youtube/answer/9632097?hl=en)

### Inferences
- "PART N" end cards make sense only if the viewer can reach part N-1 or N+1. Until the channel is in YPP and can use Shorts series, use the related-video link on each Short pointing to the previous part or to a "Mochi & Pip – all episodes" playlist, if MFK permits it (to verify in Studio). Consider whether "PART N" misleads: these seem to be standalone gags, not serialized plots. If episodes don't depend on each other, a recurring-format tag (e.g., "Mochi & Pip #47") may promise continuity without implying the viewer missed something.
- Recurring characters with a fixed gag formula (attempt, escalation, twist) fit what YouTube is now productizing as "series".

### Gaps
- Not confirmed whether Shorts series or the manual related-video link are available for Made for Kids Shorts.
- No measured data on whether "Part N" labels raise APV or subscriptions.

## 6. Upload frequency, timing, and testing tools

### Takeaway
YouTube's Shorts lead said upload frequency is **not** rewarded per se (2023). No 2025–2026 dataset on best posting times was found, and the early-48h concentration of impressions makes posting time a minor lever. YouTube's Test & Compare **excludes Shorts and Made for Kids content**. A newer video-cut A/B test aimed at Shorts hooks has been announced, but with no confirmed date or MFK eligibility.

### Cited Findings
- **[OFFICIAL, PRE-2025, 2023]** Todd Sherman rejected the idea that posting many Shorts a day improves visibility, saying YouTube's algorithm does not favor creators based on upload frequency. Coverage headline: "No! Posting 10 videos a day doesn't affect your performance." — [Benzinga](https://www.benzinga.com/news/23/08/34020532/youtube-shorts-chief-debunks-popular-myths-no-posting-10-videos-a-day-doesnt-affect-your-performance)
- **[OFFICIAL, PRE-2025, 2024]** Rene Ritchie ran an experiment posting 3 Shorts/day on @youtubeliaison (YouTube, IG, TikTok), then settled on 1 per weekday. — [YouTube Blog, Rene's Top Five](https://blog.youtube/creator-and-artist-stories/renes-top-five-july-25-2024/); [Tubefilter](https://www.tubefilter.com/2024/08/26/rene-ritchie-shorts-creator-faqs/)
- **[OFFICIAL]** YouTube Help: A/B testing (titles and thumbnails) is **not available for Shorts**. Third-party guides note that Made for Kids, private and scheduled-Premiere videos are also excluded. Title testing was added alongside thumbnails in Dec 2025 for long-form. — [YouTube Help 16391400](https://support.google.com/youtube/answer/16391400); [Scopitech](https://scopitech.com/youtube-test-and-compare-ab-testing/); [PPC Land](https://ppc.land/youtube-expands-a-b-testing-to-include-titles-alongside-thumbnails/)
- **[OFFICIAL / PRESS, 2026]** Video A/B testing: up to about 3 cuts of the same video, retention curves per version, a predicted winner, and 7 days to choose. It is described as "starting with Shorts" ("Upload different video cuts for Shorts to test hooks"). No confirmed rollout date, and one source mentions 2027. — [PPC Land](https://ppc.land/youtubes-video-tests-will-give-creators-seven-days-to-pick-a-winning-cut/); [80.lv](https://80.lv/articles/youtube-adds-a-b-testing-for-video-cuts-expanding-studio-s-toolkit/); [games.gg](https://games.gg/news/youtube-ab-testing-full-videos/)
- **[ANALYST / blog]** About 85% of Shorts impressions arrive within 48 h (unsourced). No 2025 best-time-to-post dataset found. — [Zebracat](https://www.zebracat.ai/post/youtube-shorts-statistics)

### Inferences
- One Short per day is fine. There is no official penalty or bonus for cadence, so the binding constraint is quality per episode, since each one gets its own seed test. If quality drops to keep the daily cadence, posting less is safer than posting weak episodes, because a weak Short simply flatlines. Posting time: pick a consistent slot when target-market parents and kids are on (after school / evening in US time, or test Hindi/Indonesian prime time). Treat timing as low impact.
- Because MFK excludes Test & Compare, the only A/B method right now is manual: post two variants of a concept on different days and compare chose-to-view %. This is noisy.

### Gaps
- No 2025–2026 official statement on cadence. The Sherman quote is from 2023.
- Unknown whether video-cut A/B testing will allow Made for Kids content.

## 7. Titles, hashtags, descriptions, thumbnails/covers; Made for Kids constraints

### Takeaway
In the Shorts feed, the video itself is the "thumbnail", so packaging matters less than in long-form. Titles and covers matter for **search** (a Shorts filter was added to search in Jan 2026), for the channel's Shorts tab, and for TV. Custom Shorts thumbnails arrived in 2025–2026, reportedly YPP-only and without A/B testing. Made for Kids disables comments and several features, which removes the comment signal entirely.

### Cited Findings
- **[OFFICIAL via secondary]** A Shorts filter in YouTube search was announced on 8 Jan 2026, rolling out from 10 Jan. — summary of [OutlierKit updates](https://outlierkit.com/resources/youtube-algorithm-updates/)
- **[PRESS, 2026]** Custom Shorts thumbnails: YPP creators can upload a custom thumbnail for a Short, reportedly from a 24 Jul 2026 update. On desktop creators pick from suggested frames, on mobile any frame. Ask Studio gained thumbnail generation (Jul 2026). Shorts thumbnail A/B testing is blocked. Sources conflict on scope (YPP-only, desktop vs broader rollout). — [PPC Land](https://ppc.land/youtube-ends-2-year-wait-for-shorts-thumbnails-but-blocks-a-b-testing/); [youseo](https://youseo.app/en/blogs/custom-shorts-thumbnails-are-finally-here-2026-update); [vidIQ](https://vidiq.com/blog/post/youtube-shorts-custom-thumbnails/)
- **[OFFICIAL, PRE-2025, 2023]** Sherman's 2023 Creator Insider session covered hashtags and why not to delete/repost (see section 8). The specific hashtag guidance was not in the snippets retrieved. — [YouTube Blog, Rene's Top Five Aug 24 2023](https://blog.youtube/culture-and-trends/renes-top-five-august-24-2023-edition/)
- **[FOLKLORE / third-party]** Made for Kids content has comments automatically disabled, and they cannot be re-enabled without changing the audience setting. Guides say not to change the setting merely to get comments. One vendor blog claims MFK content is "excluded from personalized recommendations entirely". This is unverified and conflicts with the reality that MFK Shorts do appear in feeds. — [Smash Balloon](https://smashballoon.com/youtube-shorts-not-getting-views/); [CommentShark](https://www.commentshark.com/blog/youtube-comments-not-showing-shorts-fix)
- **[OFFICIAL]** The MFK help page lists restricted features (incl. autoplay on home, cards/end screens) under COPPA. — [YouTube Help 9632097](https://support.google.com/youtube/answer/9632097?hl=en)
- **[Community]** Unverified channels (no phone/ID verification) may be treated as "low trust" with limited reach. — [YouTube Community thread](https://support.google.com/youtube/thread/437829957/shorts-not-going-to-short-feed-not-even-for-subscribed-users?hl=en-GB)

### Inferences
- Titles: since search now has a Shorts filter and parents search with phrases like "cat and mouse cartoon", use descriptive, searchable English titles with translated titles. This is already done, and it fits non-verbal content that is language-neutral worldwide. Put the character names plus the situation ("Mochi tries to catch Pip's cheese") in the title rather than clickbait.
- Hashtags: no 2025–2026 evidence that #shorts is needed for classification. Vertical format and length decide that. A few descriptive tags (#cartoon #catandmouse #kidscartoon) are harmless. Unconfirmed.
- Verify the channel (phone/ID) to avoid any "low-trust" throttling.

### Gaps
- No official 2025–2026 statement on whether #shorts or hashtags affect Shorts distribution.
- No official confirmation of how Made for Kids status changes Shorts-feed eligibility. The help page was not readable here, so check support.google.com/youtube/answer/9632097 and the "Made for kids" creator page directly.

## 8. Cold start, how many Shorts before traction, deleting/reuploading

### Takeaway
YouTube says each Short is tested on a seed audience, and early plateaus of a few hundred to a few thousand views are normal "exploration" (2023). The Shorts lead explicitly warned against deleting and reposting, which may be treated as spam. No credible figure for "N Shorts before traction" was found.

### Cited Findings
- **[OFFICIAL, PRE-2025, 2023/2024]** Todd Sherman explained "why you shouldn't delete and repost. Problem is, YouTube might consider that as spam, and your channel could get flagged for spamming." — [YouTube Blog, Rene's Top Five Apr 18 2024](https://blog.youtube/culture-and-trends/renes-top-five-on-youtube-april-18-2024-edition/)
- **[OFFICIAL, PRE-2025, 2023]** Seed-audience and plateau explanation (see section 1). — [Search Engine Journal](https://www.searchenginejournal.com/youtube-explains-how-shorts-algorithm-works/494953/)
- **[FOLKLORE]** Claims of a "three-segment seed audience", specific engagement thresholds, or a "2,000-view flatline" are not supported by the interview coverage. — [zqstream](https://zqstream.com/blog/youtube-shorts-flatline-2000-views/)
- **[PRESS, 2026]** In the originality context, deleting old uploads is "not a confirmed fix", and the system reportedly re-evaluates as a channel's content changes. — [Zoupyu](https://zoupyu.com/blog/is-clipping-dead-youtube-shorts-originality)

### Inferences
- Do not delete flops. Treat each Short as an independent lottery ticket tested on new seed audiences. If a concept flops, remake it as a *new, meaningfully different* episode (new hook, new gag) rather than re-uploading the same file.
- Judge progress per batch (for example a rolling median of chose-to-view % over 10–20 Shorts), not per video.

### Gaps
- No 2025–2026 data on how many uploads new channels typically need before traction, and no official statement on a "new channel" phase.

## 9. Sound and music: trending audio vs original synthesized music

### Takeaway
No official YouTube statement or rigorous study found that trending audio boosts Shorts reach. The often-quoted "+21% reach" (or "+28%") figures are recycled vendor stats. For a non-verbal cartoon, original music and sound effects carry the storytelling. Licensed trending tracks also risk reducing revenue shares, and their useful life is short.

### Cited Findings
- **[FOLKLORE / ANALYST, unverified]** "Trending audio in the first 5 s ≈ +21% reach" (repeated across stat roundups, likely one shared source); "+28% reach" (Zebracat). — [inBeat](https://inbeat.agency/blog/youtube-shorts-statistics); [Awisee](https://awisee.com/blog/youtube-shorts-statistics/); [Zebracat](https://www.zebracat.ai/post/youtube-shorts-statistics)
- **[ANALYST / blog]** Licensed trending music can reduce Shorts ad earnings, because revenue is shared with music rights holders. A trending sound's useful life is about 7–14 days. — [Falconvid](https://falconvid.ai/blog/does-trending-audio-hurt-shorts-monetization)
- **[OFFICIAL, 2026]** The originality update rewards original content. Fully original audio and visuals fit it. — [Relevant Audience](https://www.relevantaudience.com/youtube/youtube-shorts-original-content-reach-update/)

### Inferences
- Original synthesized music should not hurt distribution. No evidence suggests YouTube penalizes non-library audio. The bigger levers are sound design that makes gags readable on mute-off viewing (cartoon SFX, stings on the twist) and a recognizable 1–2 s recurring sting or motif for brand recall.
### Gaps
- Unverified in this session: how the Shorts revenue pool is split with music rights holders when a Short uses library or trending music. Check YouTube Help "Shorts monetization policies" ([answer 12504220](https://support.google.com/youtube/answer/12504220?hl=en)).
- No controlled 2025–2026 study of trending vs original audio on YouTube Shorts specifically, and none for kids content.
- No primary YouTube statement on whether using a trending sound increases distribution.
