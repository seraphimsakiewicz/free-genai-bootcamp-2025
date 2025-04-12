This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Check out this project over at https://mud-ai.vercel.app/ ! It's deployed!!

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment
documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Technical Difficulties

The most annoying thing that I probably shouldn't have wasted so much time on was learning on how to
handle encryption at rest and on transport. It was a cool thing to learn, and in the end I had to
settle for decryption only

Next, managing the AI and getting it to navigate to each node in the game was tedious, but I decided
to simplify the game a lot to make it easy for now to build this game.

Handling safeguards, when showing this game to my Spanish teacher, he immediately thought of the
worst things to say to the AI, and I wasn't handling it properly at all. After that, I added safe
gaurds, and now the game should stop if you write anything vulgar, offensive, etc.

## Future features

Adding difficulties, so perhaps on hard, you have to write almost fully correct grammatical
sentences with accents correct too. On medium, it could be less strict, but you shouldnt be able to
provide one word answers. Easy, would probably be what it is right now, it's not entirely strict on
the input, as long as it can infer what you want it'll take you to the next node.

## Future fixes

Make the game a bit more clearer when going back. At the moment, it can get a bit confusing when you
want to go back.
