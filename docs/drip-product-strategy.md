# Drip: PRD, MVP, monetisering og launchplan

## 1. Executive summary

Drip er en ekstremt simpel mobilapp til små meningsfulde øjeblikke: brugeren åbner appen, trykker på én stor knap og modtager ét værdifuldt indholdskort. Produktet skal bevidst være anti-feed, anti-scroll og anti-kompleksitet.

**Kerneflow:** `Åbn app -> Tryk -> Modtag ét drip -> Gem/del/færdig`.

**Brutal realisme:** Ideen er let at kopiere, og generisk citatindhold har lav betalingsvillighed. Drip kan kun blive en forretning, hvis appen hurtigt beviser en specifik daglig vane, tydelig personlig værdi og stærk delbarhed. Første version skal derfor ikke forsøge at være en bred inspirationsapp; den skal validere, om brugere faktisk kommer tilbage dagligt og deler drips organisk.

## 2. Produktmission og positionering

### Mission

At skabe små meningsfulde øjeblikke i løbet af dagen gennem ét nøje udvalgt drip ad gangen.

### Positionering

Drip er en minimalistisk fortune-cookie-app med reel værdi. Den er ikke et socialt netværk, ikke et indholdsfeed og ikke endnu en produktivitetsapp med dashboards.

### Designprincipper

1. **Ét valg ad gangen:** Ingen feed, ingen tabs i MVP, ingen kompleks navigation.
2. **Lav kognitiv belastning:** Brugeren må aldrig skulle beslutte, hvad de skal læse.
3. **Nysgerrighed først:** Knappen skal føles som et lille lykkehjul.
4. **Delbar værdi:** Hvert godt drip skal kunne deles som et billede på under 10 sekunder.
5. **Betal kun for mere relevans:** Premium må ikke blot være flere citater; det skal give mere personlig og nyttig værdi.

## 3. Målgruppe

### Primær målgruppe for MVP

Personer mellem 18 og 35, der allerede bruger apps til motivation, selvudvikling, stoicisme, journaling eller produktivitet, men som er trætte af tunge systemer og endeløs scrolling.

### Tidlige brugersegmenter

| Segment | Problem | Drip-vinkel | Betalingspotentiale |
| --- | --- | --- | --- |
| Studerende | Mangler små pauser og refleksion | Daglige refleksioner og mikro-udfordringer | Lav-middel |
| Founders/creators | Søger motivation og mentale prompts | Entrepreneurship pack | Middel |
| Fitness/disciplin | Vil have simple daglige skub | Discipline og fitness challenges | Middel |
| Stoicism/self-improvement | Vil have daglige principper | Stoicisme og refleksion | Middel-høj |
| Dating/social confidence | Vil have konkrete sociale udfordringer | Social og dating challenges | Middel |

### Persona for første launch

**Navn:** Mads, 27 år, creator/founder-type.  
**Adfærd:** Bruger X, Instagram, podcasts og Notion. Har prøvet habit trackers, men dropper dem efter få dage.  
**Job-to-be-done:** “Giv mig et lille skub eller perspektiv, uden at jeg skal scrolle eller tænke.”

## 4. Komplet PRD

### 4.1 Problem

Moderne apps konkurrerer på mere indhold, flere notifikationer og mere engagementstid. Mange brugere ønsker dog små pauser, inspiration og personlig refleksion uden at blive fanget i et feed.

### 4.2 Løsning

Drip leverer ét kurateret drip pr. tryk. Hvert drip har en kategori, en kort tekst og én simpel handling: gem, del eller markér udført.

### 4.3 MVP-scope

#### Skærm 1: Home

- Logo: `Drip`
- Stor central knap: `Giv mig et drip`
- Diskret daglig tæller: `3/10 gratis drips brugt`
- Diskret streak-indikator: `🔥 4 dage`

#### Skærm 2: Drip card

Vises efter knaptryk som et kort på samme skærm eller med let modal-animation.

Kortet indeholder:

- Kategori: Quote, Challenge, Fact, Question, Insight eller Reflection
- Drip-tekst
- Handlinger:
  - `Gem`
  - `Del`
  - `Udført` kun for challenges
  - `Nyt drip`

#### Skærm 3: Paywall

Udløses efter 10 gratis drips på samme dag eller ved premium-kategorier.

Budskab:

- `Du har brugt dagens 10 gratis drips.`
- `Få ubegrænsede drips, historik, premium packs og AI-drips.`
- Pris: `29 kr./md.` ved launch-test. Test senere `39 kr./md.`

