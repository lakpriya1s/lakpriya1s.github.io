var e={slug:`add-ai-chat-to-a-react-native-app`,path:`/content/blog/add-ai-chat-to-a-react-native-app.md`,draft:!1,data:{title:`Add an AI chat assistant to your React Native app`,description:`Sparkle AI Chat is an open-source, brandable chat screen for React Native that skips most of the OpenAI documentation.`,publishedAt:`2024-02-22`,updatedAt:`2026-10-10`,tags:[`react-native`,`ai`,`open-source`],cover:`/images/blog/add-ai-chat-to-a-react-native-app.webp`,ogImage:`/images/blog/add-ai-chat-to-a-react-native-app-og.jpg`,coverTone:`peach`},body:`Almost every platform is trying to add a ChatGPT-like assistant. To do it, developers have to work through the OpenAI documentation, which takes time. So I packaged the work into my first npm package: a React Native library that brings an AI assistant to your app.

## Install

\`\`\`sh
npm i react-native-sparkle-ai-chat @react-native-async-storage/async-storage
\`\`\`

## Use it

Give it a platform, an API key and instructions for the assistant, and brand it with your own name, logo and colours.

\`\`\`tsx title="AIChatScreen.tsx"
import SparkleChat from 'react-native-sparkle-ai-chat';

<SparkleChat
  platform="openai"
  apiKey={OPENAI_API_KEY}
  instruction="You help customers choose from the coffees on our menu."
  brand={{ name: 'Coffee Assistant', primaryColor: '#FF5C5C' }}
/>
\`\`\`

## What’s inside

The library is the chat screen from my [Sparkle AI app](/blog/sparkle-ai-chatgpt-mobile-app), extracted into a package built with \`react-native-builder-bob\`, so it ships CommonJS, ES modules and TypeScript types.

- **Streaming** over server-sent events with \`react-native-sse\`, so answers appear as they’re written.
- **History** kept in Redux Toolkit and persisted to AsyncStorage, which is why AsyncStorage is a peer dependency.
- **Token budget.** Older messages are trimmed so the conversation fits the model’s context window.
- **Your own backend.** \`apiBaseUrl\` and \`organization\` let you point it at a proxy or any OpenAI-compatible endpoint instead of shipping a key in the app, and \`completionParams\` passes model, temperature and other options straight through.

> **Tip:** for a production app, put your key behind a small proxy and set \`apiBaseUrl\`. A key bundled in an app can be extracted.

> **Next:** function calling, so users can trigger the app’s own features by asking the assistant, and support for more AI platforms such as Gemini.

It is open source, and contributions are welcome on [GitHub](https://github.com/lakpriya1s/react-native-sparkle-ai-chat).`},t={slug:`agent-rack-one-mcp-interface-for-ai-coding-agents`,path:`/content/blog/agent-rack-one-mcp-interface-for-ai-coding-agents.md`,draft:!1,data:{title:`Agent Rack: one MCP interface for all your AI coding agents`,description:`Delegate tasks from Claude Code to Codex, opencode or Antigravity without copying context between tools.`,publishedAt:`2026-08-05`,updatedAt:`2026-10-10`,tags:[`dev-tools`,`ai`,`open-source`],cover:`/images/blog/agent-rack-one-mcp-interface-for-ai-coding-agents.webp`,ogImage:`/images/blog/agent-rack-one-mcp-interface-for-ai-coding-agents-og.jpg`,coverTone:`ink`},body:`When you are working in Claude Code, have you ever wanted to hand a task to Codex, get an alternative solution from Antigravity, or ask opencode to review your code? Usually that means opening several tools and copying context between them. That is why I built Agent Rack.

Agent Rack is an MCP server that wraps command-line coding agents. Claude Code, OpenAI Codex, opencode and Antigravity are built in, and any other CLI agent can be added with a small adapter. Point any MCP client at it, and your main agent can work with the others without leaving your workflow.

## What you can do

- Delegate quick tasks and get results straight back.
- Run long tasks as background sessions, and watch progress and live logs.
- Send follow-up instructions while an agent is running, or cancel it.
- Connect several profiles of the same agent as separate agents.

The real benefit is another agent’s context, not just another tool call. A sub-agent reads files, runs commands and reasons on its own budget, then hands back a result, so the work never fills your main conversation’s context window.

## Structured code review

Agent Rack also does structured code reviews. Its adversarial review mode looks for hidden bugs, security issues, edge cases and release risks, and returns validated JSON instead of free text. The reviewing agent never changes your code; the final decision stays with you.

## Built for Claude Code

In Claude Code it installs as a plugin, which adds the MCP server, tools and skills. You don’t need to remember tool names: describe what you want, and Claude Code delegates to the right agent, knowing when to run a quick task, when to start a background session and how to present review results. A terminal dashboard and a guided setup that detects installed agents come with it.

## How it works under the hood

Agent Rack never calls a model or asks for an API key. It runs the agent CLIs already on your \`$PATH\`, with the logins you already have, and translates between them and MCP. It's written in TypeScript on the official MCP SDK, and its layers depend in one direction only: config, security, adapters, engine, tools, server, CLI.

Every agent speaks a different protocol, so each one gets its own adapter:

- **Claude Code** streams newline-delimited JSON events, and follow-ups resume the same conversation with \`claude --resume\`.
- **Codex** runs through \`codex exec\` with JSON output and resumes by thread id.
- **OpenCode** only works interactively, so Agent Rack drives it through a real pseudo-terminal with \`node-pty\`.
- **Antigravity** has its own stream format.

Conversation ids are read from each CLI’s own output instead of being made up front, so a wrapper script configured in place of the real CLI keeps working.

Background sessions write to a ring buffer of 512 events with a byte budget. Clients read logs with a cursor that only moves forward, so they can tell when they missed something. Cancelling a session signals the whole process group, first with SIGINT and then SIGKILL (\`taskkill /T\` on Windows). A separate \`cancelling\` state keeps the concurrency limit honest while a process shuts down.

## Security, stated plainly

Handing your terminal to another agent needs guard rails, and Agent Rack is explicit about which ones it has:

- Workspaces are checked by their real path, and a single call can’t raise the execution policy above what the config allows (read-only, workspace-write or full access).
- Each agent gets an environment allow-list, and variables that look like secrets are stripped.
- Reviews always run read-only: Codex in its read-only sandbox, Claude Code in plan mode.
- The optional SSE endpoint, which the dashboard uses, needs a bearer token, accepts only loopback hosts and rejects requests with an \`Origin\` header, which blocks DNS-rebinding attacks from a browser.

It also says what it doesn’t do: a workspace allow-list isn’t a sandbox, only Codex enforces one at the OS level, and prompt injection isn’t solved.

## Try it

\`\`\`sh
# guided setup: detects your agents and MCP clients
npx agent-rack setup

# or, inside Claude Code
/plugin marketplace add lakpriya1s/agent-rack

# watch every sub-agent live
agent-rack dashboard
\`\`\`

It registers with Claude Code, Codex, Claude Desktop, Cursor, Antigravity and OpenCode, and prints a snippet for VS Code.

Agent Rack is open source on [GitHub](https://github.com/lakpriya1s/agent-rack) and on [npm](https://www.npmjs.com/package/agent-rack), where it has passed 8,000 downloads in its first year.`},n={slug:`ai-consumer-apps`,path:`/content/blog/ai-consumer-apps.md`,draft:!1,data:{title:`Four consumer AI apps, each live on iOS and Android`,description:`Sparkle AI, MemeFrog, Tasklio AI and VisChef: chat, image, voice and vision features built with React Native and shipped to both stores.`,publishedAt:`2025-07-07`,updatedAt:`2026-10-10`,tags:[`case-studies`,`ai`],cover:`/images/blog/ai-consumer-apps.webp`,ogImage:`/images/blog/ai-consumer-apps-og.jpg`,coverTone:`peach`},body:`Every AI feature looks easy in a demo. The hard part is making it fast, affordable and pleasant on a phone, keeping API keys off the device, and getting it through App Store and Google Play review.

Each of these apps uses a different AI pattern, and I picked the backend to suit it.

## At a glance

- **Role:** Developer and publisher
- **Team:** Independent
- **Timeline:** Jun 2023 – Jul 2025
- **Stack:** React Native, OpenAI and other LLM APIs
- **4 AI apps** live on the App Store and Google Play
- **2 platforms** for every app, iOS and Android
- **4 AI modes:** chat, generation, voice and vision

## Sparkle AI: streaming chat (2023)

A ChatGPT-style assistant in React Native, built in the months after the ChatGPT API launched.

- **OpenAI Chat Completions API** with streaming over server-sent events (react-native-sse), so answers appear as they’re written.
- **GPT-3.5 Turbo or GPT-4**, with custom instructions the user can edit.
- **Redux Toolkit** with AsyncStorage for saved chats.
- **Native touches:** voice input with the phone’s speech recognition, code blocks with syntax highlighting, and haptics while answers stream.

I later turned the chat screen into an open-source library, [react-native-sparkle-ai-chat](/blog/add-ai-chat-to-a-react-native-app), so other apps can drop it in.

## MemeFrog: two models, one tap (2025)

An Expo and React Native app that turns a topic into a finished meme.

- **A text model writes the joke** as structured JSON: captions and a prompt for the picture.
- **An image model draws it** in one of many visual styles, and the app adds the captions on top.
- **Moderation** on what the user types and on what the models return, plus a way to report a meme.
- **Sharing** with react-native-view-shot, and EAS Update for over-the-air fixes.

## Tasklio AI: tasks by voice (2025)

Tasklio AI lets people say a task out loud instead of typing it, then turns it into a structured task and helps prioritise the list.

## VisChef: from a fridge photo to dinner (2025)

I built VisChef in about a week for the Bolt.new hackathon.

- **Expo** with Expo Router and Expo Camera.
- **Supabase:** Auth, Postgres with row-level security, and Edge Functions that call the OpenAI API, so no key ships in the app.
- **GPT-4o mini vision** spots the ingredients in a photo, then suggests recipes as structured JSON, shaped by the user’s diet and favourite cuisines.
- **Pexels API** for recipe photos.

VisChef grew out of Recipio, an earlier SwiftUI prototype of the same idea.

## What carried across all four

Use structured JSON whenever the app has to act on what the model says, and always have a fallback. Keep keys on a server unless the user brings their own. Moderate what the model writes as well as what the user types. Stream anything longer than a sentence. All four apps are on the [apps page](/apps), with store links.

## Links

- [See all apps](/apps)`},r={slug:`business-payments-app`,path:`/content/blog/business-payments-app.md`,draft:!1,data:{title:`A business payments app, from an empty repo to store builds in weeks`,description:`I built a multi-currency business payments app in React Native, with hardware-backed biometric sessions and an approvals flow.`,publishedAt:`2026-10-09`,updatedAt:`2026-10-10`,tags:[`case-studies`],cover:`/images/blog/business-payments-app.webp`,ogImage:`/images/blog/business-payments-app-og.jpg`,coverTone:`stripes`},body:`Finance teams needed to see balances across currencies, pay suppliers, convert currencies and approve each other’s payments from their phones. The web portal already did all of this, so the app had to bring the same features to mobile and be just as secure, starting from an empty repo.

In a payments app, security is part of every feature. Moving money needed a fresh check that the right person was holding the phone, and larger payments needed a second person to approve them.

## At a glance

- **Role:** Main mobile engineer
- **Timeline:** Aug – Oct 2026
- **Stack:** React Native, Swift, Kotlin
- **Weeks** from the first commit to TestFlight and Play builds
- **3 native modules**, each in Swift and Kotlin
- **44 reusable components** in the app’s design system

> **Note:** this is client work, so the client and product names are withheld.

## A foundation that matches the web

I set up a React Native app in TypeScript, organised by feature: approvals, payments, wallets, payees and notifications.

- **A typed API layer** built on the backend’s OpenAPI contract, with safe retries so a flaky connection can’t send a payment twice.
- **TanStack Query** for server data, **Zustand** for the session and **MMKV** for fast local storage.
- **Multi-currency amounts** handled exactly and formatted for each currency.
- **A mock API server** built from the same contract, so screens were built and tested while the backend was still in progress.

## Security in native code

I wrote three native modules in Swift and Kotlin:

- **Hardware-backed keys.** Approvals and the stored session are protected by keys held in the phone’s secure hardware (Secure Enclave on iPhone, Android Keystore and StrongBox on Android) and unlocked with Face ID or a fingerprint.
- **Biometric prompts** that work the same way on both platforms and notice when the enrolled biometrics change.
- **Screen protection** that keeps sensitive screens out of screenshots, screen recordings and screen sharing.

Much of this only behaves correctly on real devices, so I tested it on physical iPhones and Android phones across OS versions.

## Payments with a second pair of eyes

- **Sign-in** through the platform’s hosted login in a secure browser tab, so passwords never pass through the app.
- **Step-up checks.** Sensitive actions ask the user to confirm with biometrics or an authenticator code before they go through.
- **Approvals with separation of duties.** The person who raised a payment can’t approve it. Approvers can approve or reject with a reason, makers can withdraw their own payments, and expired requests are shown clearly.
- **Currency conversion** with live quotes and a countdown, so users always know whether a rate is still valid.
- **Payments and payees**, with the same approval rules as the web, purpose-of-payment codes, a quick Search & Pay, and bank-detail validation for several payment rails.
- **Push notifications and links.** Firebase Cloud Messaging and Notifee for notifications, and universal links and App Links that open an approval straight from a notification or email, after the user unlocks the app.

## A design system for the app

I built the app’s design system on the brand’s design tokens, checked against Figma and generated into styles, with CI catching any drift. On top of NativeWind and React Native Reusables it grew from 11 to 44 components, and an accessibility pass made colours and contrast meet WCAG AA.

## Shipping it

Codemagic builds a QA APK, dev TestFlight and Play tracks, and production App Store and Play builds, with checks that stop a production build from pointing at the wrong environment. GitHub Actions run type checks, lint, tests and bundle builds on every pull request, and a Claude Code action reviews each PR for money, auth, data exposure and release risk.

The app went from an empty repo to store builds in weeks, with around 60 test suites. Alongside it I set up the team’s AI workspace: shared agent skills, semantic code search and device automation, so agents could check changes on a real simulator.`},i={slug:`card-issuing-and-digital-wallets`,path:`/content/blog/card-issuing-and-digital-wallets.md`,draft:!1,data:{title:`Virtual cards straight into Apple Pay and Google Pay`,description:`For an Australian embedded-finance platform, I integrated push provisioning into Apple Pay and Google Pay, Apple Wallet’s own “add card” extensions and a native secure card view, so users can pay with a new card seconds after receiving it.`,publishedAt:`2026-10-01`,updatedAt:`2026-10-10`,tags:[`case-studies`],cover:`/images/blog/card-issuing-and-digital-wallets.webp`,ogImage:`/images/blog/card-issuing-and-digital-wallets-og.jpg`,coverTone:`ink`},body:`The platform lets businesses issue branded prepaid Mastercards. Its consumer app lets people receive money as a gift and load it onto a virtual card. Users wanted that card in their phone wallet straight away, without typing a card number, and they needed to see the card details safely when shopping online.

My job was the integration work between the app, the card-tokenisation provider, Apple Pay, Google Pay and the platform’s own APIs.

## At a glance

- **Role:** Mobile engineer
- **Timeline:** Jul 2024 – Oct 2026
- **Stack:** React Native, Swift, Kotlin, Apple Pay, Google Pay
- **2 wallets:** Apple Pay and Google Pay push provisioning, plus Apple Watch
- **2+ years** building and shipping the app with the client's team
- **1 tap** to add a new card to Apple Pay or Google Pay

> **Note:** this is client work, so the client and product names are withheld.

## Cards straight into Apple Pay and Google Pay

I integrated a certified card-tokenisation SDK for in-app push provisioning, so the app never handles the full card number.

- **One tap to add.** On iOS, the app opens Apple’s Add to Apple Pay sheet. On Android, it uses Google Pay’s push provisioning flow.
- **Knowing where the card already is.** The app checks whether a card is already on the iPhone, on a paired Apple Watch or in Google Pay, and offers to add it to the devices that are missing it.
- **Handling every outcome.** Cancelled sheets, failed attempts and cards waiting for verification all return the user to a clear state.

## Adding the card from inside Apple Wallet

I built Apple Wallet Issuer extensions, so a user can tap “+” in Wallet and add the card without opening the app.

- A **non-UI extension** in Swift lists the cards that aren’t in Wallet yet, with their card art.
- A **UI extension** handles sign-in when Wallet needs the user to confirm who they are.
- Both can be switched off remotely, and the app and both extensions are signed and shipped together from CI.

## Card details shown natively

To show the card number and security code for online shopping, I integrated the provider’s secure card view through a native Swift screen bridged into React Native, so sensitive card data stays inside native code.

## Sign-in, config and app health

- **Biometric sign-in** with Face ID, Touch ID and fingerprint, plus a guided prompt to move existing users onto it.
- **Remote config and feature flags**, so the team could turn features on and off and prompt users to update without a new release.
- **Monitoring with Datadog**: real-user monitoring, crash reporting and screen tracking.
- **Analytics with Segment**, sending events to the product and marketing tools.
- **Deep links with Branch.**

## Shipping it

Codemagic builds dev and production apps for both stores, with dev builds pointing the tokenisation SDK at its sandbox so testers never touch live cards. iOS builds go to TestFlight automatically, and Android builds publish to Google Play. I also kept the app passing store review as Apple and Google requirements changed, including privacy manifests for third-party SDKs and support for newer Android devices.`},a={slug:`ccbar-claude-code-usage-status-line`,path:`/content/blog/ccbar-claude-code-usage-status-line.md`,draft:!1,data:{title:`ccbar: see your Claude Code limits without leaving the prompt`,description:`A status line that shows context use and your 5-hour and 7-day limits as bars that turn from green to red.`,publishedAt:`2026-07-22`,updatedAt:`2026-10-10`,tags:[`dev-tools`,`open-source`],cover:`/images/blog/ccbar-claude-code-usage-status-line.webp`,ogImage:`/images/blog/ccbar-claude-code-usage-status-line-og.jpg`,coverTone:`stripes`},body:`Have you ever been deep in a Claude Code session and wondered how much usage you actually have left? Normally you stop, open the Claude website and check. Otherwise you keep spending context and limits without knowing how close you are to the edge. So I built ccbar.

## What it shows

- Model and effort level.
- Current workspace.
- Context-window usage.
- 5-hour and 7-day limits, with the time left until each resets.

The bars change from green to yellow to red, so you can read your remaining headroom at a glance. When your current pace would use up a limit before it resets, ccbar adds a warning with the estimated time. Styles and themes let it match your terminal.

## Install

\`\`\`sh
npx ccbar-cli
\`\`\`

## How it works

Claude Code can run any command as a status line and pipe it a JSON object on every refresh. That JSON already includes the model, effort level, working directory, context-window percentage, cost, and both rate limits with their \`used_percentage\` and \`resets_at\` time. ccbar is a single Bash script that reads those fields with \`jq\` and draws two lines of coloured bars.

\`\`\`json title="~/.claude/settings.json"
{
  "statusLine": {
    "type": "command",
    "command": "~/.local/bin/ccbar render",
    "padding": 0
  }
}
\`\`\`

- **No network calls and no tokens.** Everything comes from the data Claude Code already passes in, so it’s instant and works offline.
- **Burn-rate warning.** From how much of a window you’ve used and how long is left until it resets, ccbar estimates whether your current pace runs out first, and when.
- **Local history.** It caches the last payload for \`ccbar stats\` and appends a small, throttled history file (at most once a minute, size-capped), so \`ccbar history\` can draw a 7-day sparkline with estimated cost.
- **One dependency.** Bash and \`jq\`. A small Node wrapper exists only so \`npx\` can install it.

The installer wires ccbar into your Claude Code settings, backing up the file first, and runs a short setup wizard. It is also available as a Claude Code plugin. The code is on [GitHub](https://github.com/lakpriya1s/ccbar).`},o={slug:`fraud-detection-llm-on-device`,path:`/content/blog/fraud-detection-llm-on-device.md`,draft:!1,data:{title:`Running a fraud-detection LLM entirely on the phone`,description:`How fine-tuned, quantised LLMs under 1B parameters reached 99.5% accuracy on mobile, offline. My RANLP 2025 paper in plain English.`,publishedAt:`2025-07-14`,updatedAt:`2026-10-10`,tags:[`on-device-ai`,`ai`,`react-native`],cover:`/images/blog/fraud-detection-llm-on-device.webp`,ogImage:`/images/blog/fraud-detection-llm-on-device-og.jpg`,coverTone:`ink`},body:`My MSc research project was accepted for presentation at RANLP 2025: *Efficient Financial Fraud Detection on Mobile Devices Using Lightweight Large Language Models*. It tackles a simple question. Can a phone run an LLM good enough to catch scam messages, without sending anything to the cloud?

## The problem

Digital transactions grow every day, and so do fraudulent SMS and emails. Traditional detection models are often cloud-dependent, which brings problems with efficiency, scale and especially privacy. Large language models understand language well, but they are usually too heavy for a phone.

## The approach

- Fine-tune compact LLMs, under 1B parameters, for one task: spotting fraud in unstructured text.
- Use LoRA and QLoRA so fine-tuning fits modest hardware.
- Convert to ONNX with Hugging Face Optimum, then quantise to INT8 and 4-bit.
- Run the models with ONNX Runtime inside a React Native app, fully offline.

## Making it run on a phone

Getting a trained model onto a phone took more work than training it.

- **Download only what’s needed.** The app reads a model list from GitHub and lets you pick a model and a quantisation level. It then fetches just the config, the tokenizer and that one \`.onnx\` file from Hugging Face, with resumable downloads and per-file progress.
- **Tokenising on Hermes.** The JavaScript tokenizer expected a browser, so I patched it to load only local files, rewrote Unicode regexes that Hermes doesn’t support, and added \`TextEncoder\` and \`Buffer\` polyfills.
- **Answer in a few tokens.** The model only needs to say “Yes” or “No”, so generation stops after five tokens, using greedy decoding with a KV cache in ONNX Runtime. The app shows how long each check took.

## The results

The fine-tuned, quantised Llama-160M-Chat-v1 reached **99.47%** accuracy with a **168 MB** footprint. The fine-tuned, quantised Qwen1.5-0.5B-Chat reached **99.50%** at 797 MB. Optimised LLMs can deliver accurate, real-time fraud detection on a phone without compromising privacy.

> Let’s make AI safer and smarter, right in our pockets.

The app, FraudShield, is live on the [App Store](https://apps.apple.com/app/id6745196395) and [Google Play](https://play.google.com/store/apps/details?id=lakpriya.fraudShield), and the paper is in the [ACL Anthology](https://aclanthology.org/2025.ranlp-1.126/). Thanks to my supervisor, Deshan Sumanathilaka, for his guidance from the first idea to deployment.`},s={slug:`hushreply-free-comment-to-dm`,path:`/content/blog/hushreply-free-comment-to-dm.md`,draft:!1,data:{title:`HushReply: free comment-to-DM for Instagram and Facebook`,description:`The one ManyChat feature most creators use, as a self-hosted Cloudflare Worker with no contact limits and no monthly fee.`,publishedAt:`2026-10-05`,updatedAt:`2026-10-10`,tags:[`open-source`,`dev-tools`],cover:`/images/blog/hushreply-free-comment-to-dm.webp`,ogImage:`/images/blog/hushreply-free-comment-to-dm-og.jpg`,coverTone:`peach`},body:`On Facebook and Instagram you post “Comment GUIDE and I’ll send it to you.” Someone comments GUIDE, and within a second they get a DM with the link, plus an optional “Check your DMs 📬” reply under their comment.

That is the one ManyChat feature most creators and businesses actually use. But ManyChat’s free plan now stops at 25 contacts, and one viral post can push you into a paid tier. HushReply does that one job, for free.

## What it does

- **Instagram and Facebook Pages** from one deployment.
- **Keyword rules** that ignore the word inside other words and handle emoji, so \`LINK🙏\` matches but \`linked\` doesn’t.
- **Public replies with rotating variations**, so it never looks copy-pasted.
- **Multiple accounts**, each with its own keywords.
- **A simple dashboard**: no code, and you can test a comment before it goes live.
- **Honest replies**: if the DM fails, the “check your DMs” reply is held back.

## How it’s built

It runs as one small Worker in your own Cloudflare account, on the free plan, which covers about 500 keyword replies a day at $0. It uses Meta’s official private-replies API: no scraping, no browser automation and no password sharing. There is a one-click “Deploy to Cloudflare” button, and no Meta App Review is needed when you use it on your own accounts.

## Under the hood

Each comment follows the same path through the Worker: webhook in, signature check, parse, find the account, find the rule, claim the comment, check the cooldown, send the DM, then post the public reply.

- **Answer Meta first, work second.** Meta retries any webhook that responds slowly, so the Worker returns \`200\` immediately and does the Graph API calls in \`ctx.waitUntil\`.
- **Never DM twice.** Every comment id is claimed in Workers KV before anything is sent, so a redelivered webhook is ignored. A self-comment guard checks against every configured account, so two of your accounts can never get stuck replying to each other.
- **Signatures checked properly.** HMAC-SHA256 against each app secret, because Instagram Login uses a different secret from the Facebook app.
- **Emoji-aware matching.** JavaScript’s \`\\b\` only understands ASCII, so the \`word\` match mode uses a hand-written Unicode word boundary. Other modes are contains, exact, starts-with, regex and any comment.
- **Stable replies.** The public reply variation is picked from the comment id, so a retried webhook posts the same text.
- **Tokens that don’t expire.** A daily cron refreshes Instagram’s long-lived tokens before their 60-day expiry.
- **Secrets stay out of \`ps\`.** The local dashboard only listens on 127.0.0.1 and passes tokens to \`wrangler\` through stdin or a \`chmod 600\` temp file, never as command-line arguments.

It ships with \`DRY_RUN\` on, and 82 unit tests run on Node’s built-in test runner.

> **To be honest about it:** it is not a full ManyChat replacement. There is no flow builder and no broadcasts, and setup takes about an hour, mostly in Meta’s developer settings. But if all you need is “comment a keyword, get the DM”, you shouldn’t be paying monthly for it.

HushReply is open source under AGPL-3.0. Try it from the [website](https://lakpriya1s.github.io/hushreply/) or read the code on [GitHub](https://github.com/lakpriya1s/hushreply).`},c={slug:`looktap-benchmark-ai-agents-mobile-apps`,path:`/content/blog/looktap-benchmark-ai-agents-mobile-apps.md`,draft:!1,data:{title:`LookTap: I benchmarked 9 tools that let AI agents use a phone`,description:`The same 12 steps on an iPhone simulator and an Android emulator, 10 runs each, checked by a neutral oracle. What an agent actually feels is calls, bytes and setup.`,publishedAt:`2026-10-18`,tags:[`dev-tools`,`ai`,`open-source`],cover:`/images/blog/looktap-benchmark-ai-agents-mobile-apps.webp`,ogImage:`/images/blog/looktap-benchmark-ai-agents-mobile-apps-og.jpg`,coverTone:`ink`},body:`Coding agents can write a mobile screen in minutes, but most of them can't look at it. They build the app, say it works, and you find out on the phone that the button is hidden behind the keyboard. I built [LookTap](https://lakpriya.com/looktap/) so the agent can check for itself: it reads the screen as text, taps by label, types, swipes and reads the logs and crash reports, on iPhone and Android.

There are already several tools for this: Appium, Maestro, mobile-mcp, ios-simulator-mcp and others. So before telling anyone to use mine, I measured it against all of them.

## What I measured

Every tool did the same 12 steps in the system Settings app: launch the app, read the screen, tap by label, go back, tap a point, swipe, scroll to a label, fill a field, take a screenshot, go home, open a URL and stop the app. Each tool ran the scenario 10 times on an iPhone 14 simulator (iOS 26) and a Pixel 9a emulator (Android 16), on one M3 Pro Mac.

Two choices made the numbers mean something:

- **A neutral checker decided whether each step worked, not the tool.** On iOS that was \`idb ui describe-all\`; on Android, \`dumpsys\`. That mattered more than I expected: some tools reported success when nothing had happened.
- **Tools were driven the way an agent drives them.** MCP servers ran over stdio with \`tools/call\`, CLIs ran once per step, and when a tool couldn't act on a label, the step read the screen first and that read counted as a call.

Raw speed isn't what an agent feels most. Each tool call is another round trip through the model, which takes seconds, not milliseconds. So alongside the time until the result was on screen, I report **agent time**: that time plus 2 seconds for every call. I also count the bytes of text each tool returns, because every byte lands in the agent's context window.

## The results

On iOS, over the 8 steps every tool can do:

| Tool | Agent time | Calls | Text returned | Setup |
|---|---:|---:|---:|---:|
| **LookTap CLI** | **21 s** | **8** | **747 B** | 0.5 s |
| LookTap MCP | 25 s | 8 | 3.2 KB | 0.5 s |
| Maestro MCP | 30 s | 9 | 17 KB | 18 s |
| Appium MCP | 36 s | 10 | 102 KB | 29 s |
| mobile-mcp | 39 s | 14 | 24 KB | 7.6 s |
| ios-simulator-mcp | 44 s | 20 | 17 KB | 1.5 s |

On Android, over 11 steps, the LookTap CLI took 28 s against 49 s for Appium MCP, 60 s for Maestro MCP and 62 s for mobile-mcp. Reading the screen took 108 ms, against 1.6–5.6 s for the others.

The biggest gap is the text. For the whole iOS scenario the LookTap CLI sent the agent 747 bytes. The MCP servers sent 17–102 KB, and most of them put a 40–270 KB screenshot inline as well. LookTap saves the screenshot to a file and prints its path, so the agent only spends image tokens when it decides to look.

## Where LookTap loses

A benchmark written by the author of one of the tools should say where that tool does worse, so here it is:

- **On raw device time on iOS, ios-simulator-mcp is faster** (4.5 s against 5.2 s), mostly because its fill takes 0.5 s against LookTap's 1.8 s. It needs 20 calls where LookTap needs 8, though, and its swipes sometimes did nothing.
- **On Android, Maestro MCP needs one call fewer** (11 against 12), because it fills a field in a single call.
- **The LookTap MCP server is slower per action than the CLI.** Every action waits for the screen to settle and returns it, which saves a call but costs 0.7–1.9 s. On Android that makes the MCP's total 13 s against the CLI's 4.4 s. That's the clearest thing for me to fix.
- **LookTap 0.2.1, the version I measured, couldn't do two of the steps:** stopping an app, and the Home button on iOS. Both arrived in 0.3.0 (\`looktap stop\` and \`looktap home\`), but they aren't in these numbers.

And the limits of the benchmark itself: I wrote it and every adapter in it, LookTap was developed against this same app, and it covers one system app on a simulator and an emulator, not a real app on a real phone. The adapters are in the repo, and I'd welcome corrections from the other tools' authors.

## Why the output is so small

Most agent mobile tools return the whole accessibility tree as JSON or XML. LookTap's \`ls\` prints one line per element that's actually on screen: a short ref, its type, its position and size, and its label.

\`\`\`
@1   Button           16, 285 358x54  General
@2   Button           16, 339 358x54  Accessibility
@3   TextField        33, 773 324x38  Search  = Search
\`\`\`

The agent taps by label (\`looktap tap General\`) or by ref, and adding \`--ls\` to any action returns the new screen in the same call. If a label matches more than one element, that's an error, never a guess. That's why one step is usually one call.

It's also why there's no server. Each platform gets a small helper that starts on first use and keeps running in the background: on iOS a macOS helper that reads the simulator's accessibility tree through Apple's simulator frameworks, and on Android a 10 KB jar pushed to the device that keeps one UiAutomation connection open. The CLI talks to it over a local socket, and the package has no npm dependencies.

## Try it

\`\`\`sh
npm install -g @looktap/cli
looktap doctor
looktap boot "iPhone 16 Pro"
looktap launch com.apple.Preferences --ls
\`\`\`

In Claude Code, \`looktap skill --install\` teaches the agent how to use it, and there's an MCP server for chat apps that don't have a shell. The [full benchmark](https://github.com/lakpriya1s/looktap/blob/main/BENCHMARK.md), with every step, p90s, memory use and the commands to reproduce it, is in the [repo](https://github.com/lakpriya1s/looktap).`},l={slug:`private-markets-data-platform`,path:`/content/blog/private-markets-data-platform.md`,draft:!1,data:{title:`Data explorers and profiles for a private-markets research platform`,description:`For a subscription B2B platform, I scaffolded the Next.js app and built its data explorers, profile pages, entitlements and AWS delivery.`,publishedAt:`2026-10-09`,updatedAt:`2026-10-10`,tags:[`case-studies`],cover:`/images/blog/private-markets-data-platform.webp`,ogImage:`/images/blog/private-markets-data-platform-og.jpg`,coverTone:`stripes`},body:`Analysts and investors needed to search and compare a very large set of companies, investors, funds and deals, filter them in ways a spreadsheet can’t, and export what they find. The business needed paid plans and free trials to control who sees which columns, and public profile pages that rank in search.

I made the first commit on the Next.js app and have worked on it since, alongside the client’s data and backend teams.

## At a glance

- **Role:** Senior engineer, first commit to today
- **Timeline:** Apr 2025 – Oct 2026
- **Stack:** Next.js, TypeScript, AG Grid, AWS ECS
- **7 server-side data explorers**
- **2 apps:** the customer platform and the internal data app
- **106 columns** in the largest explorer

> **Note:** this is client work, so the client and product names are withheld.

## A Next.js app that renders on the server

- **Next.js App Router** with React Server Components and TypeScript.
- **TanStack Query** for data on the client, with the first rows fetched on the server so explorer pages load instantly.
- **A typed REST API client** shared across the app, with filtering, sorting and CSV export for every list.
- **Caching per audience:** public pages are cached at the CDN, and signed-in pages stay fresh and private.

## Explorers for very large datasets

I built the equity, debt and LP investor explorers, plus deals, companies, events and people, on AG Grid Enterprise.

- **Server-side row model** with TanStack Query caching, so scrolling through very large tables stays fast.
- **Filters** that map straight to the API, including tree filters for industries and deal types.
- **Saved layouts** for column order, width and visibility, kept in Zustand.
- **CSV exports** generated on the server, as a paid feature.

## Profiles, plans and permissions

- **Profile pages** for companies, investors, funds and deals, with cap tables, funding and valuation charts, financials and fund performance on AG Charts.
- **Paid plans and free trials** tied to the billing platform, with hosted checkout and a billing portal.
- **Feature gating** that shows or locks each paid feature the same way on the server and in the browser. Visitors who aren’t signed in see a preview with an upgrade prompt.
- **Hosted sign-in** with smooth session refresh.

## An internal tool for the data team

In 2026 I joined the rebuild of the client’s internal data-operations tool, where staff create and curate the records behind the platform.

- **Next.js** with ky for API calls, zod to validate every response and react-hook-form for forms.
- **Explorers and review flows** for the data team, with tests that keep each column and filter in line with the agreed data model.
- **A reusable create form** driven by a schema, so each new record type is mostly configuration.

## Delivery, monitoring and SEO

The app runs in Docker on AWS ECS Fargate behind CloudFront, built and deployed with CodePipeline and CodeBuild. GitHub Actions run type checks, lint, Jest tests and a build on every pull request. Sentry monitors errors and performance with session replay, and Segment handles analytics. Public profile pages use structured data, canonical URLs and incremental static regeneration so they rank in search.`},u={slug:`sparkle-ai-chatgpt-mobile-app`,path:`/content/blog/sparkle-ai-chatgpt-mobile-app.md`,draft:!1,data:{title:`Sparkle AI: a ChatGPT-style assistant for iOS and Android`,description:`An AI chat app built with React Native on the OpenAI API, with model choice, custom instructions and saved chats.`,publishedAt:`2023-06-19`,updatedAt:`2026-10-10`,tags:[`ai`,`react-native`],cover:`/images/blog/sparkle-ai-chatgpt-mobile-app.webp`,ogImage:`/images/blog/sparkle-ai-chatgpt-mobile-app-og.jpg`,coverTone:`stripes`},body:`I built a ChatGPT-style mobile app with React Native and the OpenAI API. It acts as a personal assistant that helps you stay organised and productive, and it is live on the App Store and Google Play as Sparkle AI.

## What it does

- Choose the model for each conversation, GPT-3.5 Turbo or GPT-4.
- Set custom system messages to shape how the assistant answers.
- Save chats and come back to them later.

## How it’s built

Sparkle AI is a bare React Native app (0.71 at launch) with TypeScript, and it calls the OpenAI Chat Completions API directly: you bring your own API key, so there’s no server in between.

- **Streaming, word by word.** React Native has no built-in server-sent events, so the client streams completions with \`react-native-sse\`. Each delta is appended to the message in Redux as it arrives, a stop button closes the stream, and errors appear in the chat instead of failing silently.
- **Conversations that persist.** Chats are stored in Redux Toolkit with redux-persist on AsyncStorage. Each request rebuilds the conversation from the current chat, with your instructions as the system message, and trims it to the model’s token budget.
- **Feels like a native app.** Code blocks get syntax highlighting and a copy button, a long press copies any message, voice input uses the phone’s own speech recognition, and a light haptic tap scales with the size of each streamed chunk.
- **Smooth long chats.** An inverted list is the usual way to build a chat, but on Android it flips with \`scaleY: -1\`, which is a known source of jank. I patched it to rotate 180° instead.

If you want the same kind of assistant inside your own app, my open-source [React Native chat library](/blog/add-ai-chat-to-a-react-native-app) packages it as a single component.

Download Sparkle AI from the [App Store](https://apps.apple.com/app/id6450364523) or [Google Play](https://play.google.com/store/apps/details?id=lk.codescale.sparkle).`},d={slug:`wheresnow-family-location`,path:`/content/blog/wheresnow-family-location.md`,draft:!1,data:{title:`Family location sharing, installed on more than 200,000 Android phones`,description:`Real-time location sharing for families and teams, with circles, geofenced places, SOS and 60-day history, grown to 200K+ installs.`,publishedAt:`2026-10-01`,updatedAt:`2026-10-10`,tags:[`case-studies`],cover:`/images/blog/wheresnow-family-location.webp`,ogImage:`/images/blog/wheresnow-family-location-og.jpg`,coverTone:`stripes`},body:`Families kept sending “where are you?” texts. The apps that answered that question either drained the battery, felt like surveillance, or both. WheresNow set out to be the consent-first alternative: people join a circle by invite, choose to share, and see each other on one map without the phone running hot.

I’ve built WheresNow since its first commit in 2021, and rebuilt it twice as it grew.

## At a glance

- **Role:** Developer
- **Team:** Independent
- **Timeline:** 2021 – 2026
- **Stack:** Android (Java), React Native, Google Maps SDK, Firebase, AWS
- **200K+ installs** on Google Play
- **60 days** of location history to replay
- **7 languages**, including Sinhala, Tamil and Japanese

## Native Android on Firebase

The first version was a native Android app in Java, on Firebase Authentication and the Firebase Realtime Database. It used the Google Maps SDK, the Places SDK, the fused location provider and geofencing, with Google Play Billing for premium. It shipped in Sinhala and Tamil from the start, and this is the version that grew past 200,000 installs on Google Play.

## React Native for iPhone and Android

To reach iPhone users, I rebuilt the app in React Native, with Codemagic builds set up from the start. React Native handles the screens and the live map, while location tracking lives in native modules written for each platform.

- **App:** React Native, TypeScript, Hermes and Redux Toolkit.
- **Storage:** MMKV, encrypted with a key kept in the Keychain and Keystore.
- **Maps and location:** Google Maps, Core Location, the fused location provider and the Activity Recognition API.

## Location tracking that respects the battery

- **Android:** a foreground service in Kotlin on the fused location provider, with Activity Recognition to detect driving and a Room database that keeps updates offline until the server has them.
- **iOS:** Core Location in Swift, using significant-change and visit monitoring when the app is closed, and a notification service extension so a push can wake tracking up.
- **Fast only when someone is looking:** when a family member opens someone on the map, that phone switches to live updates for a few minutes, then drops back to a battery-friendly mode.
- **Places and alerts:** geofences on both platforms, with arrivals and departures queued and retried when the phone is offline.

## Realtime backend and serverless API

- **Realtime service:** Node.js, Socket.IO and MongoDB with Mongoose, in Docker on AWS EC2. It handles live location, journeys and the driving feed.
- **Serverless API:** TypeScript on AWS Lambda behind API Gateway and AWS WAF, deployed with the Serverless Framework and esbuild.
- **SOS alerts** that are saved in the database and retried until they’re delivered, so a server restart can’t lose one.
- **Subscriptions:** react-native-iap and StoreKit 2, checked on the server with the App Store Server API and Google Play developer notifications, including a Family plan.

## Watches, web and admin

- **Wear OS** app in Kotlin with Jetpack Compose for Wear OS, with its own tracking and SOS.
- **Apple Watch** app in SwiftUI, which shares location through the iPhone or on its own.
- **Admin dashboard** in React, Vite, Leaflet and Recharts for support, subscriptions and usage analytics.
- **Landing site** in Next.js, in seven languages.

## How it ships now

GitHub Actions run each release from dev to staging to production across the mobile apps, the backend and over-the-air updates. Codemagic builds Android and Wear OS, Xcode Cloud builds iOS, and hot-updater ships JavaScript fixes over the air without a store review. Terraform manages the servers, and every pull request runs lint, type checks, tests and security scans with Checkov, hadolint and Gitleaks.

Today WheresNow covers live location, places, SOS, crash detection, scheduled check-ins, a driving feed, family chat with Google Drive and iCloud backup, and location history, in English, French, German, Spanish, Japanese, Sinhala and Tamil.

## Links

- [wheresnow.net](https://wheresnow.net/)
- [Google Play](https://play.google.com/store/apps/details?id=com.axresapps.wheresapplk)
- [App Store](https://apps.apple.com/app/id6749886062)`},f={slug:`apegamen`,path:`/content/apps/apegamen.md`,draft:!1,data:{order:15,name:`ApeGamen`,category:`Farm-to-door marketplace`,platforms:[`iOS`,`Android`],schemaCategory:`ShoppingApplication`,ai:!1,tech:`Marketplace with farmer profiles`,released:`2026`,tone:`sand`,featured:!1,icon:`/images/apps/apegamen-icon.webp`,appStore:`https://apps.apple.com/app/id6760288518`,googlePlay:`https://play.google.com/store/apps/details?id=com.apegamen`},body:`Connects Sri Lankan households directly with verified local farmers for fresh produce.`},p={slug:`burnarc`,path:`/content/apps/burnarc.md`,draft:!1,data:{order:2,name:`BurnArc`,category:`Claude Code usage limits`,platforms:[`macOS`],schemaCategory:`DeveloperApplication`,ai:!1,tech:`Native macOS menu bar app, Claude Code status-line hook`,released:`2026`,tone:`sand`,featured:!1,icon:`/images/apps/burnarc-icon.webp`,download:`https://github.com/lakpriya1s/burnarc/releases/latest/download/BurnArc.dmg`,website:`https://lakpriya1s.github.io/burnarc/`},body:`Shows your Claude Code 5-hour and weekly limits live in the Mac menu bar, with run-out projections, pace markers and alerts. No account and no server; iPhone, Apple Watch and widgets are coming soon.`},m={slug:`fraudshield`,path:`/content/apps/fraudshield.md`,draft:!1,data:{order:12,name:`FraudShield`,category:`Fraud detection (MSc research)`,platforms:[`iOS`,`Android`],schemaCategory:`SecurityApplication`,ai:!0,tech:`Quantised LLMs on ONNX Runtime, React Native`,released:`2025`,tone:`sand`,featured:!1,icon:`/images/apps/fraudshield-icon.webp`,appStore:`https://apps.apple.com/app/id6745196395`,googlePlay:`https://play.google.com/store/apps/details?id=lakpriya.fraudShield`,caseStudy:`fraud-detection-llm-on-device`},body:`Flags fraudulent SMS and email with a fine-tuned LLM that runs entirely on the phone, so messages never leave the device.`},h={slug:`memefrog`,path:`/content/apps/memefrog.md`,draft:!1,data:{order:10,name:`MemeFrog`,category:`AI meme generator`,platforms:[`iOS`,`Android`],schemaCategory:`MultimediaApplication`,ai:!0,tech:`Expo, React Native, OpenAI`,released:`2025`,tone:`ink`,featured:!0,icon:`/images/apps/memefrog-icon.webp`,art:`/images/apps/memefrog-art.webp`,appStore:`https://apps.apple.com/app/id6743625798`,googlePlay:`https://play.google.com/store/apps/details?id=lk.codescale.ai_meme`,caseStudy:`ai-consumer-apps`},body:`Type a prompt, or tap “I’m Feeling Lucky”, and get a shareable meme in seconds.`},g={slug:`sparkle-ai`,path:`/content/apps/sparkle-ai.md`,draft:!1,data:{order:14,name:`Sparkle AI`,category:`AI chat assistant`,platforms:[`iOS`,`Android`],schemaCategory:`UtilitiesApplication`,ai:!0,tech:`OpenAI GPT models, React Native`,released:`2023`,tone:`sand`,featured:!1,icon:`/images/apps/sparkle-ai-icon.webp`,art:`/images/apps/sparkle-ai-art.webp`,appStore:`https://apps.apple.com/app/id6450364523`,googlePlay:`https://play.google.com/store/apps/details?id=lk.codescale.sparkle`,caseStudy:`ai-consumer-apps`},body:`A chat assistant where you choose the model, with custom instructions and saved chats.`},_={slug:`tasklio-ai`,path:`/content/apps/tasklio-ai.md`,draft:!1,data:{order:11,name:`Tasklio AI`,category:`AI task assistant`,platforms:[`iOS`,`Android`],schemaCategory:`ProductivityApplication`,ai:!0,tech:`Voice input, AI prioritisation`,released:`2025`,tone:`sand`,featured:!1,icon:`/images/apps/tasklio-ai-icon.webp`,art:`/images/apps/tasklio-ai-art.webp`,appStore:`https://apps.apple.com/app/id6745604373`,googlePlay:`https://play.google.com/store/apps/details?id=lk.codescale.tasklio`,caseStudy:`ai-consumer-apps`},body:`Add tasks by voice and let AI help you prioritise work, study and errands.`},v={slug:`vischef`,path:`/content/apps/vischef.md`,draft:!1,data:{order:9,name:`VisChef AI`,category:`AI kitchen companion`,platforms:[`iOS`,`Android`],schemaCategory:`LifestyleApplication`,ai:!0,tech:`Photo ingredient detection, AI recipe generation`,released:`2025`,tone:`peach`,featured:!0,icon:`/images/apps/vischef-icon.webp`,art:`/images/apps/vischef-art.webp`,appStore:`https://apps.apple.com/app/id6747966713`,googlePlay:`https://play.google.com/store/apps/details?id=lk.codescale.vischef`,caseStudy:`ai-consumer-apps`},body:`Snap your fridge or pantry and get recipes from what you already have, with dietary filters, nutrition info and a shopping list.`},y={slug:`wheresnow`,path:`/content/apps/wheresnow.md`,draft:!1,data:{order:3,name:`WheresNow`,category:`Family location sharing`,platforms:[`iOS`,`Android`],schemaCategory:`LifestyleApplication`,ai:!1,tech:`Native Android, React Native, Google Maps SDK`,released:`2021`,installs:`200K+`,tone:`sand`,featured:!0,icon:`/images/apps/wheresnow-icon.webp`,art:`/images/apps/wheresnow-art.webp`,appStore:`https://apps.apple.com/app/id6749886062`,googlePlay:`https://play.google.com/store/apps/details?id=com.axresapps.wheresapplk`,website:`https://wheresnow.net/`,caseStudy:`wheresnow-family-location`},body:`Live location for families and teams: private circles, geofenced places, SOS alerts and 60-day history.`},b={slug:`agent-rack`,path:`/content/open-source/agent-rack.md`,draft:!1,data:{order:5,name:`Agent Rack`,kind:`MCP server`,year:2026,language:`TypeScript`,repo:`https://github.com/lakpriya1s/agent-rack`,icon:`/images/open-source/agent-rack-icon.webp`,npm:`https://www.npmjs.com/package/agent-rack`,stat:`8K+ npm downloads in the past year`,post:`agent-rack-one-mcp-interface-for-ai-coding-agents`,featured:!1},body:`An MCP server that runs CLI coding agents (Claude Code, Codex, opencode, Antigravity) as sub-agents, with background sessions, a terminal dashboard and structured code review.`},x={slug:`ccbar`,path:`/content/open-source/ccbar.md`,draft:!1,data:{order:6,name:`ccbar`,kind:`Status line`,year:2026,language:`Shell`,repo:`https://github.com/lakpriya1s/ccbar`,icon:`/images/open-source/ccbar-icon.webp`,post:`ccbar-claude-code-usage-status-line`,featured:!1},body:`A status line for Claude Code that shows the model, context use and 5-hour and 7-day limits as colour-coded bars.`},S={slug:`devrig`,path:`/content/open-source/devrig.md`,draft:!1,data:{order:7,name:`devrig`,kind:`Workspace template`,year:2026,language:`Shell`,repo:`https://github.com/lakpriya1s/devrig`,icon:`/images/open-source/devrig-icon.webp`,npm:`https://www.npmjs.com/package/create-devrig`,featured:!1},body:`A multi-repo AI dev workspace template with Claude Code skills, semantic code search and issue-tracker MCP, set up with npx create-devrig.`},C={slug:`fraudshield-research`,path:`/content/open-source/fraudshield-research.md`,draft:!1,data:{order:13,name:`FraudShield research code`,kind:`Research code`,year:2025,language:`TypeScript, Python`,repo:`https://github.com/lakpriya1s/finanicial-fraud-detection-LLM-mobile-app`,icon:`/images/apps/fraudshield-icon.webp`,featured:!1},body:`Training, fine-tuning and app code behind the RANLP 2025 paper on on-device fraud detection with lightweight LLMs.`},w={slug:`hushreply`,path:`/content/open-source/hushreply.md`,draft:!1,data:{order:4,name:`HushReply`,kind:`Self-hosted bot`,year:2026,language:`TypeScript`,repo:`https://github.com/lakpriya1s/hushreply`,icon:`/images/open-source/hushreply-icon.webp`,website:`https://lakpriya1s.github.io/hushreply/`,post:`hushreply-free-comment-to-dm`,featured:!1},body:`A free, self-hosted comment-to-DM bot for Instagram and Facebook that runs on Cloudflare Workers’ free plan.`},T={slug:`looktap`,path:`/content/open-source/looktap.md`,draft:!1,data:{order:1,name:`LookTap`,kind:`CLI`,year:2026,language:`JavaScript`,repo:`https://github.com/lakpriya1s/looktap`,icon:`/images/open-source/looktap-icon.webp`,npm:`https://www.npmjs.com/package/@looktap/cli`,website:`https://lakpriya.com/looktap/`,stat:`Lowest agent time of 9 mobile tools on iPhone and Android`,post:`looktap-benchmark-ai-agents-mobile-apps`,featured:!0,art:`/images/open-source/looktap-art.webp`},body:`A command-line tool that lets AI coding agents see and use the iPhone and Android app they're building: it reads the screen as a few lines of text, taps by label, types, swipes and reads logs and crashes, with no server and zero dependencies.`},E={slug:`react-native-sparkle-ai-chat`,path:`/content/open-source/react-native-sparkle-ai-chat.md`,draft:!1,data:{order:8,name:`Sparkle AI Chat`,kind:`React Native library`,year:2024,language:`TypeScript`,repo:`https://github.com/lakpriya1s/react-native-sparkle-ai-chat`,icon:`/images/apps/sparkle-ai-icon.webp`,npm:`https://www.npmjs.com/package/react-native-sparkle-ai-chat`,post:`add-ai-chat-to-a-react-native-app`,featured:!1},body:`A drop-in, brandable AI chat screen for React Native apps, powered by the OpenAI API.`},D={slug:`fraud-detection-on-mobile-ranlp-2025`,path:`/content/papers/fraud-detection-on-mobile-ranlp-2025.md`,draft:!1,data:{title:`Efficient Financial Fraud Detection on Mobile Devices Using Lightweight Large Language Models`,year:2025,detail:`RANLP 2025 · pp. 1090–1098`,url:`https://aclanthology.org/2025.ranlp-1.126/`,pdf:`https://aclanthology.org/2025.ranlp-1.126.pdf`,bibtex:`@inproceedings{senevirathna-sumanathilaka-2025-efficient,
  title     = "Efficient Financial Fraud Detection on Mobile Devices Using Lightweight Large Language Models",
  author    = "Senevirathna, Lakpriya and Sumanathilaka, Deshan",
  booktitle = "Proceedings of the 15th International Conference on Recent Advances in Natural Language Processing - Natural Language Processing in the Generative AI Era",
  month     = sep,
  year      = "2025",
  address   = "Varna, Bulgaria",
  publisher = "INCOMA Ltd., Shoumen, Bulgaria",
  url       = "https://aclanthology.org/2025.ranlp-1.126/",
  pages     = "1090--1098"
}`,coauthors:[`Deshan Sumanathilaka`],published:`2025-09`,proceedings:`Proceedings of the 15th International Conference on Recent Advances in Natural Language Processing (RANLP 2025)`,pages:`1090-1098`,featured:!0,label:`Featured · Paper · RANLP 2025`,shortTitle:`Efficient fraud detection on mobile devices with lightweight LLMs`,image:`/images/blog/fraud-detection-llm-on-device.webp`},body:`Compact LLMs, fine-tuned with LoRA and quantised for ONNX Runtime, detect fraud in SMS and email on the phone itself. A 168 MB model reached 99.47% accuracy and a 0.5B model 99.50%, with no data leaving the device.`},O={slug:`ally-wang`,path:`/content/testimonials/ally-wang.md`,draft:!1,data:{order:4,name:`Ally Wang`,role:`Product Owner, Portfolio Manager, Digital`},body:`Lakpriya is a good team player. Really enjoyed working with him!`},k={slug:`chathurika-ralapanawa`,path:`/content/testimonials/chathurika-ralapanawa.md`,draft:!1,data:{order:6,name:`Chathurika Ralapanawa`,role:`Technical Lead`},body:`He is proactive with a lots of initiatives and independent in work. Most of the times he got so many ideas to make our apps better.`},A={slug:`frank-van-leeuwen`,path:`/content/testimonials/frank-van-leeuwen.md`,draft:!1,data:{order:2,name:`Frank van Leeuwen`,role:`AI Engineer, Lead Software Engineer, Solution Architect`},body:`Lakpriya played a crucial role in identifying and fixing these problems, ensuring our app’s functionality was restored and improved.`},j={slug:`justin-latimore`,path:`/content/testimonials/justin-latimore.md`,draft:!1,data:{order:3,name:`Justin Latimore`,role:`Senior Software Engineer, ex-Microsoft`},body:`Amazing developer with a great understanding of customer requirements and bug resolution.`},M={slug:`martin-dahms`,path:`/content/testimonials/martin-dahms.md`,draft:!1,data:{order:1,name:`Martin Dahms`,role:`Founder, Product Designer, Brandmaker`},body:`Lakpriya is one of the most capable developers I have ever worked with. His ability to work smart, hard, and fast consistently results in perfect, timely deliverables.`},N={slug:`shehan-amarakoon`,path:`/content/testimonials/shehan-amarakoon.md`,draft:!1,data:{order:5,name:`Shehan Amarakoon`,role:`Software Engineer @Konecranes`},body:`If you need a React Native expert who seamlessly bridges the gap between iOS and Android development, I highly recommend Lakpriya Senevirathna.`},P=e=>Object.values(e),F=P(Object.assign({"/content/blog/add-ai-chat-to-a-react-native-app.md":e,"/content/blog/agent-rack-one-mcp-interface-for-ai-coding-agents.md":t,"/content/blog/ai-consumer-apps.md":n,"/content/blog/business-payments-app.md":r,"/content/blog/card-issuing-and-digital-wallets.md":i,"/content/blog/ccbar-claude-code-usage-status-line.md":a,"/content/blog/fraud-detection-llm-on-device.md":o,"/content/blog/hushreply-free-comment-to-dm.md":s,"/content/blog/looktap-benchmark-ai-agents-mobile-apps.md":c,"/content/blog/private-markets-data-platform.md":l,"/content/blog/sparkle-ai-chatgpt-mobile-app.md":u,"/content/blog/wheresnow-family-location.md":d})),I=P(Object.assign({"/content/apps/apegamen.md":f,"/content/apps/burnarc.md":p,"/content/apps/fraudshield.md":m,"/content/apps/memefrog.md":h,"/content/apps/sparkle-ai.md":g,"/content/apps/tasklio-ai.md":_,"/content/apps/vischef.md":v,"/content/apps/wheresnow.md":y})),L=P(Object.assign({"/content/open-source/agent-rack.md":b,"/content/open-source/ccbar.md":x,"/content/open-source/devrig.md":S,"/content/open-source/fraudshield-research.md":C,"/content/open-source/hushreply.md":w,"/content/open-source/looktap.md":T,"/content/open-source/react-native-sparkle-ai-chat.md":E})),R=P(Object.assign({"/content/papers/fraud-detection-on-mobile-ranlp-2025.md":D})),z=P(Object.assign({"/content/testimonials/ally-wang.md":O,"/content/testimonials/chathurika-ralapanawa.md":k,"/content/testimonials/frank-van-leeuwen.md":A,"/content/testimonials/justin-latimore.md":j,"/content/testimonials/martin-dahms.md":M,"/content/testimonials/shehan-amarakoon.md":N}));function B(e){return e.toLowerCase().replace(/[’']/g,``).replace(/[^a-z0-9]+/g,`-`).replace(/^-|-$/g,``)}function V(e,{drafts:t=!1}={}){return e.filter(e=>t||!e.draft)}var H=/^(```|##\s|>|[-*]\s|!\[)/;function U(e,t=`markdown`){let n=e.replace(/\r\n/g,`
`).split(`
`),r=[],i=0;for(;i<n.length;){let e=n[i];if(!e.trim()){i++;continue}let a=/^```([\w+-]*)\s*(.*)$/.exec(e);if(a){let e=[];for(i++;i<n.length&&!/^```\s*$/.test(n[i]);)e.push(n[i++]);if(i>=n.length)throw Error(`${t}: a code block is missing its closing \`\`\``);i++;let o=/title="([^"]+)"/.exec(a[2])?.[1];r.push({type:`code`,lang:a[1]||`text`,...o?{filename:o}:{},code:e.join(`
`)});continue}let o=/^##\s+(.+?)(?:\s+\{#([\w-]+)\})?\s*$/.exec(e);if(o){r.push({type:`h2`,id:o[2]??B(o[1]),text:o[1]}),i++;continue}if(e.startsWith(`>`)){let e=[];for(;i<n.length&&n[i].startsWith(`>`);)e.push(n[i++].replace(/^>\s?/,``).trim());let t=e.filter(Boolean).join(` `),a=/^\*\*(.+?):\*\*\s*([\s\S]*)$/.exec(t);r.push(a?{type:`callout`,label:a[1],text:a[2]}:{type:`quote`,text:t});continue}if(/^[-*]\s+/.test(e)){let e=[];for(;i<n.length&&n[i].trim();){let t=/^[-*]\s+(.*)$/.exec(n[i]);t?e.push(t[1]):e[e.length-1]+=` ${n[i].trim()}`,i++}r.push({type:`list`,items:e});continue}let s=/^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)\s*$/.exec(e);if(s){r.push({type:`figure`,alt:s[1],src:s[2],...s[3]?{caption:s[3]}:{}}),i++;continue}let c=[e.trim()];for(i++;i<n.length&&n[i].trim()&&!H.test(n[i]);)c.push(n[i++].trim());r.push({type:`p`,text:c.join(` `)})}return r}export{L as a,F as i,V as n,R as o,I as r,z as s,U as t};