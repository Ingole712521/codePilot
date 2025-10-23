# 🤖 CodePilot AI

An AI-powered coding assistant that can communicate via WhatsApp and Slack, analyze GitHub repositories, find code issues, and provide automated fixes in a sandbox environment.

## Features

- **💬 Chat Integration**: Interact with the AI agent through WhatsApp by mentioning @codepilot or @ai
- **🔍 Code Analysis**: Share a GitHub repository link and get instant analysis of code issues
- **🛠️ Auto Fixes**: Get suggested fixes and see them in a sandbox environment
- **📱 Multi-Platform**: Support for WhatsApp and Slack (Slack coming soon)
- **🌐 Web Interface**: Beautiful web interface for managing sandbox sessions

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codepilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   GITHUB_TOKEN=your_github_token_here  # Optional, for private repos
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # Start both the web app and AI agent
   npm run dev:full
   
   # Or start them separately:
   npm run dev          # Web app only
   npm run ai-agent     # AI agent only
   ```

5. **Connect WhatsApp**
   - Open your browser to `http://localhost:3000`
   - Check the console for a QR code
   - Scan the QR code with your WhatsApp to connect the bot

## Usage

### Via WhatsApp

1. **Connect your WhatsApp** by scanning the QR code displayed in the console
2. **Mention the bot** by typing `@codepilot` or `@ai` in any WhatsApp chat
3. **Share a repository** by sending a GitHub repository URL
4. **Get analysis** - the bot will analyze the code and report issues
5. **Request fixes** - ask the bot to generate fixes for the issues found

### Via Web Interface

1. **Open the sandbox** at `http://localhost:3000/sandbox`
2. **Create a new sandbox** by entering a GitHub repository URL
3. **View analysis results** and generated fixes
4. **Run code** in the sandbox environment

## API Endpoints

- `GET /api/bot/status` - Get bot status
- `POST /api/bot/analyze` - Analyze a repository
- `POST /api/sandbox/create` - Create a new sandbox session
- `GET /api/sandbox/[sessionId]` - Get sandbox session details
- `POST /api/sandbox/[sessionId]` - Generate fixes for a session

## Project Structure

```
codepilot/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── sandbox/           # Sandbox interface
│   └── page.tsx           # Main page
├── lib/                   # Core libraries
│   ├── services/          # Service classes
│   │   ├── AIAgent.ts     # Main AI agent orchestrator
│   │   ├── WhatsAppBot.ts # WhatsApp bot service
│   │   ├── CodeAnalyzer.ts # Code analysis service
│   │   └── OpenAIService.ts # OpenAI integration
│   └── config.ts          # Configuration
├── scripts/               # Utility scripts
└── package.json
```

## Configuration

The application can be configured through environment variables:

- `OPENAI_API_KEY` (required): Your OpenAI API key
- `GITHUB_TOKEN` (optional): GitHub token for private repositories
- `PORT` (optional): Server port (default: 3000)
- `NODE_ENV` (optional): Environment (development/production)

## Development

### Running in Development Mode

```bash
# Start both web app and AI agent
npm run dev:full

# Start only web app
npm run dev

# Start only AI agent
npm run ai-agent
```

### Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### WhatsApp Bot Not Connecting

1. Make sure you have a stable internet connection
2. Check that the QR code is displayed in the console
3. Try restarting the AI agent: `npm run ai-agent`

### OpenAI API Issues

1. Verify your OpenAI API key is correct
2. Check your OpenAI account has sufficient credits
3. Ensure the API key has the necessary permissions

### GitHub Repository Access

1. For private repositories, make sure you have a valid GitHub token
2. Check that the repository URL is accessible
3. Verify the repository contains code files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details