#### Skærm 4: Minimal settings

- Premium-status
- Restore purchases
- Privacy policy
- Terms
- Slet konto

### 4.4 Ikke med i MVP

- Kommentarer
- Profiler
- Likes
- Vennerelationer
- Kompleks onboarding
- Webapp
- Avanceret personalisering
- Push-notifikationer med komplekse regler
- Fuldt community

### 4.5 Funktionelle krav

| ID | Krav | Prioritet |
| --- | --- | --- |
| F1 | Brugeren kan trykke på én knap og få ét random drip | Must |
| F2 | Appen viser kun ét drip ad gangen | Must |
| F3 | Gratis brugere er begrænset til 10 drips pr. dag | Must |
| F4 | Brugeren kan gemme favoritter | Must |
| F5 | Brugeren kan dele et drip som billede | Must |
| F6 | Appen tæller streaks | Should |
| F7 | Brugeren kan se basal historik | Premium |
| F8 | Brugeren kan købe premium via RevenueCat | Must |
| F9 | Brugeren kan købe premium packs | Should |
| F10 | Brugeren kan generere AI-drips | Premium later |

### 4.6 Ikke-funktionelle krav

- App-start under 2 sekunder på moderne iPhone/Android.
- Drip-generation fra lokalt cachet indhold skal føles øjeblikkelig.
- Appen skal kunne fungere med fallback-indhold uden netværk.
- Ingen personfølsomme data i MVP ud over auth-id, device-id og events.
- Alle delte billeder skal have Drip-branding og eventuelt download-link.

### 4.7 Succesmetrikker

| Metrik | MVP-mål efter 30 dage | Kommentar |
| --- | --- | --- |
| D1 retention | 35%+ | Under 25% er svagt |
| D7 retention | 12%+ | Under 8% kræver repositionering |
| Gratis -> premium trial/køb | 2-4% | Realistisk for simpel consumer app |
| Delinger pr. aktiv bruger pr. uge | 0.15+ | Growth afhænger af share rate |
| Gennemsnitlige drips pr. DAU | 3-6 | Over 8 kan indikere binge, ikke vane |
| Paywall view -> purchase | 1.5-3% | Første benchmark |

## 5. Indholdssystem

### MVP-kategorier

1. **Quote:** Kort, stærkt og ikke-kliché.
2. **Challenge:** En konkret mikrohandling.
3. **Fact:** Sjov, overraskende og let at dele.
4. **Question:** Et spørgsmål til refleksion.
5. **Insight:** En kort mental model eller observation.
6. **Reflection:** En rolig prompt til eftertanke.

### Eksempler

- `Challenge:` Send en besked til en person, du ikke har talt med længe.
- `Question:` Hvis du kunne starte forfra i morgen, hvad ville du gøre anderledes?
- `Fact:` Blæksprutter har tre hjerter.
- `Insight:` Det, du gentager dagligt, bliver din identitet hurtigere end det, du planlægger årligt.
- `Reflection:` Hvilken lille ting undgår du, fordi den føles større i dit hoved end i virkeligheden?

### Indholdsstrategi

Start med 500 menneskekuraterede drips, ikke AI-genereret masseindhold. AI kan give volumen senere, men kvaliteten i første oplevelse afgør retention. Minimum per launch:

- 120 quotes
- 120 questions
- 100 challenges
- 80 facts
- 50 insights
- 30 reflections

## 6. Database-design

Supabase bør bruges til auth, database, remote config og eventuel server-side edge logic. Analytics bør primært ligge i Firebase Analytics, mens kritiske produktdata gemmes i Supabase.

### 6.1 Tabellen `users`

| Felt | Type | Note |
| --- | --- | --- |
| id | uuid pk | Matcher Supabase auth user |
| created_at | timestamptz | Oprettelse |
| locale | text | Fx `da-DK` |
| timezone | text | Til daglig reset |
| is_premium | boolean | Spejlet fra RevenueCat webhook |
| revenuecat_customer_id | text | Nullable |
| deleted_at | timestamptz | Soft delete |

### 6.2 Tabellen `drips`

| Felt | Type | Note |
| --- | --- | --- |
| id | uuid pk | Drip-id |
| category | text | quote/challenge/fact/question/insight/reflection |
| pack_key | text | `free`, `stoicism`, `fitness` osv. |
| title | text | Optional |
| body | text | Selve drip-teksten |
| language | text | `da`, `en` |
| is_premium | boolean | Premium-gating |
| source | text | human/ai/import |
| quality_score | int | Intern sortering |
| active | boolean | Kan slukke dårligt indhold |
| created_at | timestamptz | Oprettelse |

