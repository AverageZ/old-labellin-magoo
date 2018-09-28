# old-labellin-magoo

> A GitHub App built with [Probot](https://github.com/probot/probot) that automates tickets through ZenHub pipelines

## But, what do you do Old Labellin' Magoo?
1. When a GitHub issue is labeled it is moved to the ZenHub pipeline matching the label name (case insensitive)
2. More to come...

## Setup

```sh
# Install dependencies
npm install

# Run typescript
npm run build

# Run the bot
ZH_TOKEN=your-zenhub-token-here npm start
```

## Contributing

If you have suggestions for how old-labellin-magoo could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2018 AverageZ <alexzajac@live.com>
