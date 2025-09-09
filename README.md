# Tale and Trail Generator

A focused web application for generating location-based mystery and adventure pub crawl games. Create engaging narrative content with clear story progression, location transitions, and puzzle sequences similar to "The Quayside Conspiracy" format.

## Features

### 🎯 Core Functionality
- **Game Generation Wizard**: Step-by-step creation process
- **AI Content Generation**: Integrated with OpenAI, Claude, and Google AI
- **Location Management**: Dynamic placeholders for easy city swapping
- **Content Editor**: Live preview and rich text editing
- **Export Options**: Clean text and JSON formats

### 🎮 Game Types
- **Mystery**: Detective stories, crime solving, investigations
- **Historical**: Period pieces, historical events, time travel
- **Fantasy**: Magic, mythical creatures, enchanted adventures
- **Sci-Fi**: Futuristic, technology, space exploration
- **Comedy**: Humorous situations, light-hearted fun
- **Horror**: Spooky stories, supernatural elements

### 🧩 Puzzle Types
- **Logic Puzzles**: Reasoning, deduction, elimination
- **Observation**: Visual clues, details, patterns
- **Cipher/Code**: Encrypted messages, codes, symbols
- **Deduction**: Eliminate suspects, find contradictions
- **Local Knowledge**: Landmarks, street names, pub features

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI GPT-4, Anthropic Claude, Google Gemini
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- AI API key (OpenAI, Anthropic, or Google)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taleandtrailgenerator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

   # AI API Keys (choose one or more)
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `src/lib/database/schema.sql`
   - Enable Row Level Security (RLS)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main tables:

### `user_profiles`
- Extends Supabase auth.users
- Stores user role and profile information

### `games`
- Stores complete game data including content JSON
- Includes location placeholders for easy city swapping
- Tracks creation and update timestamps

### `game_templates`
- Pre-built story frameworks for different themes
- Public read access, admin write access

## Usage

### Creating a Game

1. **Sign up/Login** to your account
2. **Click "Create New Game"** on the dashboard
3. **Configure Game Settings**:
   - Choose theme, city, and difficulty
   - Set number of pubs and puzzles per pub
   - Set estimated duration
4. **Generate Story Content** using AI
5. **Configure Locations** with actual pub names and details
6. **Customize Puzzles** and add progressive clues
7. **Review and Save** your game

### Game Structure

Each game follows this structure:
```
📍 Intro → 🍺 Pub 1 (2-3 puzzles) → 🍺 Pub 2 (2-3 puzzles) → 
🍺 Pub 3 (2-3 puzzles) → 🍺 Pub 4 (2-3 puzzles) → 
🍺 Pub 5 (2-3 puzzles) → 🎯 Resolution
```

### Location Placeholders

Games use placeholder system for easy adaptation:
- `{PUB_1}`, `{PUB_2}`, etc. throughout content
- Bulk location swapping for different cities
- Maintains story coherence across locations

### Export Options

- **Plain Text**: Human-readable format for easy copy/paste
- **JSON**: Structured data for integration with other apps
- **Print-friendly**: Clean formatting for offline use

## API Endpoints

### Games
- `GET /api/games` - List user's games
- `POST /api/games` - Create new game
- `GET /api/games/[id]` - Get specific game
- `PUT /api/games/[id]` - Update game
- `DELETE /api/games/[id]` - Delete game

### AI Generation
- `POST /api/generate-game` - Generate game content using AI

## Development

### Project Structure
```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── game-generator/ # Game creation wizard
│   ├── game-preview/   # Game preview components
│   ├── layout/         # Layout components
│   └── ui/             # Shadcn/ui components
├── lib/                # Utility libraries
│   ├── ai/             # AI service integration
│   ├── database/       # Database queries and schema
│   └── supabase/       # Supabase client configuration
└── types/              # TypeScript type definitions
```

### Key Components

- **GameGenerator**: Main wizard for creating games
- **Dashboard**: Game library and management
- **GamePreview**: Full game preview with export options
- **AIService**: Handles multiple AI providers
- **DatabaseService**: Supabase database operations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Version history and game templates
- [ ] Advanced puzzle types and mechanics
- [ ] Collaborative game creation
- [ ] Mobile app companion
- [ ] Analytics and game performance tracking
- [ ] Community sharing and marketplace