### 6.3 Tabellen `user_drip_events`

| Felt | Type | Note |
| --- | --- | --- |
| id | uuid pk | Event-id |
| user_id | uuid fk | Bruger |
| drip_id | uuid fk | Drip |
| event_type | text | viewed/favorited/shared/completed |
| created_at | timestamptz | Eventtid |
| metadata | jsonb | Share target, AI prompt osv. |

### 6.4 Tabellen `daily_usage`

| Felt | Type | Note |
| --- | --- | --- |
| user_id | uuid fk | Bruger |
| usage_date | date | Lokal dato |
| drips_used | int | Gratis kvote |
| ai_drips_used | int | AI-kvote senere |
| primary key | user_id + usage_date | Unik dag |

### 6.5 Tabellen `favorites`

| Felt | Type | Note |
| --- | --- | --- |
| user_id | uuid fk | Bruger |
| drip_id | uuid fk | Drip |
| created_at | timestamptz | Gemmet tidspunkt |
| primary key | user_id + drip_id | Undgå dubletter |

### 6.6 Tabellen `streaks`

| Felt | Type | Note |
| --- | --- | --- |
| user_id | uuid pk | Bruger |
| current_streak | int | Aktuel streak |
| longest_streak | int | Rekord |
| last_active_date | date | Lokal dato |
| updated_at | timestamptz | Opdateret |

### 6.7 Tabellen `packs`

| Felt | Type | Note |
| --- | --- | --- |
| key | text pk | Fx `stoicism` |
| name | text | Visningsnavn |
| description | text | Kort pitch |
| price_tier | text | RevenueCat produkt-id |
| active | boolean | Synlighed |

### 6.8 Tabellen `user_pack_entitlements`

| Felt | Type | Note |
| --- | --- | --- |
| user_id | uuid fk | Bruger |
| pack_key | text fk | Pack |
| source | text | purchase/premium/promo |
| expires_at | timestamptz | Nullable |
| primary key | user_id + pack_key | Entitlement |

### 6.9 Tabellen `ai_drip_requests`

| Felt | Type | Note |
| --- | --- | --- |
| id | uuid pk | Request-id |
| user_id | uuid fk | Bruger |
| prompt | text | Brugerens input |
| generated_body | text | Output |
| category | text | Klassificeret kategori |
| model | text | OpenAI-model |
| tokens_used | int | Omkostningskontrol |
| created_at | timestamptz | Tidspunkt |

## 7. App-arkitektur

### Tech stack

- **App:** Expo React Native med TypeScript
- **Navigation:** Expo Router
- **State:** Zustand eller React Query + lokal state
- **Backend:** Supabase Postgres, Auth og Edge Functions
- **Payments:** RevenueCat
- **AI:** OpenAI API via Supabase Edge Function, aldrig direkte fra klienten
- **Analytics:** Firebase Analytics
- **Crash reporting:** Sentry eller Firebase Crashlytics

### Klientstruktur

```text
app/
  index.tsx                 # Home + drip flow
  paywall.tsx               # RevenueCat paywall
  settings.tsx              # Minimal settings
src/
  components/
    DripButton.tsx
    DripCard.tsx
    ShareCard.tsx
  features/
    drip/
      dripService.ts
      dripTypes.ts
      useDrip.ts
    monetization/
      revenueCat.ts
      entitlements.ts
    analytics/
      events.ts
  lib/
    supabase.ts
    queryClient.ts
  content/
    fallbackDrips.json
```

### Backend-flow for gratis drip

1. Appen beder `get_next_drip` om et drip.
2. Edge Function validerer user/device og daglig kvote.
3. Funktionen vælger et aktivt drip, brugeren ikke lige har set.
4. Funktionen øger `daily_usage.drips_used`.
5. Funktionen logger `viewed` i `user_drip_events`.
6. Klienten viser kortet.

### Backend-flow for AI Premium

1. Klienten sender brugerprompt til Edge Function.
2. Edge Function tjekker RevenueCat entitlement og rate limit.
3. OpenAI API genererer ét kort drip i valgt stil.
4. Output gemmes i `ai_drip_requests`.
5. Klienten viser AI-drip.

### Analytics events

- `app_opened`
- `drip_requested`
- `drip_viewed`
- `drip_favorited`
- `drip_shared`
- `challenge_completed`
- `paywall_viewed`
- `purchase_started`
- `purchase_completed`
- `ai_drip_requested`

## 8. Monetiseringsstrategi

### Freemium

Gratis:

- 10 drips pr. dag
- Basiskategorier
- Favoritter med begrænset antal, fx 10
- Deling

Premium:

- Ubegrænsede drips
- Historik
- Ubegrænsede favoritter
- Premium-kategorier
- Personlige kategorier
- AI-genererede drips

### Pris

Start med **29 kr./måned** og **249 kr./år**. Årlig plan skal give tydelig rabat, fordi små consumer subscriptions ofte har høj churn. Test 39 kr./måned først, når produktet har D7 retention over 15%.

### Premium packs

Packs bør være engangskøb eller inkluderet i premium. Foreslåede priser:

| Pack | Pris | Kommentar |
| --- | --- | --- |
| Stoicisme | 19 kr. | Høj relevans for målgruppen |
| Iværksætteri | 29 kr. | Kan positioneres stærkere |
| Motivation | 9 kr. | Let at kopiere, lav pris |
| Fitness | 19 kr. | Challenge-baseret |
| Dating | 29 kr. | Højere willingness-to-pay |
| Karriere | 29 kr. | Kan sælges på outcome |
| Filosofi | 19 kr. | Niche |
| Selvudvikling | 19 kr. | Generisk, kræver kvalitet |

### AI Premium

AI bør ikke være i første offentlige MVP, medmindre den bruges som premium-hook. Start med begrænset AI:

- 20 AI-drips pr. måned i Premium
- Ekstra AI-kvote senere
- Prompts: `Motiver mig`, `Giv mig disciplin`, `Nyt perspektiv`, `Social udfordring`

**Omkostningsregel:** AI må aldrig køre direkte fra klienten, og alle prompts skal rate-limites.

## 9. Growth-strategi

### Primær growth loop

1. Bruger får et stærkt drip.
2. Bruger deler det som billede/story/link.
3. Modtager ser Drip-branding og CTA.
4. Modtager installerer appen for sit eget drip.
5. Ny bruger gentager loopet.

### Delingsfeatures i MVP

- Del som billede med gradient, kategori og Drip-logo.
- Del som story i 9:16-format.
- Del som link: `Get your drip`.
- Send et drip til en ven via native share sheet.

### Indholdsbaseret growth

Lav 30 short-form videoer før launch:

- `I built an app that gives you one thought a day`
- `No feed. No likes. Just one drip.`
- `Today’s drip changed how I looked at discipline`

Kanaler:

- TikTok
- Instagram Reels
- YouTube Shorts
- Reddit communities med forsigtighed, ikke spam
- X/LinkedIn for founder-build-in-public

### Referral uden kompleksitet

Første version bør ikke have points-system. Brug simpel mekanik:

- `Del 3 drips og lås op for 1 premium pack i 7 dage`
- Track via share events og local/server-side attribution senere.

## 10. Retention-strategi

### Daglig vane

- Streak vises diskret, ikke som stress.
- Brugeren får én daglig “perfect drip” via notifikation senere.
- Notifikationer skal være opt-in og menneskelige, fx `Dit drip venter`.

### Variabilitet

Drip skal føles uforudsigelig, men ikke tilfældig på en billig måde. Mix:

- 40% refleksion/spørgsmål
- 25% challenge
- 20% quote/insight
- 15% fact/surprise

### Personlig progression

MVP kan vise:

- Streak
- Drips modtaget
- Challenges gennemført
- Favoritter

Undgå tunge badges i starten.

## 11. MVP-roadmap

### Uge 1: Foundation

- Expo app scaffold
- Supabase projekt og schema
- 500 kuraterede drips
- Home screen med knap og drip card
- Lokal fallback JSON

### Uge 2: Monetisering og deling

- RevenueCat setup
- Paywall efter 10 drips
- Favoritter
- Share-as-image
- Firebase Analytics events

### Uge 3: Polish og beta

- Streak logic
- Minimal settings
- Crash reporting
- TestFlight / Google Play internal testing
- 50 beta-brugere

### Uge 4: Launch

- App Store og Play Store release
- 30 short-form posts
- Founder-led launch posts
- Første premium-pack test

## 12. Launchplan

### Pre-launch

- Landing page med email capture.
- Venteliste med løfte: `One meaningful drip a day`.
- 50-100 beta-brugere fra personligt netværk, X, LinkedIn og relevante communities.
- Indsamling af top 20 mest delte/favoriserede drips.

### Launch day

- Public release i App Store og Play Store.
- Post på TikTok, Reels, X, LinkedIn og relevante founder communities.
- Del 5-10 eksempler på drips som billeder.
- Bed beta-brugere om at dele deres favoritdrip.

### Første 14 dage

- Ship forbedringer hver 2.-3. dag.
- Fjern dårlige drips baseret på lav favorite/share-rate.
- Test paywall-copy.
- Test kategori-mix.
- Tal manuelt med de første 25 aktive brugere.

## 13. Realistisk plan for de første 100 betalende brugere

### Antagelser

- Install -> betalende konvertering: 2-4%.
- For 100 betalende brugere kræves cirka 2.500-5.000 installs.
- Organisk social growth alene er usikker; founder-led distribution er nødvendig.

### Plan

1. **Få 100 beta-brugere** fra eget netværk og communities.
2. **Find de 20 bedste drips** baseret på favorite/share/completion.
3. **Lav 50 korte videoer** omkring de bedste drips og produktets anti-feed-positionering.
4. **Launch premium med founder-pris:** 19 kr./md. for de første 100 eller livstidsadgang for 149-249 kr. til tidlige brugere.
5. **Sælg niche-packs direkte:** Stoicisme, Iværksætteri og Dating er de mest salgbare første packs.
6. **Kontakt mikro-creators** inden for self-improvement og stoicism med gratis premium og affiliate-kode.
7. **Mål ugentligt:** installs, D1, D7, shares, paywall views og purchases.

### Mest realistiske kanal

Ikke paid ads i starten. CAC vil sandsynligvis være for høj for en 29 kr./md. app. Brug i stedet:

- Founder content
- Creator partnerships
- TikTok/Reels organic
- Communities
- App Store Optimization på søgeord som motivation, daily quotes, stoicism, self improvement

## 14. Risikoanalyse

| Risiko | Sandsynlighed | Impact | Mitigation |
| --- | --- | --- | --- |
| Appen føles som endnu en quote-app | Høj | Høj | Fokus på challenges, spørgsmål og stærk kuratering |
| Lav betalingsvillighed | Høj | Høj | Niche packs, annual plan, AI premium og founder-pris |
| Dårlig retention | Middel-høj | Høj | Streak, personligt kategori-mix, bedre første 10 drips |
| AI-indhold bliver generisk | Høj | Middel | Human-curated base og stramme prompts |
| Delinger bliver for lave | Middel | Høj | Gør share-billeder smukke og mål share-rate tidligt |
| App Store afviser manglende privacy/UGC | Lav-middel | Middel | Klar privacy, ingen UGC-feed, moderation for AI |
| RevenueCat/Supabase kompleksitet sinker MVP | Middel | Middel | Start med få entitlements og enkel schema |
| Konkurrenter kopierer hurtigt | Høj | Middel | Brand, indholdskvalitet og distribution er moat |

## 15. Hårde produktbeslutninger

1. **Ingen AI i første uge:** AI lyder godt, men øger kompleksitet og omkostning. Først skal core loop bevises.
2. **Ingen social graph:** Deling ja, social platform nej.
3. **Ingen stor onboarding:** Spørg højst om foretrukne kategorier senere.
4. **Ingen uendelig historik gratis:** Historik er premium-værdi.
5. **Kvalitet over volumen:** 500 gode drips er bedre end 50.000 middelmådige.

## 16. Første version af paywall-copy

**Headline:** Få mere end dagens 10 drips  
**Subheadline:** Ubegrænsede drips, historik, premium-kategorier og AI-genererede perspektiver.  
**Bullets:**

- Ubegrænsede drips hver dag
- Gem og gense alle favoritter
- Lås op for Stoicisme, Motivation, Fitness og Karriere
- Få personlige AI-drips

**CTA:** Start Premium  
**Sekundær CTA:** Fortsæt gratis i morgen

## 17. Konklusion

Drip bør bygges som en ultralet consumer app med én stærk vane og én stærk delingsloop. Den største risiko er ikke teknologi; det er, at indholdet føles generisk og betalingsværdien er for lav. Den hurtigste vej til sandhed er at lancere en smal, smuk MVP med 500 kuraterede drips, måle retention og share-rate brutalt og først derefter udvide med AI, packs og mere personalisering.
